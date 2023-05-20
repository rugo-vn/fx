/* eslint-disable */

import { assert, expect } from 'chai';
import { Fx } from '../src/fx.js';

const SAMPLE_JS_CODE = `
return _.add(a, b) + c;
`;

const SAMPLE_EJS_CODE = `
<html>
  <head>
    <title><%= 7 * 7 %> years later <%= fn() %></title>
  </head>
  <body>
    <%= 'hello world'.toUpperCase() %>
    <%= a + b + c %>
  </body>
</html>
`;

const INCLUDE_JS_CODE = `
  return 'js-' + await include(next.value);
`;

const INCLUDE_EJS_CODE =
  'ejs-<%- await include(next.value, { next: next.next }) %>';

const ERROR_JS_CODE = "throw new Error('something wrong');";

describe('Fx test', function () {
  it('should run with global opts', async () => {
    const fx = new Fx({
      files: {
        'a.js': SAMPLE_JS_CODE,
        'b.ejs': SAMPLE_EJS_CODE
      },
      locals: {
        a: 100,
        b: 20,
        c: 3,
        fn() {
          return 'x';
        }
      }
    });

    const res = await fx.run('a.js');
    expect(res).to.be.eq(123);

    const res2 = await fx.run('b.ejs');
    expect(res2).to.be.eq(
      '\n<html>\n  <head>\n    <title>49 years later x</title>\n  </head>\n  <body>\n    HELLO WORLD\n    123\n  </body>\n</html>\n'
    );
  });

  it('should run with local opts', async () => {
    const fx = new Fx();

    const res = await fx.run('a.js', {
      files: {
        'a.js': SAMPLE_JS_CODE,
        'b.ejs': SAMPLE_EJS_CODE
      },
      locals: { a: 100, b: 20, c: 3 }
    });
    expect(res).to.be.eq(123);

    const res2 = await fx.run('b.ejs', {
      files: {
        'a.js': SAMPLE_JS_CODE,
        'b.ejs': SAMPLE_EJS_CODE
      },
      locals: {
        a: 100,
        b: 20,
        c: 3,
        fn() {
          return 'x';
        }
      }
    });
    expect(res2).to.be.eq(
      '\n<html>\n  <head>\n    <title>49 years later x</title>\n  </head>\n  <body>\n    HELLO WORLD\n    123\n  </body>\n</html>\n'
    );
  });

  it('should include', async () => {
    const fx = new Fx({
      files: {
        'a.js': SAMPLE_JS_CODE,
        'b.js': INCLUDE_JS_CODE,
        'c.ejs': INCLUDE_EJS_CODE
      },
      locals: { a: 100, b: 20, c: 3 }
    });

    const res = await fx.run('c.ejs', {
      locals: { next: { value: 'b.js', next: { value: 'a.js' } } }
    });
    expect(res).to.be.eq('ejs-js-123');
  });

  it('should throw error', async () => {
    const fx = new Fx({
      files: {
        'a.js': ERROR_JS_CODE
      }
    });

    try {
      await fx.run('a.js');
      assert.fail('should error');
    } catch (e) {
      expect(e).to.has.property('message', 'something wrong');
    }
  });

  it('should convert function to string', async () => {
    const obj = {
      fn: async (name) => {
        return await this.call(name);
      }
    };

    const fnStr = obj.fn.toString().trim();

    expect(fnStr).to.be.eq(
      'async (name) => {\n        return await this.call(name);\n      }'
    );
  });
});
