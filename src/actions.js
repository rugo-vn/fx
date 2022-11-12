import { FsId } from '@rugo-vn/service';

export const run = async function ({ appId, path: filePath, model, locals = {} }) {
  const getFn = async function (nextFilePath) {
    const fileId = FsId.fromPath(nextFilePath);

    const { data: file } = await this.call('model.get', { id: fileId, name: model });

    return file.data.toText();
  };

  const modelFn = function (name) {
    const that = this;
    const modelName = appId ? `${appId}.${name}` : name;
    return {
      async get (id) {
        return await that.call('model.get', { name: modelName, id });
      },
      async find (args) {
        return await that.call('model.find', { ...args, name: modelName });
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
