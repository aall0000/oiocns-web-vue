<template>
  <div>
    <div class="title">注册账户</div>
    <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" status-icon class="demo-ruleForm">
      <el-form-item prop="phone">
        <el-input
          size="large"
          v-model="ruleForm.account"
          autocomplete="off"
          placeholder="请输入账户"
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
export default defineComponent({
  setup(prop, context) {
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
      password: '',
      account: '',
      password2: ''
    })
    const gotoPrev = () => {
      context.emit('gotoPrev')
    }
    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请输入账户'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule: any, value: any, callback: any) => {
      const passReg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{6,15}$/
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
          context.emit('registerUser', ruleForm)
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