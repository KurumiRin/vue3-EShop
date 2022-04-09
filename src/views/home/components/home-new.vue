<template>
  <HomePanel ref="target" title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
    <template #right>
      <XtxMore to="/"></XtxMore>
    </template>
    <Transition name="fade">
      <!-- 面板内容 -->
      <ul class="goods-list" v-if="goods.length">
        <li v-for="item in goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img v-lazy="item.picture" alt="" />
            <p class="name ellipsis">{{item.name}}</p>
            <p class="price">&yen;{{item.price}}</p>
          </RouterLink>
        </li>
      </ul>
      <HomeSkeleton bg="#fff" v-else></HomeSkeleton>
    </Transition>
  </HomePanel>
</template>

<script>
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findNew } from '@/api/home'
// import { ref } from 'vue'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNew',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup(props) {
    // const goods = ref([])
    // findNew().then(data => {
    //   goods.value = data.result
    // })
    const { target, list: goods } = useLazyData(findNew)
    return {
      goods,
      target
    }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
