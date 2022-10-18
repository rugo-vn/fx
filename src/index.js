import { path } from 'ramda';
import { Fx } from './fx.js';

export const name = 'fx';

export * as actions from './actions.js';

export const started = async function () {
  this.fx = new Fx({
    mode: 'file',
    locals: path(['settings', 'fx', 'locals'], this)
  });
};
