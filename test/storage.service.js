import { writeFileSync } from 'fs';
import { FileCursor } from '@rugo-vn/service';
import temp from 'temp';

export const name = 'storage';

export const actions = {
  get ({ path: filePath }) {
    let content = '';

    switch (filePath) {
      case 'index.js':
        content = 'return 1 + 2 + 3;';
        break;

      case 'include.ejs':
        content = 'Total is: <%= await include(\'index.js\') %>';
        break;
    }

    const tmpPath = temp.path({ prefix: 'rugo-' });
    writeFileSync(tmpPath, content);

    return {
      data: FileCursor(tmpPath),
    };
  }
};
