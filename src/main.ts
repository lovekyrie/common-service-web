import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import './style/index.css'
import './permission'

const app = createApp(App)
const pinia = createPinia()
app.use(router).use(pinia).mount('#app')
