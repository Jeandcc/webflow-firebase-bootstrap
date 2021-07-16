import { baseConfig, pageEntries } from './config/webpackBase.js';

import path from 'path';

baseConfig.mode = 'production';

export default [
  {
    name: 'Pages',
    entry: pageEntries,
    output: {
      path: path.resolve(process.cwd(), 'public/scripts/'),
    },
    ...baseConfig,
  },
];
