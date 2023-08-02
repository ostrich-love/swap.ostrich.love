const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
  webpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

      return webpackConfig
    }
  }
}