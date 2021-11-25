<template>
  <div>
    <AppTopNav></AppTopNav>
    <AppHeader></AppHeader>
    <AppHeaderSticky></AppHeaderSticky>
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
import AppHeaderSticky from './components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppTopNav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
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
