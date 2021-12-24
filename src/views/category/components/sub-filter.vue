<template>
  <div class="sub-filter" v-if="filterData">
    <!-- 筛选区 -->
    <div class="item">
      <!-- 品牌独立渲染 -->
      <div class="head">品牌：</div>
      <div class="body">
        <a href="javascript:;" :class="{active:item.id === filterData.brands.selected}" v-for="item in filterData.brands" :key="item.id" @click="changeBrand(item.id)">
          {{ item.name }}
        </a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <!-- 品牌独立渲染 -->
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a href="javascript:;" :class="{ active: item.selected === sub.id }" v-for="sub in item.properties" :key="sub.id" @click="changeSale(item,sub.id)">
          {{ sub.name }}
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup(props, { emit }) {
    const route = useRoute()
    const filterData = ref({})
    watch(
      () => route.params.id,
      value => {
        if (!route.path.includes('sub')) return
        // 发送请求
        findSubCategoryFilter(value).then(({ result }) => {
          console.log(result)
          result.brands.selected = null
          result.brands.unshift({ id: null, name: '全部' })
          result.saleProperties.forEach(item => {
            item.properties.selected = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = result
        })
      }, {
        immediate: true
      })

    const getSelectedFilter = () => {
      const filters = {
        brandId: null,
        attrs: []
      }
      const brandId = filterData.value.brands.selected
      if (brandId) {
        filters.brandId = brandId
      }

      filterData.value.saleProperties.forEach(item => {
        if (item.selected) {
          filters.attrs.push({
            groupName: item.name,
            propertyName: item.properties.find(i => i.id === item.selected).name
          })
        }
      })
      return filters
    }

    const changeBrand = (id) => {
      filterData.value.brands.selected = id
      emit('changeFilter', getSelectedFilter())
    }

    const changeSale = (item, id) => {
      item.selected = id
      emit('changeFilter', getSelectedFilter())
    }

    return {
      filterData,
      changeBrand,
      changeSale
    }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
