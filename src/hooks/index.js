import { onBeforeMount, onMounted, ref, onBeforeUnmount } from 'vue'
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'

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
    },
    {
      threshold: 0
    }
  )
  //  return出target，当引动该hooks时将target绑定给指定DOM
  return {
    target,
    list
  }
}

// 倒计时
export function useCounter(num = 60) {
  const time = ref(0)
  // resume：开启定时器
  // pause：清除定时器
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    if (time.value === 0) {
      pause()
    }
  }, 1000, {
    immediate: false
  })

  const start = () => {
    time.value = num
    resume()
  }

  onBeforeUnmount(() => {
    pause()
  })

  return {
    time,
    start
  }
}

// xx分xx秒倒计时
export function useTimeDown() {
  const time = ref(0)
  const formatTime = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    formatTime.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, {
    immediate: false
  })
  onBeforeUnmount(() => {
    pause()
  })
  const start = (num = 0) => {
    time.value = num
    resume()
  }

  return {
    start,
    formatTime
  }
}
