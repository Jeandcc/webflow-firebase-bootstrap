import VueLoaderPlugin from 'vue-loader/lib/plugin.js';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

export const baseConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
    extensions: ['.tsx', '.ts', '.js', '.css'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [new VueLoaderPlugin(), new CleanWebpackPlugin()],
  optimization: {
    runtimeChunk: 'single',
    usedExports: true,
  },
};

export const pageEntries = {
  shared: ['vue'],

  home: {
    import: './src/pages/home/index.ts',
    dependOn: 'shared',
  },
};
