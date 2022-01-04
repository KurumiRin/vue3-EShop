<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter @changeFilter="changeFilter"></SubFilter>
      <!-- 排序 -->
      <div class="goods-list">
        <!-- 排序组件 -->
        <SubSort @changeSort="changeSort"></SubSort>
        <!-- 渲染商品 -->
        <ul>
          <li v-for="good in goodsList" :key="good.id">
            <GoodsItem :good="good" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @load="onLoad"></XtxInfiniteLoading>
      </div>
    </div>
  </div>
</template>
<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup() {
    const check = ref(false)
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 查询数组
    let reqParams = {
      page: 1,
      pageSize: 20,
      categoryId: route.params.id
    }
    const onLoad = () => {
      loading.value = true
      findSubCategoryGoods(reqParams).then(({ result }) => {
        console.log(result)
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          finished.value = true
        }
        // 请求结束后，需要修改loading
        loading.value = false
      })
    }

    // 监听二级分类id的变化
    watch(
      () => route.params.id,
      newVal => {
        if (!route.path.includes('/sub')) return
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20,
          categoryId: newVal
        }
        finished.value = false
      }
    )

    const changeSort = (sortParams) => {
      // console.log(sortParams)
      reqParams = Object.assign(reqParams, sortParams)
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
      onLoad()
    }

    const changeFilter = (filter) => {
      reqParams = Object.assign(reqParams, filter)
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }

    return {
      check,
      loading,
      finished,
      onLoad,
      goodsList,
      changeSort,
      changeFilter
    }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
