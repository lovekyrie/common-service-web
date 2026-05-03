import Vue from 'vue'
import App from './App.vue'
import { setupPermission } from './permission'

import router from './router'
import store from './store'

import './style/index.css'
import './load-third-components'

Vue.config.productionTip = false
setupPermission(router)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
