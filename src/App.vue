<template>
  <router-view></router-view>
</template>
<script>
import axios from '@/utils/request'

export default {
  setup () {
    async function http () {
      const res = await axios({
        method: 'get',
        url: '/home/index'
      })
      console.log(res)
    }
    http()
    return {}
  }
}
</script>
