const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(),
    ],
    devtool: 'source-map',
  },
  devServer: {
    hot: true,
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws',
    },
  },
})
