const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { name } = require('./package.json')

module.exports = defineConfig({
  transpileDependencies: true,
  // 多页面配置
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      title: '主应用'
    },
    'micro-main': {
      entry: 'src/micro-main.ts',
      template: 'public/micro-main.html',
      title: 'qiankun 主应用'
    },
    'subapp-vue2': {
      entry: 'vue2-application/life-cycle-vue2.ts',
      template: 'public/subapp-vue2.html',
      title: 'Vue2 子应用'
    },
    'subapp-vue3': {
      entry: 'vue3-application/life-cycle-vue3.ts',
      template: 'public/subapp-vue3.html',
      title: 'Vue3 子应用'
    }
  },
  configureWebpack: {
    output: {
      // 子应用导出配置
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      chunkLoadingGlobal: `webpackJsonp_${name}`,
    },
    plugins: [
      // 只在开发环境启用Bundle Analyzer
      ...(process.env.NODE_ENV === 'development' ? [new BundleAnalyzerPlugin()] : []),
    ],
    devtool: 'source-map',
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          // @import "@/assets/styles/variables.scss";
          // @import "@/assets/styles/mixins.scss";
        `,
      },
    },
  },
  devServer: {
    // pnpm/npm 通用：由 serve:main 注入 VUE_OPEN_MICRO_MAIN（勿把 /micro-main.html 放 cli，会被当成 entry）
    ...(process.env.VUE_OPEN_MICRO_MAIN === '1' && { open: '/micro-main.html' }),
    hot: true,
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws',
    },
    // 允许子应用跨域访问
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/subapp\/vue2/, to: '/micro-main.html' },
        { from: /^\/subapp\/vue3/, to: '/micro-main.html' },
      ],
    },
    proxy: {
      '/api': {
        target: 'https://feng-fortitude.com',
        changeOrigin: true,
      },
    },
  },
})
