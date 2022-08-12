<template>
  <el-dialog center v-model="dialogShow.value" title="配置首页" width="30%">
    <div class="diy-dialog-body">
      <div style="margin-top: 30px; display: flex; justify-content: center">
        <el-radio v-model="radio" label="1">覆盖</el-radio>
        <el-radio v-model="radio" label="2">新增</el-radio>
      </div>
      <div style="margin-top: 30px; margin-left: 52px">
        <el-form
          ref="ruleFormRef"
          :model="state.form"
          :rules="rules"
          label-width="80px"
          v-if="radio == '1'"
        >
          <el-form-item label="模板列表" prop="id">
            <el-select v-model="state.form.id" placeholder="请选择">
              <el-option
                v-for="item in state.tabsList"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form
          ref="ruleFormRef"
          :model="state.form"
          :rules="rules"
          label-width="80px"
          v-if="radio == '2'"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="state.form.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer class="diy-dialog-footer" style="margin-top: 20px">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick(ruleFormRef)">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import $services from '@/services'
  import { useUserStore } from '@/store/user'
  import type { FormInstance, FormRules } from 'element-plus'
  import { reactive, ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  const ruleFormRef = ref<FormInstance>()
  const emit = defineEmits(['closeDialog'])
  const props = defineProps({
    dialogShow: {
      type: Object
    }
  })
  const route = useRoute()
  const router = useRouter()
  const store = useUserStore()
  const loading = ref(false)
  const radio = ref('1')
  const state = reactive({
    form: {
      id: '',
      name: ''
    },
    options: {
      labelWidth: '100px'
    },
    tabsList: [],
    currentPage: 1,
    pageSize: 9999999
  })
  const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
  })

  onMounted(() => {
    state.tabsList = JSON.parse(route.query.tabsData as string)
  })
  // 自动生成id
  const guid = computed(() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  })
  const handleClick = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        if (radio.value === '1') {
          state.tabsList.forEach((el) => {
            if (el.id == state.form.id) {
              el.temps = props.dialogShow.sendData
            }
          })
          let params = {
            userId: store.queryInfo.id,
            content: state.tabsList
          }
          $services.diyHome
            .diy(`/anydata/object/set/template-${params.userId}`, {
              data: {
                operation: 'replaceAll',
                data: {
                  name: '模板配置',
                  // temps: props.dialogShow.sendData
                  content: params.content
                }
              }
            })
            .then((res: ResultType) => {
              if (res.state) {
                ElMessage({
                  message: '添加成功',
                  type: 'success'
                })
                handleClose()
              }
            })
        } else {
          let tabIndex = 0
          tabIndex = state.tabsList[state.tabsList.length - 1].name
          state.tabsList.push({
            id: guid.value,
            name: ++tabIndex,
            title: state.form.name,
            temps: props.dialogShow.sendData
          })
          let params = {
            workspaceId: store.workspaceData.id,
            userId: store.queryInfo.id,
            content: state.tabsList
          }
          $services.diyHome
            .diy(`/anydata/object/set/${params.userId}.${params.workspaceId}`, {
              data: {
                operation: 'replaceAll',
                data: {
                  name: '首页配置',
                  // temps: props.dialogShow.sendData
                  content: params.content
                }
              }
            })
            .then((res: ResultType) => {
              if (res.state) {
                ElMessage({
                  message: '添加成功',
                  type: 'success'
                })
                handleClose()
                router.push({ path: '/workHome' })
              }
            })
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  const handleClose = () => {
    emit('closeDialog', props.dialogShow.key)
  }
</script>

<style lang="scss" scoped>
  :deep(.el-select) {
    width: 100%;
  }
  :deep(.el-input) {
    width: 70%;
  }
  .diy-dialog-body .el-form {
    justify-content: space-between;
  }
  .diy-dialog-footer .el-button:first-child {
    margin-right: 20px;
  }
  .form-shape {
    width: 100%;
  }
  img {
    width: 200px;
    height: 200px;
  }
  .photoBtn {
    margin: 20px 0;
    .el-button,
    .el-button--default:focus {
      padding: 8px;
      font-size: 10px;
    }
  }
</style>
