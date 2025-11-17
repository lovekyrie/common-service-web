import router from './router'

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token) {
    next({ name: 'login' })
    return
  }
  // 如果访问登录页，直接放行
  if (to.name === 'login') {
    next()
    return
  }

  // 已登录，正常放行
  next()
})
