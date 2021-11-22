import request from '@/utils/request'

export function findAllCategory() {
  return request({
    method: 'get',
    url: '/home/category/head'
  })
}
