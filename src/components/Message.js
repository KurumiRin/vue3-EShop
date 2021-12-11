import { h, render } from 'vue'
import XtxMessage from '@/components/xtx-message.vue'

// 动态的给body创建一个盒子
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
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
  render(vNode, div)

  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, duration)
}
