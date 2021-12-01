<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <HomeCategory></HomeCategory>
        <HomeBanner></HomeBanner>
        <HomeNew></HomeNew>
        <HomeHot></HomeHot>
      </div>
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
export default {
  name: 'Home',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot
  }
}
</script>

<style scoped lang="less">
</style>
