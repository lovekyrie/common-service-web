const path = require('node:path')
const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const AutoImport = require('unplugin-auto-import/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const Components = require('unplugin-vue-components/webpack')

class StartupTimePlugin {
  constructor() {
    this.startTime = Date.now()
  }

  apply(compiler) {
    compiler.hooks.done.tap('StartupTimePlugin', () => {
      const endTime = Date.now()
      const duration = ((endTime - this.startTime) / 1000).toFixed(2)
      console.log(`\n\x1B[32m DONE \x1B[0m Project startup time: \x1B[1;33m${duration}s\x1B[0m\n`)
    })
  }
}

const targetModule = process.env.VUE_APP_MODULE

module.exports = defineConfig({
  transpileDependencies: false, // 不转译依赖，提升启动速度
  parallel: true, // 开启多线程构建，显著提升大型项目编译速度
  lintOnSave: false, // 开发环境关闭保存时 lint，提升热更新速度
  // 确保 publicPath 正确
  publicPath: '/',
  configureWebpack: {
    cache: {
      type: 'filesystem', // 开启 Webpack 5 持久化缓存，极大提升二次启动速度
      buildDependencies: {
        config: [__filename],
      },
    },
    plugins: [
      new StartupTimePlugin(),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: true,
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: true,
        imports: ['vue', 'vue-router', 'pinia'],
      }),
      // 按需编译：如果指定了 VUE_APP_MODULE，则将其余模块的 views 替换为 Dummy 组件
      ...(targetModule
        ? [
            new webpack.NormalModuleReplacementPlugin(
              /@\/views\/(.+)\.vue/,
              (resource) => {
                const request = resource.request
                // 排除基础页面和当前目标模块
                const isBasePage = /Layout|Login|App/.test(request)
                const isTargetModule = request.includes(`views/${targetModule}`)

                if (!isBasePage && !isTargetModule) {
                  resource.request = path.resolve(__dirname, 'src/components/internal/Empty.vue')
                }
              },
            ),
          ]
        : []),
      // Bundle Analyzer 按需启动：npm run serve -- --report
      ...(process.env.npm_config_report ? [new BundleAnalyzerPlugin()] : []),
    ],
    // 开发环境使用更快的 source-map
    devtool: process.env.NODE_ENV === 'development' ? 'eval-cheap-module-source-map' : 'source-map',
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
      // 忽略特定的运行时错误蒙层
      overlay: {
        runtimeErrors: (error) => {
          const ignoreErrors = [
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications.',
          ]
          if (ignoreErrors.includes(error.message)) {
            return false
          }
          return true
        },
      },
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
