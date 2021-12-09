<template>
  <HomePanel title="热门品牌" subTitle="国际经典 品质保证" ref="target">
    <template v-slot:right>
      <a href="javascript:;" :class="{disabled:index === 0}" class="iconfont icon-angle-left prev" @click="index = 0"></a>
      <a href="javascript:;" :class="{disabled:index === 1}" class="iconfont icon-angle-right next" @click="index = 1"></a>
    </template>
    <div class="box" ref="box">
      <Transition name="fade">
        <ul class="list" v-if="list.length" :style="{ transform:`translateX(${-index * 50}%)`}">
          <li v-for="item in list" :key="item.id">
            <RouterLink to="/">
              <img v-lazy="item.picture" alt="">
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px">
          </XtxSkeleton>
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import HomePanel from './home-panel'
import { useLazyData } from '@/hooks'
import { findBrand } from '@/api/home'
import { ref } from 'vue'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup() {
    const index = ref(0)
    const { target, list } = useLazyData(() => findBrand(10))
    return {
      target,
      list,
      index
    }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
  .skeleton {
    width: 100%;
    display: flex;
    .item {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
