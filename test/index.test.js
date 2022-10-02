/* eslint-disable */

import { expect } from "chai";
import { Fx } from "../src/index.js";

const SAMPLE_INLINE_CODE = `
  await (new Promise((resolve) => {
    setTimeout(() => { resolve(123) }, 100);
  }));
`;

const SAMPLE_BLOCK_CODE = `
const a = 100;
const b = 20;
const c = 3;

return a + b + c;
`;

const SAMPLE_EJS_CODE = `
<html>
  <head>
    <title><%= 7 * 7 %> years later.</title>
  </head>
  <body>
    <%= 'hello world'.toUpperCase() %>
    <%= a + b + c %>
  </body>
</html>
`;

const SAMPLE_INCLUDE_JS = `
const code = await include('two.ejs', { c: 3 });

return '200 OK ' + code;
`;

describe('Fx test', () => {
  it('should run directly', async () => {
    // inline
    const res = await Fx.run(SAMPLE_INLINE_CODE, { mode: 'inline'} );
    expect(res).to.be.eq(123);

    // block
    const res2 = await Fx.run(SAMPLE_BLOCK_CODE);
    expect(res2).to.be.eq(123);
  });

  it('should run in instance', async () => {
    const fx = new Fx();
    
    // inline
    const res = await fx.run(SAMPLE_INLINE_CODE, { mode: 'inline'} );
    expect(res).to.be.eq(123);

    // block
    const res2 = await fx.run(SAMPLE_BLOCK_CODE);
    expect(res2).to.be.eq(123);
  });

  it('should run ejs', async () => {
    const res = await Fx.run(SAMPLE_EJS_CODE, { type: 'ejs', locals: { a: 100, b: 20, c: 3 } });
    expect(res).to.be.eq(`\n<html>\n  <head>\n    <title>49 years later.</title>\n  </head>\n  <body>\n    HELLO WORLD\n    123\n  </body>\n</html>\n`);
  });

  it('should run file mode', async () => {
    const fx = new Fx({
      async get(name) {
        if (name === 'one.js') {
          return SAMPLE_INCLUDE_JS;
        }

        return SAMPLE_EJS_CODE;
      },
      locals: {
        a: 100,
        b: 20,
        c: 9
      }
    })
    
    const res = await fx.run(`one.js`, { mode: 'file', locals: { c: 5 } });
    expect(res).to.be.eq(`200 OK \n<html>\n  <head>\n    <title>49 years later.</title>\n  </head>\n  <body>\n    HELLO WORLD\n    123\n  </body>\n</html>\n`);
  });

  it('should locals', async () => {
    const fx = new Fx({
      locals: {
        a: 100, b: 20, c: 9
      }
    });

    const res = await fx.run(`a + b + c`, { mode: 'inline', locals: { c: 3 } });
    expect(res).to.be.eq(123);
  });
});