import type { RouteConfig } from 'vue-router'
import Layout from '@/views/Layout.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    redirect: '/service',
    component: Layout,
    children: [
      {
        path: '/service',
        name: 'service',
        component: () => import('@/views/service/list.vue'),
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
      },
      {
        path: '/product',
        redirect: { name: 'productList' },
        component: () => import('@/views/product/index.vue'),
        children: [
          {
            path: 'list',
            name: 'productList',
            component: () => import('@/views/product/list.vue'),
          },
          {
            path: 'edit',
            name: 'productEdit',
            component: () => import('@/views/product/edit.vue'),
          },
        ],
      },
      {
        path: '/expense-type',
        name: 'expenseType',
        component: () => import('@/views/expenseType/index.vue'),
      },
      {
        path: '/accounting',
        name: 'accounting',
        component: () => import('@/views/accounting/index.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
