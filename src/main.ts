import { Aside, Container, Footer, Header, Main, Menu, MenuItem } from 'element-ui'
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import store from './store'

import './style/index.css'

Vue.component(Container.name, Container)
Vue.component(Header.name, Header)
Vue.component(Main.name, Main)
Vue.component(Footer.name, Footer)
Vue.component(Aside.name, Aside)
Vue.component(Menu.name, Menu)
Vue.component(MenuItem.name, MenuItem)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
