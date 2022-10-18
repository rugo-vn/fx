/* eslint-disable */

import { createBroker } from '@rugo-vn/service';
import { expect } from 'chai';

const DEFAULT_ARGS = {
  schema: { _name: 'demo' },
  schemas: [],
}

describe('model test', () => {
  let broker;

  before(async () => {
    // create broker
    broker = createBroker({
      _services: [
        './src/index.js',
        './test/model.service.js',
      ],
    });

    await broker.loadServices();
    await broker.start();
  });

  after(async () => {
    await broker.close();
  });

  it('should run code', async () => {
    const res = await broker.call('fx.run', {
      path: 'index.js',
      ...DEFAULT_ARGS,
    });
    
    expect(res).to.be.eq(6);
  });

  it('should run include code', async () => {
    const res = await broker.call('fx.run', {
      path: 'include.ejs',
      ...DEFAULT_ARGS,
    });
    
    expect(res).to.be.eq(`Total is: 6`);
  });
});