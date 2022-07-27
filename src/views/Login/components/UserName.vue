<template>
  <div>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon class="demo-ruleForm">
      <el-form-item prop="username">
        <el-input
          size="large"
          v-model="ruleForm.username"
          autocomplete="off"
          placeholder="请输入账户名称"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          size="large"
          placeholder="请输入密码"
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="remind">
        <div class="rmindBox">
          <el-checkbox v-model="ruleForm.remind" label="记住密码" size="large" />
          <div class="rmindBox_text" @click="forgetPassword">忘记密码</div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, defineEmits } from 'vue'
import type { FormInstance } from 'element-plus'

export default defineComponent({
  setup(prop, context) {
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
      password: '',
      username: '',
      remind: false
    })
    const forgetPassword = () => {
      context.emit('forgetPassword')
    }
    return {
      forgetPassword,
      ruleFormRef,
      ruleForm
    }
  }
})
</script>

<style lang="scss" scoped>
.demo-ruleForm {
  margin-top: 20px;
  width: 100%;
}
.rmindBox {
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.rmindBox_text {
  font-size: 14px;
  cursor: pointer;
  color: rgb(35, 72, 211);
}
</style>