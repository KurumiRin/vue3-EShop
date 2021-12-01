import request from '@/utils/request'

/**
 * 获取热门品牌数据
 * @param {*} limit 获取品牌的数量
 * @returns Promise
 */
export function findBrand(limit = 6) {
  return request({
    method: 'get',
    url: '/home/brand',
    params: {
      limit
    }
  })
}

/**
 * 获取首页轮播图数据
 * @returns Promise
 */

export function findBanner() {
  return request({
    method: 'get',
    url: '/home/banner'
  })
}

/**
 * 新鲜好物
 * @returns Promise
 */
export function findNew() {
  return request({
    method: 'get',
    url: 'home/new'
  })
}

/**
 * 人气推荐
 * @returns Promise
 */
export function findHot() {
  return request({
    method: 'get',
    url: 'home/hot'
  })
}
