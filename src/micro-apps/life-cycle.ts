/**
 * qiankun 微前端入口文件
 * 这个文件用于将当前 Vue2 应用导出为 qiankun 子应用
 */

import './public-path'
import Vue from 'vue'
import App from '../App.vue'
import { createRouter } from '../router'
import store from '../store'
import { setupPermission } from '../permission'

import '../style/index.css'
import '../load-third-components'

Vue.config.productionTip = false

let instance: InstanceType<typeof Vue> | null = null

/**
 * 导出 qiankun 生命周期钩子
 */

// bootstrap 只会在子应用初始化的时候调用一次
export async function bootstrap() {
  console.log('[vue2-subapp] bootstrap')
}

// mount 当子应用被挂载时调用
export async function mount(props: any) {
  console.log('[vue2-subapp] mount', props)
  const router = createRouter()
  setupPermission(router)

  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount(props.container ? props.container.querySelector('#app') : '#app')

  // 如果父应用传入了 props，可以在这里处理
  if (props.onGlobalStateChange) {
    props.onGlobalStateChange((state: any) => {
      console.log('[vue2-subapp] global state changed:', state)
    }, true)
  }
}

// unmount 当子应用被卸载时调用
export async function unmount() {
  console.log('[vue2-subapp] unmount')
  if (instance) {
    instance.$destroy()
    instance.$el.innerHTML = ''
    instance = null
  }
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  const router = createRouter()
  setupPermission(router)

  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
}
