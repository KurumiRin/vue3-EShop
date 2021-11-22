import { createStore } from 'vuex'
import category from './modules/category'
export default createStore({
  strict: process.env.NODE_ENV === 'development',
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    category
  }
})
