import type { RouteConfig } from 'vue-router'
import Layout from '@/views/Layout.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'), // 页面刚进入的时候肯定需要显示，所以不需要懒加载
  },
  {
    path: '/',
    redirect: 'service',
    component: Layout,
    children: [
      {
        path: '/service',
        name: 'service',
        component: () => import(/* webpackChunkName: "service" */ '@/views/service/list.vue'),
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue'),
      },
      {
        path: '/product',
        redirect: { name: 'productList' },
        component: () => import(/* webpackChunkName: "product" */ '@/views/product/index.vue'),
        children: [
          {
            path: 'list',
            name: 'productList',
            component: () => import(/* webpackChunkName: "product" */ '@/views/product/list.vue'),
          },
          {
            path: 'edit',
            name: 'productEdit',
            component: () => import(/* webpackChunkName: "product" */ '@/views/product/edit.vue'),
          },
        ],
      },
      {
        path: '/expense-type',
        name: 'expenseType',
        component: () => import(/* webpackChunkName: "expenseType" */ '@/views/expenseType/index.vue'),
      },
      {
        path: '/accounting',
        name: 'accounting',
        component: () => import(/* webpackChunkName: "accounting" */ '@/views/accounting/index.vue'),
      },
    ],
  },

]

const router = new VueRouter({
  routes,
})

export default router
