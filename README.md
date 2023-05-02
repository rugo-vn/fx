# Rugo Fx

Rugo Fx for running code.

## Usage

```js
const fx = new Fx(globalOpts);
const res = await fx.run('filePath', localOpts);
```

- `globalOpts` will merged with `localOpts` when run with `localOpts` high priority.

```js
const opts = {
  files: {
    '/path/to/file/a': 'file_content',
    '/path/to/file/b': 'file_content',
    '/path/to/file/c': 'file_content',
  },
  locals: {
    'name': /* module that you want to bind */
  },
  hooks: {
    before: 'string of code',
    after: 'string of code',
  },
};
```

We both support `.js` and `.ejs` file, and determine these file in the path.

- `.js` return value.
- `.ejs` return entire file as string after render.

You can execute another file by `await include('filePath', locals)`.

We can run some code before or after every run call. Note that `before` and `after` is only accept `js` code. `after` will provide `$pre` as prevous return.

## Context

We provide some context modules and methods.

- `moment`.
- `_` as known as **lodash**.

## Service

We can also fx with service.

```js
const res = await service.call(
  'run',
  {
    entry: 'filePath',
    ...otherFxOpts,
  },
  opts
);
```

### Call

We provide `call` methods that you want to communicate other action's service.

To allow call methods, please config in the settings:

```js
const settings = {
  allows: [
    /* white list of action to want fx context to execute */
  ],
};
```

Run call in context:

```js
const res = await call(addr, args, opts);
```

## License

MIT.
