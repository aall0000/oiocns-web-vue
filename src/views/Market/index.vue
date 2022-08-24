<template>
  <div class="market-layout">
    <el-card shadow="always" class="market-head flex">
      <el-button type="primary" @click="registerVisible = true">注册</el-button>
      <el-button type="primary">订单</el-button>
      <el-button type="primary" @click="goMarket">市场</el-button>
    </el-card>
    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的应用</p>
        <li class="app-card">
          <ShopCard v-for="item in state.myAppList" :info="item" :key="item.id">
            <!-- <template> -->
            <el-dropdown @command="(value) => handleCommand('own', value)" placement="top">
              <el-button class="btn" type="primary" link small> 设置 </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="action in actionOptionsOfOwn" :command="action.value">
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-divider direction="vertical" />
            <el-button class="btn" link small @click="deleteApp(item)">移除应用</el-button>
            <!-- </template> -->
          </ShopCard>
        </li>
        <el-pagination style="justify-content: end" layout="prev, pager, next" :total="50" />
      </ul>
      <ul class="box-ul">
        <p class="box-ul-title">其他应用</p>
        <li class="app-card">
          <!-- <ShopCard v-for="item in baseData" :info="item" :key="item.id">
            <el-dropdown @command="(value) => handleCommand('other', value)" placement="top">
              <el-button class="btn" type="primary" link small> 设置 </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="action in actionOptionsOfOther" :command="action.value">
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-divider direction="vertical" />
            <el-button class="btn" link small @click="deleteApp(item)">移除应用</el-button>
          </ShopCard> -->
        </li>
        <el-pagination style="justify-content: end" layout="prev, pager, next" :total="50" />
      </ul>
    </div>
  </div>
  <el-dialog v-model="registerVisible" title="Tips" width="600px" draggable>
    <el-form ref="registerFormRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="应用编码" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" :rows="3" type="textarea" placeholder="请输入描述/备注" />
      </el-form-item>
      <!-- <el-form-item label="应用thingId" prop="thingId">
        <el-input v-model="form.thingId" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(registerFormRef)">取消</el-button>
        <el-button type="primary" @click="onRegisterSubmit(registerFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<!-- authority: "所属权"
belongId: "340896682281668608"
code: "prod0044"
createTime: "2022-08-23 17:22:13.106"
createUser: "340896682281668608"
endTime: "2022-08-23 17:22:13.106"
id: "349966573160763392"
name: "测试应用0044"
source: "创建的"
status: 1
thingId: "348057847231287296"
remark: "app"
updateTime: "2022-08-23 17:22:13.106"
updateUser: "340896682281668608"
version: "1" -->

<script setup lang="ts">
  import API from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  import ShopCard from './components/shopCard.vue'
  import { baseData, actionOptionsOfOther, actionOptionsOfOwn } from './config'
  import { useRouter } from 'vue-router'
  import type { FormInstance, FormRules } from 'element-plus'
  // 注册页面实例
  const registerFormRef = ref<FormInstance>()
  const router = useRouter()
  type StateType = {
    myAppList: MarketShopType[]
    otherAppList: MarketShopType[]
  }

  const state: StateType = reactive({
    myAppList: [],
    otherAppList: []
  })

  onMounted(() => {
    // 获取列表
    getPageList()
  })

  // 获取我的应用列表
  const getPageList =async () => {
    const { data, success } =await API.product.searchOwnProduct({
      data: { offset: 0, limit: 10, filter: '' }
    })
    if (success) {
      const { result = [] } = data
      state.myAppList = [...result]
    }
  }

  // 移除app
  const deleteApp = (item: any) => {
    ElMessageBox.confirm(`确认删除  ${item.name}?`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const { success } = API.product.deleteResource({
          data: { id: item.id }
        })
        if (success) {
          getPageList()
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
        }
      })
      .catch(() => {})
  }

  // 处理 设置 菜单选择事件
  const handleCommand = (type: 'own' | 'other', command: string | number | object) => {
    console.log('菜单选择事件', type, command)
  }
  // 注册页面弹窗
  const registerVisible = ref<boolean>(false)

  // 注册信息
  const form = reactive({
    name: '',
    code: '',
    remark: ''
  })

  // 提交注册
  const onRegisterSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!', form)
        const { success } = API.product.register({
          data: form
        })
        if (success) {
          getPageList()
          ElMessage({
            type: 'success',
            message: '注册成功'
          })
          resetForm(formEl)
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  // 验证规则
  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入应用名称', trigger: 'blur' },
      { min: 2, max: 8, message: '长度限制2-8', trigger: 'blur' }
    ],
    code: [
      {
        required: true,
        message: '请输入应用编码',
        trigger: 'blur'
      }
    ],
  })
  // 重置表单
  const resetForm = (formEl: FormInstance) => {
    registerVisible.value = false
    if (!formEl) return
    formEl.resetFields()
  }

  // 路由跳转
  const goMarket = () => {
    router.push({ path: '/market/markList' })
  }
</script>

<style lang="scss" scoped>
  :deep(.el-card__body) {
    padding: 0;
  }
  .market-layout {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    .market-head {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
      padding: 0 20px;
    }
    .market-content {
      padding: 16px 16px 0;
      // margin-top: 4px;
      height: calc(100vh - 124px);
      overflow-y: auto;
    }
    .box {
      .box-ul + .box-ul {
        margin-top: 10px;
      }
      &-ul {
        background-color: #fff;
        padding: 10px 24px;

        &-title {
          font-weight: bold;
          padding: 8px 0;
        }
        .app-card {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
