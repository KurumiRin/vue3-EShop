import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import Layout from '@/views/layout'
import Home from '@/views/home'
import store from '@/store'
// import { h } from 'vue'

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
      },
      {
        path: '/member',
        component: () => import('@/views/member/layout'),
        children: [
          {
            // 个人中心
            path: '/member',
            component: () => import('@/views/member/home')
          },
          {
            // 订单
            // 解决模糊匹配路由高亮的问题
            // 具体详情看：https://github.com/vuejs/rfcs/blob/master/active-rfcs/0028-router-active-link.md#unrelated-but-similiar-routes
            path: '/member/order',
            // component: { render: () => h(RouterView) },
            component: RouterView,
            children: [
              {
                // 订单
                path: '/member/order',
                component: () => import('@/views/member/order')
              },
              {
                // 订单详情
                path: '/member/order/:id',
                component: () => import('@/views/member/order/detail')
              }
            ]
          }
        ]
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
  // 全局修改类名
  // linkExactActiveClass: 'active'
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
