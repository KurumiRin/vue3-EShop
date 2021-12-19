<template>
  <div class="top-category">
    <div class="container">
      <!-- 渲染面包屑导航 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <XtxBreadItem v-if="category" :key="category?.id">{{category?.name}}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :slides="slides" style="height:500px"></XtxCarousel>
      <!-- 全部分类 -->
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in category?.children" :key="item.id">
            <RouterLink :to="`/category/sub/${item.id}`">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="item in subList" :key="item.id">
        <div class="head">
          <h3>- {{ item.name }} -</h3>
          <p class="tag">{{ item.desc || '价好物美，品质之选' }}</p>
          <XtxMore />
        </div>
        <div class="body">
          <GoodsItem v-for="good in item.goods" :good="good" :key="good.id" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { findBanner } from '@/api/home'
import GoodsItem from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'
export default {
  name: 'TopCategory',
  components: {
    GoodsItem
  },
  setup() {
    // 1.从vuex中获取所有的分类数据
    const store = useStore()
    const route = useRoute()
    const category = computed(() => {
      return store.state.category.list.find(item => item.id === route.params.id)
    })

    // 渲染轮播图结构
    const slides = ref(null)
    findBanner().then(res => {
      slides.value = res.result
    })

    // 获取分类数据
    const subList = ref([])
    watch(
      () => route.params.id,
      value => {
        // 如果路由发生变化，但不是一级路由，则不发送请求
        if (route.path.includes('/sub')) return
        findTopCategory(value).then(data => {
          subList.value = data.result.children
        })
      },
      {
        immediate: true
      }
    )
    return {
      category,
      slides,
      subList
    }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
