/**
 * qiankun Vue3 子应用入口
 */

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useUserStore } from './store'

import './style/index.css'
import './styles/global.scss'
import './permission'

let app: ReturnType<typeof createApp> | null = null

// 解决 Element Plus ResizeObserver loop limit exceeded 报错
function debounce(fn: (...args: any[]) => void, delay: number) {
  let timer: any = null
  return (...args: any[]) => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback: (...args: any[]) => void) {
    super(debounce(callback, 20))
  }
}

/**
 * qiankun 生命周期钩子
 */

// bootstrap 只会在子应用初始化的时候调用一次
export async function bootstrap() {
  console.log('[vue3-subapp] bootstrap')
}

// mount 当子应用被挂载时调用
export async function mount(props: any) {
  console.log('[vue3-subapp] mount', props)

  app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  // 初始化用户信息
  const userStore = useUserStore()
  userStore.initUserInfo()

  // 挂载到指定容器
  const container = props.container
  if (container) {
    app.mount(container.querySelector('#app') || '#app')
  }
  else {
    app.mount('#app')
  }
}

// unmount 当子应用被卸载时调用
export async function unmount() {
  console.log('[vue3-subapp] unmount')
  if (app) {
    app.unmount()
    app = null
  }
}

// 独立运行时（不通过 qiankun）
if (!(window as any).__POWERED_BY_QIANKUN__) {
  app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  const userStore = useUserStore()
  userStore.initUserInfo()

  app.mount('#app')
}
