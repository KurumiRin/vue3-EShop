import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/layout'
import Home from '@/views/home'
import store from '@/store'

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
      },
      {
        path: '/product/:id',
        component: () => import('@/views/goods')
      },
      {
        path: '/cart',
        component: () => import('@/views/cart')
      },
      {
        path: '/member/checkout',
        component: () => import('@/views/member/pay/checkout')
      },
      {
        path: '/member/pay',
        component: () => import('@/views/member/pay')
      },
      {
        path: '/pay/callback',
        component: () => import('@/views/member/pay/result')
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
  routes,
  scrollBehavior(to, from) {
    return {
      // 跳转路由后始终滚动到页面顶部
      top: 0
    }
  }
})

// 不能通过useStore来获取store对象,useStore只能在setup里使用
router.beforeEach((to, from, next) => {
  // 判断用户是否登录
  const token = store.state.user.profile.token
  if (token) {
    next()
  } else {
    if (to.path.includes('/member')) {
      // 需要登录才能访问
      localStorage.setItem('redirectUrl', to.fullPath)
      next({
        path: '/login',
        query: {
          redirectUrl: to.fullPath
        }
      })
    } else {
      next()
    }
  }
})

export default router
