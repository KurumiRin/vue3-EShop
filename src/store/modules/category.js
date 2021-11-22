import { findAllCategory } from '@/api/category'
import { topCategory } from '@/api/constants'
export default {
  namespaced: true,
  state: () => {
    return {
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList(state, list) {
      state.list = list
    },
    show(state, id) {
      const category = state.list.find(category => category.id === id)
      category.open = true
    },
    hide(state, id) {
      const category = state.list.find(category => category.id === id)
      category.open = false
    }
  },
  actions: {
    async getList(context) {
      const { result } = await findAllCategory()
      result.forEach(item => {
        item.open = false
      })
      context.commit('setList', result)
    }
  }
}
