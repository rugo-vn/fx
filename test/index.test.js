import { spawnService } from '@rugo-vn/service';
import { pack } from '@rugo-vn/service/src/wrap.js';
import { assert, expect } from 'chai';

describe('Service test', function () {
  let service;
  it('should spawn servier', async () => {
    service = await spawnService({
      name: 'fx',
      exec: ['node', './src/index.js'],
      cwd: './',
      async hook(addr, args, opts) {
        return await pack(() => opts.data);
      },
      settings: {
        hooks: {
          greet: (async (name) => await this.call(name) + 1).toString()
        },
      },
    });

    await service.start();
  });

  it('should call run', async () => {
    const res = await service.call(
      'run',
      {
        entry: 'a.js',
        files: {
          'a.js': 'return await greet("calc")',
        },
      },
      {
        data: 'hello',
      }
    );

    expect(res).to.be.eq('hello1');
  });

  it('should not call from file', async () => {
    try {
      await service.call(
        'run',
        {
          entry: 'a.js',
          files: {
            'a.js': 'return this.call("calc")',
          },
        },
        {
          data: 'hello',
        }
      );
      assert.fail('should error');
    } catch(err) {
      expect(err).to.has.property('message', 'this.call is not a function');
    }
  });

  it('should stop', async () => {
    await service.stop();
  });
});
