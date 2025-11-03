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
    // 配置 historyApiFallback，排除 /api 路径，确保 API 请求走代理
    historyApiFallback: {
      disableDotRule: true,
      index: '/index.html',
      // 只对非 API 路径进行路由回退
      rewrites: [
        // 排除所有 /api 开头的路径（返回 false 表示不走 historyApiFallback）
        { from: /^\/api/, to: false },
        // 其他所有路径回退到 index.html
        { from: /./, to: '/index.html' },
      ],
    },
    // 代理配置：所有 /api 开头的请求都会被代理到目标服务器
    proxy: {
      '/api': {
        target: 'https://feng-fortitude.com',
        changeOrigin: true,
        secure: true,
        ws: false,
        // 明确处理：对于 API 请求，始终走代理
        bypass: (req) => {
          // 如果请求路径以 /api 开头，且不是 HTML 请求，则走代理
          if (req.url.startsWith('/api')) {
            // 检查 Accept 头，如果是 HTML 请求（可能是浏览器直接访问），也走代理
            // 因为我们的 historyApiFallback 已经处理了这种情况
            return null // null 表示走代理
          }
          return false // false 表示不走代理
        },
        // 日志级别，方便调试
        logLevel: 'debug',
      },
    },
  },
})
