<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    // 给xtx-tabs-panel传值
    const activeName = useVModel(props, 'modelValue', emit)

    provide('activeName', activeName)
    const tabClick = (item, index) => {
      activeName.value = item.props.name
      // 触发自定义事件
      emit('tab-click', {
        tab: item,
        index: index
      })
    }
    return {
      activeName,
      tabClick
    }
  },
  render() {
    const panels = []
    // console.log(this.$slots.default())
    // tabs-panel如果是vfor动态创建的，则创建出来的虚拟DOM在对应根节点的children中，而非根节点
    this.$slots.default().forEach(item => {
      if (item.type.name === 'XtxTabsPanel' || !item.children) {
        panels.push(item)
      } else {
        item.children.forEach(child => {
          panels.push(child)
        })
      }
    })
    const navs = (
      <nav>
        {
          panels.map((item, index) => {
            return (
              <a href="javascript:;" class={{ active: item.props.name === this.activeName }} onClick={() => this.tabClick(item, index)}
              >
                {item.props.label}
              </a>
            )
          })
        }
      </nav>
    )
    return (
      <div class='xtx-tabs'>{[navs, panels]}</div>
    )
  }
}
</script>
<style lang="less">
.xtx-tabs {
  background: #fff;

  >nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    >a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;

      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
