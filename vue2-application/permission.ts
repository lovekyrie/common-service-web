import type VueRouter from 'vue-router'
import store from './store'

export function setupPermission(router: VueRouter) {
  router.beforeEach((to, form, next) => {
    if (to.name !== 'login' && !store.state.userInfo) {
      next({ name: 'login' })
      return
    }

    next()
  })
}
