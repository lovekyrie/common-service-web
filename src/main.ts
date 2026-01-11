import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { useUserStore } from './store'

import './style/index.css'
import './styles/global.scss' // 引入全局 Sass 样式
import './permission'

// 解决 Element Plus ResizeObserver loop limit exceeded 报错
const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: any = null
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
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

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router)

// 初始化用户信息（从 sessionStorage 恢复）
const userStore = useUserStore()
userStore.initUserInfo()

app.mount('#app')
