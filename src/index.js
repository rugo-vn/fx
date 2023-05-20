import { defineAction } from '@rugo-vn/service';
import { mergeDeepLeft } from 'ramda';
import { Fx } from './fx.js';

let hooks = {};

defineAction('start', async function (settings) {
  hooks = settings.hooks || [];
});

defineAction('run', async function (args) {
  delete args.hooks; // only allow hooks from the setting

  const filePath = args.entry;
  const fx = new Fx(mergeDeepLeft({ hooks }, args));
  fx.call = this.call;

  return await fx.run(filePath);
});
