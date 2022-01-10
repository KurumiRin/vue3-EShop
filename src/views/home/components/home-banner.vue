<template>
  <div class="home-banner">
    <!-- 轮播图 -->
    <XtxCarousel :sliders="sliders" :duration="3000" autoPlay></XtxCarousel>

  </div>
</template>
<script>
import { ref } from 'vue'
import { findBanner } from '@/api/home'
export default {
  name: 'HomeBanner',
  setup() {
    const sliders = ref([])
    findBanner().then(res => {
      sliders.value = res.result
    })
    return {
      sliders
    }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  background-color: pink;

  :deep(.carousel-btn.prev) {
    left: 270px !important;
  }
  :deep(.carousel-indicator) {
    padding-left: 250px !important;
  }
}
</style>
