<template>
  <div class="home-banner">
    <!-- 轮播图 -->
    <XtxCarousel :slides="slides" :duration="3000" autoPlay></XtxCarousel>

  </div>
</template>
<script>
import { ref } from 'vue'
import { findBanner } from '@/api/home'
export default {
  name: 'HomeBanner',
  setup() {
    const slides = ref([])
    findBanner().then(res => {
      slides.value = res.result
    })
    return {
      slides
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

  ::v-deep {
    .carousel-btn.prev {
      left: 270px !important;
    }
    .carousel-indicator {
      padding-left: 250px !important;
    }
  }
}
</style>
