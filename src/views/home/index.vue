<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <HomeCategory></HomeCategory>
        <HomeBanner></HomeBanner>
        <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
          <template #right>
            <XtxMore to="/"></XtxMore>
          </template>
          <div>我是内容</div>
        </HomePanel>
      </div>
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomePanel from './components/home-panel.vue'
export default {
  name: 'Home',
  components: {
    HomeCategory,
    HomeBanner,
    HomePanel
  }
}
</script>

<style></style>
