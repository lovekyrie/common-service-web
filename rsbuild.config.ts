import path from 'node:path'
import { defineConfig } from '@rsbuild/core'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginVue } from '@rsbuild/plugin-vue'
import AutoImport from 'unplugin-auto-import/rspack'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/rspack'

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginSass(),
  ],
  resolve: {
    // 设置别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  source: {
    entry: {
      index: path.resolve(__dirname, './src/main.ts'),
    },
    // 注入环境变量，确保 process.env 在客户端可用
    define: {
      'process.env.VUE_APP_DEV_MODULE': JSON.stringify(process.env.VUE_APP_DEV_MODULE),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  },
  html: {
    template: './public/index.html',
    templateParameters: {
      title: 'Common Service Web',
      BASE_URL: process.env.VUE_APP_BASE_URL || '/',
    },
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      const DEV_MODULE = process.env.VUE_APP_DEV_MODULE

      // 自动导入配置
      appendPlugins([
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ])

      // --- 核心优化：按文件夹物理忽略 ---
      if (process.env.NODE_ENV === 'development' && DEV_MODULE) {
        const allModules = ['accounting', 'demo', 'expenseType', 'knowledge', 'product', 'service']
        const otherModules = allModules.filter(m => m !== DEV_MODULE)

        if (allModules.includes(DEV_MODULE)) {
          console.log(`\n🚀 [Rsbuild 极速模式] 仅编译模块: ${DEV_MODULE}`)

          // 使用 Rspack 的内置规则拦截不需要的模块
          config.module?.rules?.unshift({
            test: (filePath: string) => {
              return otherModules.some(m =>
                filePath.includes(path.join('src', 'views', m)),
              )
            },
            type: 'javascript/auto',
            loader: 'null-loader',
          })
        }
      }
    },
  },
  server: {
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: true, // 如果目标网站证书有问题可以设置为 false
      },
    },
  },
  performance: {
    // 开启构建耗时统计
    printFileSize: true,
  },
})
