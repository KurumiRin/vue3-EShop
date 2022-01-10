import request from '@/utils/request'

/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品ID
 */
export const findCommentInfoByGoods = id => {
  return request({
    // url: `/goods/${id}/evaluate`,
    url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    method: 'get'
  })
}

// https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate

/**
 * 获取商品的评论的分页信息
 * @param {String} id - 商品ID
 */
export const findCommentListByGoods = (id, reqParams) => {
  return request({
    url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    method: 'get',
    params: reqParams
  })
}
