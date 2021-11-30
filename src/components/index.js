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
  }

}
