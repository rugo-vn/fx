import { FsId } from '@rugo-vn/service';

export const run = async function ({ path: filePath, model, locals = {} }) {
  const getFn = async function (nextFilePath) {
    const fileId = FsId.fromPath(nextFilePath);

    const { data: file } = await this.call('model.get', { id: fileId, name: model });

    return file.data.toText();
  };

  const modelFn = function (name) {
    const that = this;
    return {
      async get (id) {
        return await that.call('model.get', { name, id });
      },
      async find (query) {
        return await that.call('model.find', { name, query });
      }
    };
  };

  return await this.fx.run(filePath, {
    get: getFn.bind(this),
    locals: {
      ...locals,
      model: modelFn.bind(this)
    }
  });
};
