<template>
  <div class="member-order-page">
    <XtxTabs v-model="activeName" @tabClick="tabClick">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <!-- {{item.label}} -->
        <div class="order-list">
          <div v-if="loading" class="loading"></div>
          <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
          <OrderItem
            v-for="item in orderList"
            :key="item.id"
            :order="item"
            @onCancel="onCancel"
            @onDelete="onDelete"
            @onConfirm="onConfirm"
            @onLogistics="onLogistics"
          ></OrderItem>
        </div>
        <!-- 分页组件 -->
        <XtxPagination
          v-if="total > requestParams.pageSize"
          @current-change="requestParams.page = $event"
          :total="total"
          :page-size="requestParams.pageSize"
          :current-page="requestParams.page"
        ></XtxPagination>
      </XtxTabsPanel>
    </XtxTabs>
  </div>
  <OrderCancel ref="target"></OrderCancel>
  <OrderLogistics ref="logisticsOrderCom"></OrderLogistics>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { delteOrder, findOrderList, confirmOrder } from '@/api/order'
import OrderItem from './components/order-item.vue'
import OrderCancel from './components/order-cancel.vue'
import OrderLogistics from './components/order-logistics.vue'
import { Confirm, Message } from '@/components'
export default {
  name: 'MemberOrderPage',
  components: {
    OrderItem,
    OrderCancel,
    OrderLogistics
  },
  setup() {
    const activeName = ref('all')
    // 发送请求获取订单数据
    // 查询订单参数
    const requestParams = reactive({
      orderState: 0,
      page: 1,
      pageSize: 10
    })
    // 控制tab切换动画
    const loading = ref(true)
    const total = ref(0)
    // 订单列表
    const orderList = ref([])

    // 封装获取订单列表的方法
    const findList = () => {
      loading.value = true
      findOrderList(requestParams).then(res => {
        orderList.value = res.result.items
        // 总共订单条数
        total.value = res.result.counts
        loading.value = false
        // console.log(orderList.value)
      })
    }
    // 查询订单
    watch(requestParams, () => {
      findList()
    }, {
      immediate: true
    })

    const tabClick = ({ tab, index }) => {
      // console.log('click')
      requestParams.orderState = index
    }

    // 取消按钮：后续封装
    // const onCancel = (order) => {
    //   target.value.open(order)
    // }

    const target = ref(null)

    const onDelete = item => {
      Confirm({ text: '您确认删除该条订单吗？' })
        .then(() => {
          delteOrder([item.id]).then(() => {
            Message({ text: '删除订单成功', type: 'success' })
            // 重新渲染
            findList()
          })
        })
        .catch(e => { })
    }

    // // 封装逻辑-确认收货
    // const onConfirm = item => {
    //   Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' })
    //     .then(() => {
    //       confirmOrder(item.id).then(() => {
    //         Message({ text: '确认收货成功', type: 'success' })
    //         // 重新渲染
    //         findList()
    //         item.orderState = 4
    //       })
    //     })
    //     .catch(e => { })
    // }

    // 查看物流的ref
    const logisticsOrderCom = ref(null)

    // 查看物流
    const onLogistics = item => {
      logisticsOrderCom.value.open(item)
    }
    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      requestParams,
      // onCancel,
      ...useCancel(target),
      target,
      onDelete,
      // onConfirm,
      ...useConfirm(findList),
      onLogistics,
      logisticsOrderCom
    }
  }
}

export const useConfirm = (fn) => {
  // 封装逻辑-确认收货
  const onConfirm = item => {
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' })
      .then(() => {
        confirmOrder(item.id).then(() => {
          Message({ text: '确认收货成功', type: 'success' })
          // 重新渲染
          fn && fn()
          item.orderState = 4
        })
      })
      .catch(e => { })
  }
  return {
    onConfirm
  }
}

export const useCancel = (target) => {
  const onCancel = (order) => {
    target.value.open(order)
  }

  return {
    onCancel
  }
}
</script>
<style scoped lang="less">
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}

.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(~@/assets/images/loading.gif)
    no-repeat center 200px;
}

.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}

.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;

  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;

    span {
      margin-right: 20px;

      &.down-time {
        margin-right: 0;
        float: right;

        i {
          vertical-align: middle;
          margin-right: 3px;
        }

        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }

    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }

  .body {
    display: flex;
    align-items: stretch;

    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;

      > p {
        padding-top: 10px;
      }

      &:first-child {
        border-left: none;
      }

      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;

        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;

            &:last-child {
              border-bottom: none;
            }

            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }

            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;

              p {
                margin-bottom: 5px;

                &.name {
                  height: 38px;
                }

                &.attr {
                  color: #999;
                  font-size: 12px;

                  span {
                    margin-right: 5px;
                  }
                }
              }
            }

            .price {
              width: 100px;
            }

            .count {
              width: 80px;
            }
          }
        }
      }

      &.state {
        width: 120px;

        .green {
          color: @xtxColor;
        }
      }

      &.amount {
        width: 200px;

        .red {
          color: @priceColor;
        }
      }

      &.action {
        width: 140px;

        a {
          display: block;

          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
