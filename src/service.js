import { path } from 'ramda';
import { Fx } from './index.js';

export const name = 'fx';

export const actions = {
  async run({ name: originName }, nextCall) {
    const getSetting = path(['settings', 'fx', 'get'], this) || {};
    const defineArgs = getSetting.args || {};

    const getFn = async function(name) {
      const nextArgs = {};

      for (let key in defineArgs) {
        if (key[0] !== '_') {
          nextArgs[key] = defineArgs[key];
          continue;
        }

        nextArgs[key.substring(1)] = await Fx.run(defineArgs[key], { mode: 'inline', locals: { name }});
      }

      return await nextCall(getSetting.action, nextArgs);
    }

    return await this.fx.run(originName, { mode: 'file', get: getFn });
  }
}

export const started = async function() {
  this.fx = new Fx({
    mode: 'file',
    locals: path(['settings', 'fx', 'locals'], this),
  });
}