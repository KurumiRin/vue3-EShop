// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'

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
  }

}
