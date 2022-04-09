import request from '@/utils/request'

/**
 * 获取结算信息
 */
export const findCheckoutInfo = () => {
  return request({
    method: 'get',
    url: '/member/order/pre'
  })
}

/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = address => {
  return request({
    url: '/member/address',
    method: 'post',
    data: address
  })
}

/**
 * 编辑收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = address => {
  return request({
    method: 'put',
    url: `/member/address/${address.id}`,
    data: address
  })
}
