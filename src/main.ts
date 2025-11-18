import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { useUserStore } from './store'

import './style/index.css'
import './styles/global.scss' // 引入全局 Sass 样式
import './permission'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router)

// 初始化用户信息（从 sessionStorage 恢复）
const userStore = useUserStore()
userStore.initUserInfo()

app.mount('#app')
