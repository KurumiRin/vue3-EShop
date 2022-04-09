import axios from 'axios'
import store from '@/store'

export const instance = axios.create({
  // baseURL: 'http://pcapi-xiaotuxian-front.itheima.net/',
  baseURL: 'https://apipc-xiaotuxian-front.itheima.net/',
  timeout: 5000
})

//  请求拦截器
instance.interceptors.request.use(
  function (config) {
    const { profile } = store.state.user
    // 判断是否有token
    if (profile.token) {
      // 设置token
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

//  响应拦截器
instance.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default instance
