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
