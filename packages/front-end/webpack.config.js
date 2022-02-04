import path from 'path';
import webpack from 'webpack';
import VueLoaderPlugin from 'vue-loader/lib/plugin.js';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';


const IS_LOCAL_DEV = process.argv.includes('-w');

export default {
  mode: IS_LOCAL_DEV ? 'development' : 'production',

  name: IS_LOCAL_DEV ? 'Local Overrides' : 'Public Pages',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            ts: [
              {
                loader: 'ts-loader',
                options: {
                  appendTsSuffixTo: [/\.vue$/],
                },
              },
            ],
          },
          options: {
            esModule: true,
          },
        },
      },
    ],
  },

  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.tsx', '.ts', '.js', '.css'],
    alias: { vue$: 'vue/dist/vue.esm.js' },
  },

  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
    }),
  ],

  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    usedExports: true,
  },

  entry: {
    'home': {
      import: './src/pages/home/index.ts',
    },
  },

  output: {
    path: IS_LOCAL_DEV
      ? path.resolve(process.cwd(),`local-project-xxx/project-xxx.web.app/scripts/`,)
      : path.resolve(process.cwd(), `public/scripts/`),
  },
};
