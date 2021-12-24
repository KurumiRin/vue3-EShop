import request from '@/utils/request'

/**
 * 获取首页头部所有的分类信息
 * @returns Promise
 */
export function findAllCategory() {
  return request({
    method: 'get',
    url: '/home/category/head'
  })
}

/**
 * 获取单个顶级分类信息
 * @param {String} id - 顶级分类ID
 */
export function findTopCategory(id) {
  return request({
    method: 'get',
    url: '/category',
    params: {
      id
    }
  })
}

/**
 *  获取二级分类筛选条件数据
 * @param {String} id -  二级分类ID
 */
export function findSubCategoryFilter(id) {
  return request({
    method: 'get',
    url: '/category/sub/filter',
    params: {
      id
    }
  })
}

/**
 * 获取二级分类下的商品数据
 * @param {*} data
 * @returns
 */
export function findSubCategoryGoods(data) {
  return request({
    method: 'post',
    url: '/category/goods/temporary',
    data
  })
}
