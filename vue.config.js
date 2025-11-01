const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const AutoImport = require('unplugin-auto-import/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const Components = require('unplugin-vue-components/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      // 只在开发环境启用Bundle Analyzer
      ...(process.env.NODE_ENV === 'development' ? [new BundleAnalyzerPlugin()] : []),
    ],
    devtool: 'source-map',
  },
  css: {
    loaderOptions: {
      sass: {
        // 全局引入 sass 变量和 mixins（可选）
        additionalData: `
          // @import "@/assets/styles/variables.scss";
          // @import "@/assets/styles/mixins.scss";
        `,
      },
    },
  },
  devServer: {
    hot: true,
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws',
    },
    proxy: {
      '/api': {
        target: 'https://feng-fortitude.com',
        changeOrigin: true,
      },
    },
  },
})
