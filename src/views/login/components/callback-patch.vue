<template>
  <div class="xtx-form">
    <Form autocomplete="off" :validation-schema="rules" ref="target" v-slot="{errors}">
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-user"></i>
          <Field name="account" v-model="form.account" class="input" type="text" placeholder="请输入用户名" />
        </div>
        <div v-if="errors.account" class="error">{{errors.account}}</div>
      </div>
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-phone"></i>
          <Field name="mobile" v-model="form.mobile" class="input" type="text" placeholder="请输入手机号" />
        </div>
        <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
      </div>
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-code"></i>
          <Field name="code" v-model="form.code" class="input" type="text" placeholder="请输入验证码" />
          <span class="code" @click="send">{{time === 0 ? '发送验证码' : `${time}s后发送`}}</span>
        </div>
        <div v-if="errors.code" class="error">{{errors.code}}</div>
      </div>
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-lock"></i>
          <Field name="password" v-model="form.password" class="input" type="password" placeholder="请输入密码" />
        </div>
        <div v-if="errors.password" class="error">{{errors.password}}</div>
      </div>
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-lock"></i>
          <Field name="rePassword" v-model="form.rePassword" class="input" type="password" placeholder="请确认密码" />
        </div>
        <div v-if="errors.rePassword" class="error">{{errors.rePassword}}</div>
      </div>
      <a href="javascript:;" class="submit" @click="submit">立即提交</a>
    </Form>
  </div>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { reactive, ref } from 'vue'
import { account, mobile, code, password, rePassword } from '@/utils/validate'
import { useCounter } from '@/hooks'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@/components'
export default {
  name: 'CallbackPatch',
  components: {
    Form,
    Field
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const form = reactive({
      account: '',
      mobile: '',
      code: '',
      password: '',
      rePassword: ''
    })
    const rules = {
      mobile,
      code,
      account,
      password,
      rePassword
    }
    const target = ref(null)
    const { start, time } = useCounter()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const send = async() => {
      if (time.value > 0) return
      // 校验手机号
      const valid = mobile(form.mobile)
      if (valid !== true) {
        return target.value.setFieldError('mobile', valid)
      }
      const res = await userQQPatchCode(form.mobile)
      console.log(res)
      // 倒计时
      start()
    }

    const submit = async() => {
      // 整体校验
      const valid = await target.value.validate()
      if (valid !== true) return Message({ type: 'error', text: '校验失败!' })
      // 发送请求进行完善信息
      const res = await userQQPatchLogin(props.unionId, form)

      store.commit('user/setProfile', res.result)

      await store.dispatch('cart/mergeLocalCart')

      // 跳转到首页
      Message({ text: '登录成功' })
      const redirectUrl = route.query.redirectUrl || '/'
      router.push(redirectUrl)
      // router.push('/')
    }
    return {
      form,
      rules,
      target,
      time,
      send,
      submit
    }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
