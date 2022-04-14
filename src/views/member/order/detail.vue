<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 -->
    <DetailSteps :order="order" />
    <!-- 物流栏 -->
    <Suspense>
      <template #default>
        <DetailLogistics :order="order"></DetailLogistics>
      </template>
      <template #fallback>
        <div class="loading">Loading...</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
  </div>
</template>
<script>
import DetailAction from './components/detail-action'
import DetailSteps from './components/detail-steps'
import DetailLogistics from './components/detail-logistics'
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
export default {
  name: 'OrderDetailPage',
  components: {
    DetailAction,
    DetailSteps,
    DetailLogistics
  },
  setup() {
    const order = ref(null)
    const route = useRoute()
    findOrder(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
}
.loading {
  text-align: center;
}
</style>
