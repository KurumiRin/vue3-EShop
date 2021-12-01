import { onBeforeMount, onMounted, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

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

/**
 *
 * @param {*} apiFn
 * @returns target:用于绑定DOM list:请求的数据
 */
export function useLazyData(apiFn) {
  const target = ref(null)
  const list = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        apiFn().then(res => {
          list.value = res.result
        })
      }
    }
  )
  //  return出target，当引动该hooks时将target绑定给指定DOM
  return {
    target,
    list
  }
}
