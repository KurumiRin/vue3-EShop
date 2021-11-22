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
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppTopNav,
    AppHeader,
    AppFooter
  },
  setup() {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped>
.app-body {
  min-height: 600px;
}
</style>
