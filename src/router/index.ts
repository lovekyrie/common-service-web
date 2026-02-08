import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const businessRoutes: Array<RouteRecordRaw> = [
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
    path: '/knowledge',
    name: 'knowledge',
    component: () => import(/* webpackChunkName: "knowledge" */ '@/views/knowledge/index.vue'),
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
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "demo" */ '@/views/demo/DeptUserSelectorDemo.vue'),
  },
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'), // 页面刚进入的时候肯定需要显示，所以不需要懒加载
  },
  {
    path: '/',
    redirect: 'service',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/Layout.vue'),
    children: businessRoutes,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
