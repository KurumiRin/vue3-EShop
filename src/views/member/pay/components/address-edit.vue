<template>
  <XtxDialog :title="formData.id ? '修改收货地址' : '添加收货地址'" v-model:visible="dialogVisible">
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input class="input" placeholder="请输入收货人" v-model="formData.receiver" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input class="input" placeholder="请输入手机号" v-model="formData.contact" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              :fullLocation="formData.fullLocation"
              placeholder="请选择所在地区"
              @changeCity="changeCity"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input class="input" placeholder="请输入详细地址" v-model="formData.address" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input class="input" placeholder="请输入邮政编码" v-model="formData.postalCode" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input class="input" placeholder="请输入地址标签，逗号分隔" v-model="formData.addressTags" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">是否默认：</div>
          <div class="field">
            <XtxSwitch v-model="formData.isDefault" :activeValue="0" :inactiveValue="1"></XtxSwitch>
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right:20px" @click="dialogVisible = false">取消</XtxButton>
      <XtxButton type="primary" @click="confirm">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref, reactive, inject, watch } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import { Message } from '@/components'
export default {
  name: 'AddressEdit',
  setup() {
    const getInfo = inject('getInfo')

    const dialogVisible = ref(false)

    // 打开函数
    const open = (address) => {
      dialogVisible.value = true
      if (address) {
        for (const k in address) {
          formData[k] = address[k]
        }
      }
    }

    // 表单数据
    const formData = reactive({
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 0,
      fullLocation: ''
    })
    // 选择地区
    const changeCity = (city) => {
      formData.provinceCode = city.provinceCode
      formData.cityCode = city.cityCode
      formData.countyCode = city.countyCode
      // formData.fullLocation = city.fullLocation
      formData.fullLocation = `${city.provinceName} ${city.cityName} ${city.countyName}`
    }
    const updateAddress = inject('updateAddress')
    const confirm = async () => {
      if (formData.id) {
        // 发送请求修改地址
        await editAddress(formData)
        Message({ text: '修改收货地址成功', type: 'success' })
        updateAddress({
          ...formData
        })
      } else {
        // 发送请求添加地址
        await addAddress(formData)
        Message({ text: '添加收货地址成功', type: 'success' })
        getInfo()
      }
      dialogVisible.value = false
    }

    // 监听显示，清空内容
    watch(dialogVisible, value => {
      if (!value) {
        for (const k in formData) {
          formData[k] = ''
        }
        formData.isDefault = 1
      }
    })

    return {
      dialogVisible,
      open,
      formData,
      changeCity,
      confirm
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}

.xtx-switch {
  transform: translateY(13px);
}
</style>
