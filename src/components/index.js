// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'

import { h, render } from 'vue'
import XtxMessage from '@/components/xtx-message.vue'
import XtxConfirm from '@/components/xtx-confirm.vue'

export default {
  install(app) {
    //  全局注册组件
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)

    //  获取所有.vue结尾文件,通过.keys()可以获取到每一个的路径
    const ctx = require.context('./', false, /\.vue$/)
    ctx.keys().forEach(item => {
      //  ctx同时也是函数，可以接收一个参数(路径)
      const component = ctx(item).default
      app.component(component.name, component)
    })

    // 定义指令
    // <img :src="item.src" alt="" />
    // <img v-lazy="item.src" alt="" />
    app.directive('lazy', {
      mounted(el, { value }) {
        // 图片的懒加载逻辑
        // 参数1：回调函数
        // 参数2：可选的配置
        const observer = new IntersectionObserver(
          ([{ isIntersecting }], observer) => {
            if (isIntersecting) {
              // 停止监听
              observer.unobserve(el)
              // 给el元素设置src属性
              // value = '123.jpg'
              el.src = value
              // 如果图片加载失败，显示默认的图片
              el.onerror = function () {
                el.src = require('@/assets/images/200.png')
              }
            }
          },
          {
            threshold: 0
          }
        )
        observer.observe(el)
      }
    })

    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }

}

// 动态的给body创建一个盒子
const messageDiv = document.createElement('div')
messageDiv.setAttribute('class', 'xtx-message-container')
document.body.appendChild(messageDiv)
let timer = null
export function Message({ type, text, duration = 2000 }) {
  // 渲染XtxMessage组件
  // 使用js动态的给box中渲染一段结构
  // 参数1：生成的虚拟DOM的标签名
  // 参数2：是一个对象 用于指定属性
  // 参数3：子元素的内容 可以是字符串，也可以是虚拟DOM
  // const vNode = h(XtxMessage, { type }, text)
  const vNode = h(XtxMessage, { type, text })
  // 参数1：虚拟DOM
  // 参数2：挂载的DOM
  render(vNode, messageDiv)

  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, messageDiv)
  }, duration)
}

const confirmDiv = document.createElement('div')
confirmDiv.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(confirmDiv)
/**
 *
 * @param {*} title 确认框标题
 * @param {*} text  确认框的内容
 * @return Promise
 */
export function Confirm({ title, text }) {
  return new Promise((resolve, reject) => {
    // 1.创建虚拟节点
    // <XtxConfirm ::title="title" ::text="text"></XtxConfirm>
    const cancelCallback = () => {
      reject(new Error('取消'))
      render(null, confirmDiv)
    }
    const confirmCallback = () => {
      resolve()
      render(null, confirmDiv)
    }

    const vNode = h(XtxConfirm, { title, text, cancelCallback, confirmCallback })
    render(vNode, confirmDiv)
  })
}
