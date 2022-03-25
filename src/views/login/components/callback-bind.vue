<template>
  <div class="xtx-form" v-if="avatar">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <Form :validation-schema="rules" v-slot="{ errors }" autocomplete="off" ref="target">
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-phone"></i>
          <Field name="mobile" class="input" type="text" placeholder="绑定的手机号" autocomplete="off" v-model="form.mobile" />
        </div>
        <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
      </div>
      <div class="xtx-form-item">
        <div class="field">
          <i class="icon iconfont icon-code"></i>
          <Field name="code" class="input" type="text" placeholder="短信验证码" v-model="form.code" />
          <span class="code" @click="send">{{time === 0 ? '发送验证码' : `${time}s后重发`}}</span>
        </div>
        <div class="error" v-if="errors.code">{{ errors.code }}</div>
      </div>
      <a href="javascript:;" class="submit" @click="bind">立即绑定</a>
    </Form>
  </div>
</template>

<script>
import QC from 'qc'
import { reactive, ref, toRefs } from 'vue'
import { Form, Field } from 'vee-validate'
import { mobile, code } from '@/utils/validate'
import { Message } from '@/components'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useCounter } from '@/hooks'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
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
    const router = useRouter()
    const store = useStore()
    const qqInfo = reactive({
      nickname: '',
      avatar: ''
    })
    const form = reactive({
      mobile: '',
      code: ''
    })
    const rules = {
      mobile: mobile,
      code: code
    }
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        // console.log(res)
        qqInfo.avatar = res.data.figureurl_qq_2
        qqInfo.nickname = res.data.nickname
        // console.log(qqInfo)
      }).error(res => {
        Message({ type: 'error', text: '获取QQ信息失败，请重试！' })
      })
    }
    const target = ref(null)
    const { time, start } = useCounter()
    const send = async() => {
      if (time.value > 0) return
      // 1.校验手机号的合法性
      const valid = mobile(form.mobile)
      if (valid !== true) {
        return target.value.setFieldError('mobile', valid)
      }
      // 2.发送请求，获取验证码
      const res = await userQQBindCode(form.mobile)
      console.log(res)

      start()
    }

    const bind = async () => {
      // 1.整体校验
      const valid = await target.value.validate()
      if (valid !== true) return Message({ type: 'error', text: '校验失败!' })
      // 2.发送请求，绑定qq
      const res = await userQQBindLogin({
        mobile: form.mobile,
        code: form.code,
        unionId: props.unionId
      })

      store.commit('user/setProfile', res.result)

      await store.dispatch('cart/mergeLocalCart')

      // 跳转到首页
      Message({ text: '登录成功' })
      router.push('/')
    }

    return {
      ...toRefs(qqInfo),
      form,
      rules,
      send,
      target,
      time,
      bind
    }
  }
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
