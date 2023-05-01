import { extname } from 'node:path';
import { clone, mergeDeepLeft } from 'ramda';
import ejs from 'ejs';
import { rethrow } from './methods.js';

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

  if (!code) throw new Error(`File ${filePath} was not found`);

  const include = function (nextPath, nextLocals) {
    nextLocals = mergeDeepLeft(nextLocals, locals);
    return this.run(nextPath, mergeDeepLeft({ locals: nextLocals }, opts));
  }.bind(this);

  if (ext === '.js') {
    const Ctor = new Function('return (async function(){}).constructor;')(); // eslint-disable-line

    // wrap exception
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

    const fn = new Ctor('include, rethrow, locals', code);
    return await fn.apply({}, [include, rethrow, locals]);
  }

  if (ext === '.ejs') {
    return await ejs.render(code, mergeDeepLeft({ include }, locals), {
      async: true,
    });
  }

  throw new Error(`Invalid type ${ext}`);
};

Fx.prototype.run = Fx.run;
