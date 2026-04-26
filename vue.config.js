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
      entry: 'src/micro-apps/life-cycle.ts',
      template: 'public/subapp-vue2.html',
      title: 'Vue2 子应用'
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
