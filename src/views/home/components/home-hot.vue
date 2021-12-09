<template>
  <HomePanel ref="target" title="人气推荐" sub-title="人气爆款 不容错过">
    <Transition name="fade">
      <ul ref="pannel" class="goods-list" v-if="goods.length">
        <li v-for="item in goods" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" alt="">
            <p class="name">{{item.title}}</p>
            <p class="desc">{{item.alt}}</p>
          </RouterLink>
        </li>
      </ul>
      <HomeSkeleton bg="#fff" v-else></HomeSkeleton>
    </Transition>
  </HomePanel>
</template>

<script>
// import { ref } from 'vue'
import HomePanel from './home-panel'
import HomeSkeleton from './home-skeleton.vue'
import { findHot } from '@/api/home'
// import { useIntersectionObserver } from '@vueuse/core'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNew',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // const goods = ref([])

    //  参数1: 需要监听的元素
    //  参数2: 回调函数   isIntersecting：是否在可视区
    //  stop： 停止监听
    const { target, list: goods } = useLazyData(findHot)
    // const { stop } = useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
    //   if (isIntersecting) {
    //     findHot().then(res => {
    //       goods.value = res.result
    //     })
    //     stop()
    //   }
    // })
    return {
      goods,
      target
    }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
