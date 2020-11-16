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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin()],
};

const pageEntries = {
  // home: "./src/pages/home/index.ts",
};

module.exports = { baseConfig, pageEntries };
