let { baseConfig, pageEntries } = require("./config/webpackBase");

const path = require("path");

baseConfig.mode = "production";

module.exports = [
  {
    name: "Pages",
    entry: pageEntries,
    output: {
      path: path.resolve(__dirname, "public/scripts/"),
    },
    ...baseConfig,
  },
];
