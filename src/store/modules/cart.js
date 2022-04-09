import { getNewCartGoods, mergeLocalCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'
export default {
  namespaced: true,
  state: {
    // 存放购物车的列表
    list: []
  },
  mutations: {
    // 加入购物车
    /**
     *  payload的参数
     *  id: 商品的id
     *  name: 商品的名字
     *  picture:  商品的图片
     *  price:  加入时的价格
     *  count:  加入购物车商品的数量
     *  skuId:  选择的商品的sku
     *  attrsText:  商品的规格的字符串  颜色：蓝色  尺寸：30cm
     *  selected: 商品是否选中
     *  nowPrice: 商品最新的价格
     *  stock:  商品的库存
     *  isEffective:  商品是否有效
     */

    // 1.判断payload中的skuId在list中是否存在
    // 2.如果有，就把数量加上，并且把这件商品放到最上面
    // 3.如果没有，就把这件商品放到列表最前面
    insertCart(state, payload) {
      const index = state.list.findIndex(item => item.skuId === payload.skuId)
      if (index > -1) {
        // 说明购物车中已经有相同的商品
        payload.count += state.list[index].count
        // 把购物车的那件商品删除
        state.list.splice(index, 1)
      }
      state.list.unshift(payload)
    },
    // 更新购物车商品信息
    updateCart(state, goods) {
      const sku = state.list.find(item => item.skuId === goods.skuId)
      for (const k in goods) {
        if (goods[k] !== null && goods[k] !== undefined && goods[k] !== '') {
          sku[k] = goods[k]
        }
      }
      // sku.isEffective = goods.isEffective
      // sku.nowPrice = goods.nowPrice
      // sku.stock = goods.stock
    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车列表
    setCartList(state, list) {
      state.list = list
    }
  },
  actions: {
    insertCart(context, payload) {
      return new Promise((resolve, reject) => {
        // context.rootState可以拿到其他模块的
        if (context.rootState.user.profile.token) {
          // 用户登录账号
          // 发送请求
          insertCart(payload).then(() => {
            // 插入成功，重新发请求，获取最新的购物车数据
            context.dispatch('updateCart')
            resolve()
          })
        } else {
          // 判断用户是否登录，如果用户登录，发送请求，否则直接提交mutation
          context.commit('insertCart', payload)
          resolve()
        }
      })
    },
    updateCart(context) {
      // 发送请求，更新购物车中所有的商品信息
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录了
          // 发送请求，获取在线的购物车数据
          findCartList().then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 没有登录，需要发送请求进行商品信息更新
          const requestArr = context.state.list.map(item => {
            return getNewCartGoods(item.skuId)
          })
          Promise.all(requestArr).then(res => {
            res.forEach((item, index) => {
              context.commit('updateCart', {
                skuId: context.state.list[index].skuId,
                ...item.result
              })
            })
            resolve()
          })
        }
      })
    },
    // 删除购物车商品
    deleteCart(context, skuId) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          deleteCart([skuId]).then(() => {
            context.dispatch('updateCart')
            resolve()
          })
        } else {
          // 本地
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    updateChange(context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // TODO 发送请求
          updateCart(payload).then(() => {
            context.dispatch('updateCart')
          })
        } else {
          context.commit('updateCart', payload)
        }
      })
    },
    // 做有效商品的全选&反选
    changeAll(context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          const ids = context.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            context.dispatch('updateCart')
          })
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          context.getters.validList.forEach(item => {
            context.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除选中商品
    batchDeleteCart(context, isClear) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          const ids = context.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            context.dispatch('updateCart')
          })
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutataions函数
          context.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 修改sku规格函数
    updateCartSku(context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods]).then(() => {
            return insertCart({
              skuId: newSku.id,
              count: oldGoods.count
            })
          }).then(() => {
            context.dispatch('updateCart')
          })
        } else {
          // 本地
          // 但你修改了sku的时候其实skuId需要更改，相当于把原来的信息移出，创建一条新的商品信息。
          // 1. 获取旧的商品信息
          debugger
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          // 2. 删除旧的商品
          context.commit('deleteCart', oldSkuId)
          // 3. 合并一条新的商品信息
          const newGoods = {
            ...oldGoods,
            skuId: newSku.id,
            nowPrice: newSku.price,
            stock: newSku.inventory,
            attrsText: newSku.specs.reduce(
              (p, v) => `${p} ${v.name}: ${v.valueName}`,
              ''
            )
          }
          // 4. 去插入即可
          context.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 合并本地购物车
    async mergeLocalCart(context) {
      // 存储token后调用合并API接口函数进行购物车合并
      const cartList = context.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      // 合并成功后将本地购物车删除
      context.commit('setCartList', [])
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      // 有效的商品列表：1、库存>0  2、isEffective：false
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      // return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      return getters.validList.reduce((p, c) => p + c.nowPrice * c.count, 0).toFixed(2)
    },
    // 无效商品列表
    invalidList(state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList(state, getters) {
      return getters.validList.filter(item => item.selected)
    }, // 选中商品件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount(state, getters) {
      return getters.selectedList.reduce((p, c) => p + (c.nowPrice * 100 * c.count), 0) / 100
    },
    // 是否全选
    isCheckAll(state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  }
}
