import { createStore } from 'vuex'
import category from './modules/category'
import user from './modules/user'
import cart from './modules/cart'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  strict: process.env.NODE_ENV === 'development',
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    category,
    user,
    cart
  },
  // 指定插件
  plugins: [
    createPersistedState({
      key: 'rabbit-vue',
      paths: ['user', 'cart'],
      storage: localStorage
    })
  ]
})
