import { FileCursor } from '@rugo-vn/service';

export const name = 'model';

export const actions = {
  get ({ id: fileId }) {
    let data = {};

    switch (fileId.toPath()) {
      case 'index.js':
        data = FileCursor('return 1 + 2 + 3;');
        break;

      case 'include.ejs':
        data = FileCursor('Total is: <%= await include(\'index.js\') %>');
        break;
    }

    return {
      data: {
        _id: fileId,
        name: fileId.toPath(),
        data
      }
    };
  }
};
