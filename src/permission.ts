import router from './router'
import store from './store'

router.beforeEach((to, form, next) => {
  if (to.name !== 'login') {
    // 如果没有登录
    if (!store.state.userInfo)
      next({ name: 'login' })
  }
  // 其他情况正常执行
  next()
})
