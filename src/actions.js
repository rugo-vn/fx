import { FsId } from '@rugo-vn/service';

export const run = async function ({ path: filePath, schema: fileSchema, schemas, locals = {} }) {
  const getFn = async function (nextFilePath) {
    const fileId = FsId.fromPath(nextFilePath);

    const { data: file } = await this.call('model.get', { id: fileId, schema: fileSchema });

    return file.data.toText();
  };

  return await this.fx.run(filePath, {
    get: getFn.bind(this),
    locals
  });
};
