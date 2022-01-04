<template>
  <div class='xtx-goods-page'>
    <div class="container">
      <!-- 面包屑 -->
      <div style="height:72px">
        <XtxBread v-if="goods.categories">
          <XtxBreadItem to="/">首页</XtxBreadItem>
          <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
          <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
          <XtxBreadItem>{{goods.name}}</XtxBreadItem>
        </XtxBread>
      </div>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods?.mainPictures"></GoodsImage>
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <!-- 名字区组件 -->
          <GooodsName :goods="goods"></GooodsName>
          <!-- 规格组件 -->
          <GoodsSku v-if="goods.skus" :goods="goods"></GoodsSku>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>
<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GooodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import { ref, watch } from 'vue'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GooodsName, GoodsSku },
  setup() {
    //  获取商品的数据
    const goods = useGoods()
    return {
      goods
    }
  }
}

function useGoods() {
  const goods = ref({})
  const route = useRoute()
  watch(() => route.params.id, async (value) => {
    const res = await findGoods(value)
    goods.value = res.result
  }, {
    immediate: true
  })
  return goods
}

</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
