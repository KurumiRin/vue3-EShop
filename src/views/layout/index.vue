<template>
  <div>
    <AppTopNav></AppTopNav>
    <AppHeader></AppHeader>
    <main class="app-body">
      <RouterView></RouterView>
    </main>
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import AppTopNav from './components/app-topnav.vue'
import AppHeader from './components/app-header.vue'
import AppFooter from './components/app-footer.vue'
export default {
  name: 'Layout',
  components: {
    AppTopNav,
    AppHeader,
    AppFooter
  }
}
</script>

<style scoped>
.app-body {
  min-height: 600px;
}
</style>
