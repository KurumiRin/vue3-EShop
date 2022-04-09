<template>
  <div class="xtx-pay-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>支付订单</XtxBreadItem>
      </XtxBread>
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>支付还剩 <span>{{ timeDownCount.value }}</span>, 超时后将取消订单</p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ order.totalMoney }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:;" @click="open"></a>
          <a class="btn alipay" :href="alipayUrl" target="_blank" @click="open"></a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
    </div>
  </div>
  <XtxDialog title="正在支付..." v-model:visible="dialogVisible">
    <div class="pay-wait">
      <img src="@/assets/images/load.gif" alt="">
      <div v-if="order">
        <p>如果支付成功：</p>
        <RouterLink :to="`/member/order/${order.id}`">查看订单详情></RouterLink>
        <p>如果支付失败：</p>
        <RouterLink to="/">查看相关疑问></RouterLink>
      </div>
    </div>
  </XtxDialog>
</template>
<script>
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useCounter } from '@/hooks'
import dayjs from 'dayjs'
import instance from '@/utils/request'
export default {
  name: 'XtxPayPage',
  setup() {
    const route = useRoute()
    const order = ref({})
    const timeDownCount = ref('')
    findOrder(route.query.id).then(res => {
      order.value = res.result
      const { time, start } = useCounter(res.result.countdown)

      timeDownCount.value = computed(() => {
        return formatTime(time.value)
      })
      start()
    })

    const formatTime = (time) => {
      // const s = time % 60
      // const m = time / 60 | 0
      // return `${m}分${s}秒`
      return dayjs.unix(time).format('mm分ss秒')
    }

    const alipayUrl = computed(() => {
      if (order.value) {
      // 准备支付地址
        const payUrl = instance.defaults.baseURL + 'pay/aliPay'
        // 支付回跳地址()
        const redirectUrl = encodeURIComponent('http://www.corho.com:8080/#/pay/callback')
        return `${payUrl}?orderId=${order.value.id}&redirect=${redirectUrl}`
      } else {
        return 'javascript:;'
      }
    })

    // 支付提示
    const dialogVisible = ref(false)

    // 打开函数
    const open = () => {
      dialogVisible.value = true
    }

    return {
      order,
      timeDownCount,
      alipayUrl,
      dialogVisible,
      open
    }
  }
}
</script>
<style scoped lang="less">
.pay-wait {
  display: flex;
  justify-content: space-around;
  p {
    margin-top: 30px;
    font-size: 14px;
  }
  a {
    color: @xtxColor;
  }
}
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .tip {
    padding-left: 10px;
    flex: 1;
    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: @priceColor;
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;
    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: @xtxColor;
    }
    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
        no-repeat center / contain;
    }
    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
        no-repeat center / contain;
    }
  }
}
</style>
