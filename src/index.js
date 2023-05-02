import { defineAction } from '@rugo-vn/service';
import { mergeDeepLeft } from 'ramda';
import { Fx } from './fx.js';

let allows = [];
let hooks = {};

defineAction('start', async function (settings) {
  allows = settings.allows || [];
  hooks = settings.hooks || [];
});

defineAction('run', async function (args) {
  const filePath = args.entry;
  const fx = new Fx(
    mergeDeepLeft(
      {
        locals: {
          call: (addr, args, opts) => {
            if (allows.indexOf(addr) === -1)
              throw new Error(`Fx do not allow to call ${addr}`);

            return this.call(addr, args, opts);
          },
        },
        hooks,
      },
      args
    )
  );

  return await fx.run(filePath);
});
