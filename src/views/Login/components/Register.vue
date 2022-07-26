<template>
  <div>
    <div class="title">注册账户</div>
    <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" status-icon class="demo-ruleForm">
      <el-form-item prop="phone">
        <el-input
          size="large"
          v-model="ruleForm.phone"
          autocomplete="off"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          size="large"
          placeholder="以字母或数字符号组合的6-15位新密码"
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="password2">
        <el-input
          size="large"
          placeholder="请再从输入密码"
          v-model="ruleForm.password2"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <el-button class="loginBtn" type="primary" @click="submitForm(ruleFormRef)">注 册</el-button>
    <div class="textBox">
      <span>已有账户？</span><span class="loginText" @click="gotoPrev">立即登录</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import $services from '@/services'
export default defineComponent({
  setup(prop, context) {
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
      password: '',
      phone: '',
      password2: ''
    })
    const gotoPrev = () => {
      context.emit('gotoPrev')
    }
    const validatePass = (rule: any, value: any, callback: any) => {
      const phoneReg = /^1[3|4|5|7|8|9][0-9]{9}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (ruleForm.phone !== '') {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('手机号格式不正确'))
          }
        }
        callback()
      }
    }
    const validatePass2 = (rule: any, value: any, callback: any) => {
      const passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-z0-9]{6,15}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (ruleForm.password !== '') {
          if (value.length < 6 || value.length > 15) {
            callback(new Error('密码长度不正确'))
          }
          if (passReg.test(value)) {
            callback()
          } else {
            callback(new Error('密码格式不正确'))
          }
        }
        callback()
      }
    }
    const validatePass3 = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else {
        if (ruleForm.password2 !== '' && ruleForm.password == ruleForm.password2) {
          callback()
        } else {
          callback(new Error('与原密码不一致'))
        }
      }
    }
    const rules = reactive({
      phone: [{ validator: validatePass, trigger: 'blur' }],
      password: [{ validator: validatePass2, trigger: 'blur' }],
      password2: [{ validator: validatePass3, trigger: 'blur' }]
    })
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          $services
            .test({
              nickName: 'string',
              name: 'string',
              phone: 'string',
              account: 'string',
              password: 'string',
              motto: 'string'
            })
            .then((res) => {
              console.log('测试接口', res)
            })
        } else {
          return false
        }
      })
    }
    return {
      submitForm,
      rules,
      gotoPrev,
      ruleFormRef,
      ruleForm
    }
  }
})
</script>

<style lang="scss" scoped>
.title {
  color: rgb(35, 72, 211);
  margin-bottom: 20px;
}
.loginBtn {
  background: rgb(62, 94, 216);
  height: 40px;
  width: 100%;
}
.textBox {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
.loginText {
  color: rgb(35, 72, 211);
  cursor: pointer;
}
</style>