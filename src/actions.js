import moment from 'moment';
import { mergeDeepLeft } from 'ramda';
import { Secure } from '@rugo-vn/shared';

export const run = async function ({ id, entry, locals, spaceId }) {
  const getFn = async function (nextFilePath) {
    const file = await this.call('storage.get', { ...id, path: nextFilePath });

    return file.data.toText();
  };

  const tableFn = function (tableName) {
    const that = this;
    return new Proxy(
      {},
      {
        get(_, prop) {
          return (args) =>
            that.call(
              `db.${prop}`,
              mergeDeepLeft({ spaceId, tableName }, args)
            );
        },
      }
    );
  };

  return await this.fx.run(entry, {
    get: getFn.bind(this),
    locals: {
      ...locals,
      table: tableFn.bind(this),
      Secure,
      moment,
    },
  });
};
