<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <!-- 渲染 -->
    <div class="layer" v-if="visible">
      <GoodsSku @changeSku="changeSku" :goods="goods" :skuId="skuId"></GoodsSku>
      <XtxButton type="primary" size="mini" style="margin-left:60px" @click="submit">
        确认
      </XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { getSpecsAndSkus } from '@/api/cart'
import { onClickOutside } from '@vueuse/core'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
import { Message } from '@/components/index'
export default {
  name: 'CartSku',
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  components: {
    GoodsSku
  },
  setup(props, { emit }) {
    const visible = ref(false)
    const toggle = () => {
      visible.value = !visible.value
    }
    const target = ref(null)
    onClickOutside(target, () => {
      visible.value = false
    })

    // 获取商品数据
    const goods = ref({})
    getSpecsAndSkus(props.skuId).then(res => {
      goods.value = res.result
    })

    // 选择SKU时候触发
    const currSku = ref({})
    const changeSku = sku => {
      currSku.value = sku
      // console.log('sku发生了变化', sku)
    }

    // 点击确认的时候，提交sku信息给购物车组件
    const submit = () => {
      // 给购物车组件数据的前提：有sku信息，sku信息完整，sku中的skuId不能现有props.skuId一样
      if (currSku.value.id && currSku.value.id !== props.skuId) {
        emit('change', currSku.value)
        visible.value = false
      } else {
        Message({ type: 'warn', text: '请修改规格' })
      }
    }
    return {
      visible,
      toggle,
      goods,
      target,
      changeSku,
      submit
    }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
  }
}
</style>
