<template>
  <div class="goods-sku">
    <dl v-for="item in goods?.specs" :key="item.name">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img v-if="val.picture" :src="val.picture" alt="" :title="val.name" @click="changeSelected(item,val)" :class="{selected:val.selected}" />
          <span v-else @click="changeSelected(item,val)" :class="{selected:val.selected,disabled:val.disabled}">{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import PowerSet from '@/vender/bw-power-set'
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    // spec: 规格
    // val: 规格的值
    const changeSelected = (spec, val) => {
      // 如果按钮被禁用，则不执行
      if (val.disabled) return
      // 如果是选中的状态
      if (val.selected) {
        val.selected = false
      } else {
        // 取消所有的选中
        spec.values.forEach(item => {
          item.selected = false
        })
        // 让自己选中
        val.selected = true
      }
      updateDisabledStatus(props.goods.specs, pathMap)
      const arr = getSelectedSpec(props.goods.specs).filter(v => v)
      // 子传父，讲选择的sku信息传递给父组件

      // 根据skuId获取到对应的sku信息
      if (arr.length === props.goods.specs.length) {
        const skuId = pathMap[arr.join('☆')]
        const sku = props.goods.skus.find(item => item.id === skuId[0])
        emit('changeSku', sku)
      } else {
        // 如果没有选择完整的规则，则传递{}给父组件
        emit('changeSku', {})
      }
    }

    // 根据商品的skus得到一个可选的路径字典（对象）
    // 1.过滤掉没有库存的sku
    // 2.根据sku的specs属性，得到属性的子集
    // 3.根据这些子集组合成路径字典
    const pathMap = getPathMap(props.goods.skus)

    // 设置规格默认选中
    if (props.skuId) {
      const sku = props.goods.skus.find(item => item.id === props.skuId)
      props.goods.specs.forEach((item, index) => {
        const name = sku.specs[index].valueName
        // 需要先将所有selected置位false
        item.values.forEach(val => {
          val.selected = false
        })
        item.values.find(val => val.name === name).selected = true

        // item.values.forEach(val => {
        //   val.selected = false
        //   if (val.name === name) {
        //     val.selected = true
        //   }
        // })
      })
    }
    // 禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    return {
      changeSelected
    }
  }
}
/**
 * 获取路径字典
 */
function getPathMap(skus) {
  const pathMap = {}
  skus.filter(item => item.inventory > 0)
    .forEach(item => PowerSet(item.specs.map(val => val.valueName)).forEach(v => {
      const key = v.join('☆')
      pathMap[key] ? pathMap[key].push(item.id) : pathMap[key] = [item.id]
    }))
  return pathMap
}

/**
 * 控制按钮的禁用状态
 */
function updateDisabledStatus(specs, pathMap) {
  specs.forEach((spec, index) => {
    // 获取选中的属性
    const selectedValues = getSelectedSpec(specs)
    spec.values.forEach(item => {
      selectedValues[index] = item.name
      const key = selectedValues.filter(v => v).join('☆')
      item.disabled = !pathMap[key]
      // item.disabled = !pathMap[item.name]
    })
  })
}

/**
 * 获取选中的规格的值
 * 得到的结果：[undefined,undefined,undefined]
 */
function getSelectedSpec(specs) {
  const arr = []
  specs.forEach((spec, index) => {
    const val = spec.values.find(item => item.selected)
    val ? arr[index] = val.name : arr[index] = undefined
  })
  return arr
}

</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        margin-bottom: 5px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin-bottom: 5px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
