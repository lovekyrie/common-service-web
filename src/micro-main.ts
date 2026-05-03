/**
 * qiankun 主应用入口
 * 这个文件用于启动 qiankun 主应用
 */

import { initGlobalState, registerMicroApps, setDefaultMountApp, start } from 'qiankun'
import Vue from 'vue'
import VueRouter from 'vue-router'
import MicroMainApp from './MicroMainApp.vue'
import store from './store'

import './style/index.css'
import './style/micro-main-shell.css'

Vue.config.productionTip = false
Vue.use(VueRouter)

const microRouter = new VueRouter({
  mode: 'history',
  routes: [],
})

// 初始化全局状态
const actions = initGlobalState({
  user: null,
  token: null,
})

// 注册子应用
registerMicroApps([
  {
    name: 'common-service-web-subapp-vue2',
    entry: `${process.env.BASE_URL}subapp-vue2.html`,
    container: '#subapp-container',
    activeRule: location => location.pathname.startsWith('/subapp/vue2'),
    props: {
      onGlobalStateChange: actions.onGlobalStateChange,
      setGlobalState: actions.setGlobalState,
    },
  },
  {
    name: 'vue3-subapp',
    entry: `${process.env.BASE_URL}subapp-vue3.html`,
    container: '#subapp-container',
    activeRule: location => location.pathname.startsWith('/subapp/vue3'),
    props: {
      onGlobalStateChange: actions.onGlobalStateChange,
      setGlobalState: actions.setGlobalState,
    },
  },
], {
  beforeLoad: [
    (app: any) => {
      console.log('[主应用] before load', app.name)
      return Promise.resolve()
    },
  ],
  beforeMount: [
    (app: any) => {
      console.log('[主应用] before mount', app.name)
      return Promise.resolve()
    },
  ],
  afterMount: [
    (app: any) => {
      console.log('[主应用] after mount', app.name)
      return Promise.resolve()
    },
  ],
  afterUnmount: [
    (app: any) => {
      console.log('[主应用] after unmount', app.name)
      return Promise.resolve()
    },
  ],
})

// 设置默认加载的子应用
setDefaultMountApp('/subapp/vue2')

// strict / experimental 样式隔离均会破坏或干扰 Element UI 的全局样式与弹出层，子应用内按需关闭
start({
  prefetch: true,
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: false,
  },
})

// 挂载主应用
new Vue({
  router: microRouter,
  store,
  render: h => h(MicroMainApp),
}).$mount('#micro-main-app')
