<template>
  <XtxDialog title="取消订单" v-model:visible="visibleDialog">
    <!-- 组件内容 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a
          href="javascript:;"
          v-for="item in cancelReason"
          :key="item"
          @click="cancelText = item"
          :class="{ active: cancelText === item }"
        >{{ item }}</a>
      </div>
    </div>
    <!-- 按钮操作 -->
    <template #footer>
      <XtxButton type="gray" @click="visibleDialog = false" style="margin-right:20px">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref } from 'vue'
import { cancelReason } from '@/api/constants'
import { Message } from '@/components'
import { cancelOrder } from '@/api/order'
export default {
  name: 'OrderCancel',
  setup() {
    const visibleDialog = ref(false)
    const cancelText = ref('')
    // 订单信息
    const order = ref(null)
    // 打开弹窗函数，父组件可以通过ref调用
    const open = (item) => {
      visibleDialog.value = true
      cancelText.value = ''
      order.value = item
    }
    // 确定按钮
    const submit = () => {
      if (!cancelText.value) return Message({ text: '请选择取消订单的原因' })
      cancelOrder(order.value.id, cancelText.value).then(() => {
        // 取消订单成功
        Message({ type: 'success', text: '取消订单成功' })
        // 更新订单状态
        order.value.orderState = 6
        // 关闭对话框
        visibleDialog.value = false
      })
    }
    return {
      visibleDialog,
      cancelReason,
      cancelText,
      open,
      submit
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
