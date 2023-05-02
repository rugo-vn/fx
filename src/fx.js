import { extname } from 'node:path';
import { clone, mergeDeepLeft } from 'ramda';
import ejs from 'ejs';
import { rethrow } from './methods.js';
import lodash from 'lodash';
import moment from 'moment';

export function Fx(opts = {}) {
  if (!(this instanceof Fx)) {
    return new Fx(opts);
  }

  this.globalOpts = opts;
}

Fx.run = async function (filePath, opts = {}) {
  opts = mergeDeepLeft(opts, this.globalOpts || {});

  const locals = clone(opts.locals || {});
  const files = opts.files || {};
  const ext = extname(filePath);
  let code = files[filePath];

  const before = opts.hooks?.before || '';
  const after = opts.hooks?.after || '';

  if (!code) throw new Error(`File ${filePath} was not found`);

  const include = function (nextPath, nextLocals) {
    nextLocals = mergeDeepLeft(nextLocals, locals);
    return this.run(nextPath, mergeDeepLeft({ locals: nextLocals }, opts));
  }.bind(this);

  const runFn = async function (code, args) {
    const Ctor = new Function('return (async function(){}).constructor;')(); // eslint-disable-line

    code =
      'try {' +
      '\n' +
      'with (locals) {' +
      '\n' +
      code +
      '\n' +
      '}' +
      '\n' +
      '} catch (e) {' +
      '\n' +
      '  rethrow(e);' +
      '\n' +
      '}' +
      '\n';

    const paramNames = Object.keys(args);
    const params = [];
    for (const name of paramNames) params.push(args[name]);

    const fn = new Ctor(paramNames.join(', '), code);
    return await fn.apply({}, params);
  };

  if (ext === '.js') {
    if (before) code = before + '\n' + code;
    const pre = await runFn(code, {
      include,
      rethrow,
      locals,
      moment,
      _: lodash,
    });

    if (after)
      return await runFn(after, {
        include,
        rethrow,
        locals,
        moment,
        _: lodash,
        $pre: pre,
      });

    return pre;
  }

  if (ext === '.ejs') {
    if (before) code = `<% ${before} %>` + code;
    const pre = await ejs.render(
      code,
      mergeDeepLeft({ include, moment, _: lodash }, locals),
      {
        async: true,
      }
    );
    if (after)
      return await runFn(after, {
        include,
        rethrow,
        locals,
        moment,
        _: lodash,
        $pre: pre,
      });
    return pre;
  }

  throw new Error(`Invalid type ${ext}`);
};

Fx.prototype.run = Fx.run;
