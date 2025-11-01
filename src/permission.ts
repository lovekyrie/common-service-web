import router from './router'
import { useUserStore } from './store'

router.beforeEach((to, form, next) => {
  const store = useUserStore()

  if (to.name !== 'login') {
    // 如果没有登录
    if (!store.userName)
      next({ name: 'login' })
  }
  // 其他情况正常执行
  next()
})
