# Rugo Fx

Rugo Fx for running code.

## Overview

It requires `@rugo-vn/storage`.

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

### Input Args

All action must have:

- `spaceId`
- `driveName`

## Actions

### `run`

Arguments:

- `entry`: Path to start run code.
- `locals` locals to bind to code

## Default Locals

### `table`

```js
const data = await table(tableName).actionName(args);
```

It will call `db.<action>`, with inherit `spaceId`.

## License

MIT.


<!-- 
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



## Actions

### `run`

Arguments:

- `path` path to the file to run (could format as request url)
- `model` file model to get code (should `fs` model)
- `locals` locals to bin to code

## License

MIT -->