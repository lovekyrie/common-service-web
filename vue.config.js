const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const AutoImport = require('unplugin-auto-import/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const Components = require('unplugin-vue-components/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  // 确保 publicPath 正确
  publicPath: '/',
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
    // 配置 historyApiFallback，支持 Vue Router History 模式
    // 所有非 API 路径的请求都会回退到 index.html，让 Vue Router 处理路由
    historyApiFallback: {
      disableDotRule: true,
      index: '/index.html',
      // 明确配置：排除 /api 路径，其他所有路径都回退到 index.html
      rewrites: [
        // API 路径不走 historyApiFallback
        { from: /^\/api/, to: false },
        // 所有其他路径（包括 /login, /service 等）都回退到 index.html
        { from: /.*/, to: '/index.html' },
      ],
    },
    // 代理配置：所有 /api 开头的请求都会被代理到目标服务器
    proxy: {
      '/api': {
        target: 'https://feng-fortitude.com',
        changeOrigin: true,
        secure: true,
        ws: false,
        // 日志级别，方便调试
        logLevel: 'debug',
      },
    },
  },
})
