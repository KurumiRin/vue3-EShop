<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <HomeCategory></HomeCategory>
      </div>
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
export default {
  name: 'Home',
  components: {
    HomeCategory
  }
}
</script>

<style></style>
