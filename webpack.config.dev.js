import { baseConfig, pageEntries } from './config/webpackBase.js';

import path from 'path';

baseConfig.mode = 'development';
export default [
  {
    name: 'Local Overrides',
    entry: pageEntries,
    output: {
      path: path.resolve(
        process.cwd(),
        'local-project-xxx/project-xxx.web.app/scripts/',
      ),
    },
    ...baseConfig,
  },
];
