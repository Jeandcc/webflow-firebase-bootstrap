const { baseConfig, pageEntries } = require("./config/webpackBase");

const path = require("path");

baseConfig.mode = "development";
module.exports = [
  {
    name: "Local Overrides",
    entry: pageEntries,
    output: {
      path: path.resolve(
        __dirname,
        "local-project-xxx/project-xxx.web.app/scripts/"
      ),
    },
    ...baseConfig,
  },
];
