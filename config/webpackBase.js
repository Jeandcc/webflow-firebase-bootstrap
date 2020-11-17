const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const baseConfig = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            ts: [
              {
                loader: "ts-loader",
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
    extensions: [".tsx", ".ts", ".js", ".css"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
  },
  plugins: [new VueLoaderPlugin(), new CleanWebpackPlugin()],
};

const pageEntries = {
  home: "./src/pages/home/index.ts",
};

module.exports = { baseConfig, pageEntries };
