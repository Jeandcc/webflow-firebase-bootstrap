/* eslint-disable import/no-extraneous-dependencies */

const path = require("path");
const nodeExternals = require("webpack-node-externals");
const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");

const basePackage = {
  name: "@project-xxx/back-end",
  version: "1.0.0",
  main: "./index.js",
  scripts: {
    start: "yarn run shell",
  },
  engines: {
    node: "12",
  },
};

module.exports = {
  target: "node",
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  entry: "./src/index.ts",
  devtool: "inline-source-map",
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
    extensions: [".tsx", ".ts", ".js", ".json"],
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@models": path.resolve(__dirname, "src/models"),
      "@services": path.resolve(__dirname, "src/services"),
      "@util": path.resolve(__dirname, "src/util"),
      "@common": path.resolve(__dirname, "src/common"),
      "@templates": path.resolve(__dirname, "src/templates"),
      "@locales": path.resolve(__dirname, "src/locales"),
    },
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
  },
  externals: [
    /^firebase.+$/,
    /^@google.+$/,
    nodeExternals({
      allowlist: [/^@project-xxx/],
    }),
    "node-fetch", // https://github.com/matthew-andrews/isomorphic-fetch/issues/194#issuecomment-737132024
  ],
  plugins: [new GeneratePackageJsonPlugin(basePackage)],
};
