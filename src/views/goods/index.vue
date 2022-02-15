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
          <GoodsSku v-if="goods.skus" :goods="goods" @changeSku="changeSku"></GoodsSku>
          <!-- 数量组件 -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory" />
          <!-- 按钮组件 -->
          <XtxButton type="primary" style="margin-top:20px;" @click="addCart">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id"></GoodsRelevant>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs></GoodsTabs>
          <!-- 注意事项 -->
          <GoodsWarn></GoodsWarn>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot v-for="item in hotArr" :key="item.id" :type="item.id" :title="item.title"></GoodsHot>
        </div>
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
import GoodsTabs from './components/goods-tabs.vue'
import GoodsWarn from './components/goods-warn.vue'
import GoodsHot from './components/goods-hot.vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import { provide, ref, watch } from 'vue'
import { Message } from '@/components'
import { useStore } from 'vuex'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GooodsName,
    GoodsSku,
    GoodsTabs,
    GoodsWarn,
    GoodsHot
  },
  setup() {
    //  获取商品的数据
    const goods = useGoods()
    const currentSku = ref({})
    const changeSku = (sku) => {
      if (sku.id) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 把传过来的sku保存起来
      currentSku.value = sku
    }

    const num = ref(1)
    provide('goods', goods)

    // 热榜的数据
    const hotArr = ref([
      {
        id: 1,
        title: '24小时热销榜'
      },
      {
        id: 2,
        title: '周热销榜'
      },
      {
        id: 3,
        title: '总热销榜'
      }
    ])
    const store = useStore()
    const addCart = async () => {
      if (!currentSku.value.id) {
        return Message({ type: 'warn', text: '请选择完整信息' })
      }
      // 加入购物车
      await store.commit('cart/insertCart', {
        id: goods.value.id,
        name: goods.value.name,
        picture: goods.value.mainPictures[0],
        price: currentSku.value.price,
        count: num.value,
        skuId: currentSku.value.id,
        selected: false,
        nowPrice: currentSku.value.price,
        stock: currentSku.value.inventory,
        isEffective: true,
        attrsText: currentSku.value.specs.reduce((prev, item) => `${prev} ${item.name}: ${item.valueName}`, '')
      })
      Message({ type: 'success', text: '加入购物车成功' })
    }

    return {
      goods,
      changeSku,
      num,
      hotArr,
      addCart
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
