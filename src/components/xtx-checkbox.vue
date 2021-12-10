<template>
  <div class="xtx-checkbox" @click="change">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span>
      <slot></slot>
    </span>
  </div>
</template>
<script>
// import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  emits: ['change'],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    // const checked = ref(false)
    // const change = () => {
    //   emit('update:modelValue', !checked.value)
    // }
    // watch(
    //   () => props.modelValue,
    //   value => {
    //     checked.value = value
    //   },
    //   {
    //     immediate: true
    //   }
    // )

    const checked = useVModel(props, 'modelValue', emit)
    const change = () => {
      const newVal = checked.value = !checked.value
      // checked.value = newVal
      emit('change', newVal)
    }
    return {
      checked,
      change
    }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
