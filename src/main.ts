import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import './style/index.css'
import './styles/global.scss' // 引入全局 Sass 样式
import './permission'

const app = createApp(App)
const pinia = createPinia()
app.use(router).use(pinia).mount('#app')
