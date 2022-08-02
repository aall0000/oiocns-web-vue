<template>
  <el-dialog v-model="dialogShow.value" title="添加好友" width="30%">
    <div class="search"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'

  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    name: '',
    code: '',
    teamName: '',
    teamCode: '',
    teamRemark: ''
  })
  const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
    code: [
      {
        required: true,
        message: '请输入社会信用统一代码',
        trigger: 'blur'
      },
      {
        min: 18,
        max: 18,
        message: '长度为18位',
        trigger: 'blur'
      }
    ],
    teamName: [
      {
        required: true,
        message: '请输入团队简称',
        trigger: 'blur'
      }
    ],
    teamCode: [{ required: true, message: '请输入团队标识', trigger: 'blur' }],
    teamRemark: [{ required: true, message: '请输入团队备注', trigger: 'blur' }]
  })

  const props = defineProps({
    dialogShow: {
      type: Object
    }
  })

  const emit = defineEmits(['closeDialog', 'switchCreateCompany'])
  const submit = () => {
    $services.company
      .create({
        data: ruleForm
      })
      .then((res: ResultType) => {
        console.log('测试接口', res)
        if (res.code == 200) {
          ElMessage({
            message: '注册成功',
            type: 'success'
          })
          emit('switchCreateCompany', res.data)
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const closeDialog = () => {
    emit('closeDialog', 'unit')
  }
</script>

<style scoped></style>
