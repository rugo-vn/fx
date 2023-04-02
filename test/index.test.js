/* eslint-disable */

import { createBroker } from '@rugo-vn/service';
import { expect } from 'chai';

const DEFAULT_ARGS = {
  spaceId: 'demo',
  driveName: 'foo',
};

describe('test', () => {
  let broker;

  before(async () => {
    // create broker
    broker = createBroker({
      _services: ['./src/index.js', './test/storage.service.js'],
    });

    await broker.loadServices();
    await broker.start();
  });

  after(async () => {
    await broker.close();
  });

  it('should run code', async () => {
    const res = await broker.call('fx.run', {
      entry: 'index.js',
      ...DEFAULT_ARGS,
    });

    expect(res).to.be.eq(6);
  });

  it('should run include code', async () => {
    const res = await broker.call('fx.run', {
      entry: 'include.ejs',
      ...DEFAULT_ARGS,
    });

    expect(res).to.be.eq(`Total is: 6 at 2020.12.13`);
  });
});
