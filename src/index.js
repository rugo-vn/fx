import { parse } from 'path';
import ejs from 'ejs';
import { RugoException } from '@rugo-vn/service';
import { clone, mergeDeepLeft, path } from 'ramda';

function rethrow(err) {
  throw err;
}

export function Fx(opts = {}) {
  if (!(this instanceof Fx)) { return new Fx(opts); }

  this.globalOpts = opts;
}

Fx.run = async function(code = '', opts = {}) {
  opts = mergeDeepLeft(opts, this.globalOpts || {});

  let mode = opts.mode || 'block';
  let type = opts.type || 'js';

  const locals = clone(opts.locals || {});
  const getFn = opts.get;

  // check file mode
  if (mode === 'file' && typeof getFn !== 'function') {
    throw new RugoException(`Get file function was not defined.`)
  }

  if (mode === 'file') {
    const info = parse(code);
    
    type = info.ext.substring(1);
    mode = 'block';

    // get code from fn
    code = await getFn(code);
  }

  // include 
  const include = function(name, newLocals){
    const nextLocals = mergeDeepLeft(newLocals, locals);
    return this.run(name, mergeDeepLeft({ mode: 'file', locals: nextLocals }, opts));
  }.bind(this);

  // js type
  if (type === 'js'){
    const ctor = (new Function('return (async function(){}).constructor;'))();

    // convert to inline
    if (mode === 'inline') {
      code = `return ${code.trim()};`;
    }

    // wrap exception
    code = 'try {' + '\n'
      + 'with (locals) {' + '\n'
      + code + '\n'
      + '}' + '\n'
      + '} catch (e) {' + '\n'
      + '  rethrow(e);' + '\n'
      + '}' + '\n';

    const fn = new ctor('include, rethrow, locals', code);
    return await fn.apply({}, [include, rethrow, locals]);
  }

  // ejs type
  if (type === 'ejs'){
    return await ejs.render(code, mergeDeepLeft({ include }, locals));
  }

  throw new RugoException(`Not valid type ${type}`);
}

Fx.prototype.run = Fx.run;
Fx.prototype.include = Fx.include;