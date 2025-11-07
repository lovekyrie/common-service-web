import router from './router'
import { useUserStore } from './store'

router.beforeEach((to, from, next) => {
  const store = useUserStore()

  // 如果访问登录页，直接放行
  if (to.name === 'login') {
    next()
    return
  }

  // 如果访问非登录页，检查是否已登录
  if (!store.userInfo.username) {
    // 未登录，跳转到登录页
    next({ name: 'login' })
    return
  }

  // 已登录，正常放行
  next()
})
