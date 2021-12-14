import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/layout'
import Home from '@/views/home'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: Home
      },
      {
        path: '/category/:id',
        component: () => import('@/views/category')
      },
      {
        path: '/category/sub/:id',
        component: () => import('@/views/category/sub')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/login/callback',
    component: () => import('@/views/login/callback')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
