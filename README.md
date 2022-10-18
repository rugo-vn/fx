# Rugo Fx

Rugo Fx for running code.

## Overview

A code runner.

## Settings

```js
const settings = {
  fx: {
    locals: {
      /* local variable to bind to code run */,
    }
  }
}
```

## Common

### Fx

Fx Service using Fx class to run code.

```js
const fx = new Fx(/* globals opts */);
const res = await fx.run(nameOrCode, opts);

/* or */
Fx.run(nameOrCode, opts);

```

About `opts`:

```js
const opts = {
  async get(name){ /* get fn, must return code } */ },
  locals: { /* locals in code run */ },
  mode: /* some of mode `block` or `inline` or `file`, default `block` */,
  type: /* type of code `js` or `ejs`, default `js` */,
}
```

## Actions

### `run`

Arguments:

- `path` path to the file to run (could format as request url)
- `schema` file schema to search file
- `schemas` schemas for run model code
- `locals` locals to bin to code

## License

MIT