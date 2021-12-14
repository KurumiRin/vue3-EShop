<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container">
    <nav class="tab">
      <a href="javascript:;" :class="{ active: hasAccount }" @click="hasAccount = true">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a href="javascript:;" :class="{ active: !hasAccount }" @click="hasAccount = false">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId"></CallbackBind>
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId"></CallbackPatch>
    </div>
  </section>
  <LoginFooter></LoginFooter>
</template>

<script>
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import { ref } from 'vue'
import CallbackBind from './components/callback-bind.vue'
import CallbackPatch from './components/callback-patch.vue'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Message } from '@/components'
import QC from 'qc'
export default {
  name: 'LoginCallback',
  components: {
    LoginHeader,
    LoginFooter,
    CallbackBind,
    CallbackPatch
  },
  setup() {
    const hasAccount = ref(true)
    const unionId = ref(null)
    const store = useStore()
    const router = useRouter()
    // 1. 通过QQ接口获取openid
    // 判断qq是否登录
    if (QC.Login.check()) {
    // 获取openId
      // console.log('1', 'check')
      QC.Login.getMe(async openId => {
        unionId.value = openId
        // console.log('2 openId', openId)
        try {
          const res = await userQQLogin(openId)
          Message({ text: '登录成功' })
          store.commit('user/setProfile', res.result)
          router.push('/')
        } catch (e) {
          console.log(e)
          Message({ type: 'error', text: 'qq未绑定' })
        }
      })
    }
    return {
      hasAccount,
      unionId
    }
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 25px 0;
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
