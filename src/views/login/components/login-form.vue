<template>
  <div class="account-box">
    <Form :validationSchema="rules" v-slot="{ errors }" autocomplete="off" ref="target">
      <div class="toggle">
        <a href="javascript:;" v-if="isMsgLogin" @click="isMsgLogin = !isMsgLogin">
          <i class="iconfont icon-user"></i> 使用账号登录
        </a>
        <a href="javascript:;" v-else @click="isMsgLogin = !isMsgLogin">
          <i class="iconfont icon-msg"></i> 使用短信登录
        </a>
      </div>
      <div class="form">
        <template v-if="!isMsgLogin">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <Field v-model="form.account" type="text" placeholder="请输入用户名" name="account" :class="{error:errors.account}" />
            </div>
            <div class="error" v-if="errors.account">
              <i class="iconfont icon-warning" />{{ errors.account }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <Field v-model="form.password" type="password" placeholder="请输入密码" name="password" :class="{error:errors.password}" />
            </div>
            <div class="error" v-if="errors.password">
              <i class="iconfont icon-warning" />{{ errors.password }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <Field v-model="form.mobile" type="text" placeholder="请输入手机号" name="mobile" :class="{error:errors.mobile}" />
            </div>
            <div class="error" v-if="errors.mobile">
              <i class="iconfont icon-warning" />{{ errors.mobile }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <Field v-model="form.code" type="password" placeholder="请输入验证码" name="code" :class="{error:errors.code}" />
              <span class="code" @click="send">{{time === 0 ? '发送验证码' : `${time}s后重发`}}</span>
            </div>
            <div class="error" v-if="errors.code">
              <i class="iconfont icon-warning" />{{ errors.code }}
            </div>
          </div>
        </template>
        <div class="form-item">
          <div class="agree">
            <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
            <span>我已同意</span>
            <a href="javascript:;">《隐私条款》</a>
            <span>和</span>
            <a href="javascript:;">《服务条款》</a>
          </div>
          <div class="error" v-if="errors.isAgree">
            <i class="iconfont icon-warning" />{{ errors.isAgree }}
          </div>
        </div>
        <a href="javascript:;" class="btn" @click="login">登录</a>
      </div>
      <div class="action">
        <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
          <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
        </a>
        <!-- <span id="qqLoginBtn"></span> -->
        <div class="url">
          <a href="javascript:;">忘记密码</a>
          <a href="javascript:;">免费注册</a>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { Form, Field, configure } from 'vee-validate'
import { account, mobile, password, code, isAgree } from '@/utils/validate'
import { Message } from '@/components/index'
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from '@/api/user'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
// import { useIntervalFn } from '@vueuse/core'
import { useCounter } from '@/hooks'
// import QC from 'qc'
configure({
  validateOnInput: true,
  validateOnBlur: true
})
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup() {
    const isMsgLogin = ref(false)
    const form = reactive({
      account: '',
      password: '',
      mobile: '',
      code: '',
      isAgree: false
    })

    // 表单校验规则
    const rules = {
      // 校验的时候，如果返回true，校验通过
      // 如果返回的不是true，而是其他值，校验失败，而且返回值就是校验的提示信息
      account,
      password,
      mobile,
      code,
      isAgree
    }
    // 当切换时需要重置数据
    watch(isMsgLogin, () => {
      form.account = ''
      form.password = ''
      form.mobile = ''
      form.code = ''
    })

    // 登录
    const target = ref(null)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const login = async () => {
      // 对整体表单进行校验
      const result = await target.value.validate()
      // 校验未通过
      if (!result) return Message({ type: 'error', text: '校验未通过' })
      try {
        let res = null
        if (isMsgLogin.value) {
          res = await userMobileLogin(form.mobile, form.code)
        } else {
          res = await userAccountLogin(form.account, form.password)
        }

        store.commit('user/setProfile', res.result)

        await store.dispatch('cart/mergeLocalCart')

        Message({ type: 'success', text: '登录成功' })
        // 跳转到首页
        const redirectUrl = route.query.redirectUrl || '/'
        router.push(redirectUrl)
        // router.push('/')
      } catch (e) {
        Message({ type: 'error', text: e.response.data.message })
      }
    }

    // 验证码功能
    // const time = ref(0)
    // const timer = null
    // resume：开启定时器
    // pause：清除定时器
    // const { pause, resume } = useIntervalFn(() => {
    //   time.value--
    //   if (time.value === 0) {
    //     pause()
    //   }
    // }, 1000)
    const { time, start } = useCounter()
    const send = async () => {
      // 对手机号进行验证
      const valid = rules.mobile(form.mobile)
      if (valid !== true) {
        return target.value.setFieldError('mobile', valid)
      }
      try {
        // 如果倒计时还没到0，不允许重复发送验证码
        if (time.value > 0) return

        // 发送验证码功能
        const res = await userMobileLoginMsg(form.mobile)
        console.log(res)
        Message({ type: 'success', text: '发送成功' })
        start()
        // timer = setInterval(() => {
        //   time.value--
        //   if (time.value === 0) {
        //     clearInterval(timer)
        //   }
        // }, 1000)
      } catch (error) {
        Message({ type: 'error', text: error.response.data.message })
      }
    }

    // onMounted(() => {
    //   // window.QC.Login({
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })
    return {
      isMsgLogin,
      form,
      rules,
      target,
      login,
      send,
      time
    }
  }
}
</script>

<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      cursor: pointer;
    }
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
