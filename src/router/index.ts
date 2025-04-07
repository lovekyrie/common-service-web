import type { RouteConfig } from 'vue-router'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HelloWorld.vue'), // 页面刚进入的时候肯定需要显示，所以不需要懒加载
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
