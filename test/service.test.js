/* eslint-disable */

import { createBroker } from '@rugo-vn/service';

const sampleService = {
  name: 'demo',

  actions: {
    get({ id, schema }) {
      console.log(id, schema);
      return `return "${id + schema}";`;
    }
  }
}

describe('model test', () => {
  let broker;

  before(async () => {
    // create broker
    broker = createBroker({
      _services: [
        './src/service.js',
      ],
      fx: {
        get: {
          action: 'demo.get',
          args: { _id: 'name' },
        }
      }
    });

    await broker.loadServices();
    broker.createService(sampleService);
    await broker.start();
  });

  after(async () => {
    await broker.close();
  });

  it('should run code', async () => {
    const res = await broker.call('fx.run', { name: 'foo.js' });
    console.log(res);
  });
});