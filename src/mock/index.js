// 用于提供数据
import Mock from 'mockjs'
import category from './category'

Mock.setup({
  timeout: '500-1000'
})

//  参数1：url地址，需要使用正则匹配
//  参数2：请求方式
//  参数3：生成数据的函数
Mock.Mock(/\/home\/category\/head/, 'get', category.headCategory)
