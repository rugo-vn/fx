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
  }
};
```

We both support `.js` and `.ejs` file, and determine these file in the path.

- `.js` return value.
- `.ejs` return entire file as string after render.

You can execute another file by `await include('filePath', locals)`.

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

We provide `call` methods that you want to communicate other action's service.

**Settings**

```js
const settings = {
  allows: [
    /* white list of action to want fx context to execute */
  ],
};
```

## License

MIT.
