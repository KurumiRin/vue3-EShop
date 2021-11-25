import { onBeforeMount, onMounted, ref } from 'vue'

export function useWindowScroll() {
  const x = ref(0)
  const y = ref(0)

  const onScroll = () => {
    y.value = document.documentElement.scrollTop
    x.value = document.documentElement.scrollLeft
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll)
  })

  onBeforeMount(() => {
    window.removeEventListener('scroll', onscroll)
  })
  return {
    x,
    y
  }
}
