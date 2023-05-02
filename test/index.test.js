import { spawnService } from '@rugo-vn/service';
import { pack } from '@rugo-vn/service/src/wrap.js';
import { expect } from 'chai';

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
        allows: ['calc'],
        hooks: {
          after: 'return $pre + 1;',
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
          'a.js': 'return await call("calc")',
        },
      },
      {
        data: 'hello',
      }
    );

    expect(res).to.be.eq('hello1');
  });

  it('should stop', async () => {
    await service.stop();
  });
});
