<template>
  <MarketCard />
  <div class="app-register-wrap">
    <div class="app-base-info register-content">
      <div class="custom-title">
        <p><span class="custom-span"></span> 基础信息</p>
      </div>
      <el-form
        :model="form"
        ref="registerFormRef"
        :rules="rules"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row :gutter="40" justify="space-between">
          <el-col :span="12">
            <el-form-item label="应用名称" prop="name">
              <el-input v-model="form.name" placeholder="请设置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用编码" prop="code">
              <el-input v-model="form.code" placeholder="请设置" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="40" justify="space-between">
          <el-col :span="12"
            ><el-form-item label="负责人">
              <el-input v-model="form.user" placeholder="请设置" /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="联系方式">
              <el-input v-model="form.user" placeholder="请设置" /> </el-form-item
          ></el-col>
        </el-row> -->
        <!-- <el-form-item label="Activity zone">
          <el-select v-model="form.region" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="privateKey">
          <el-input v-model="form.privateKey" placeholder="请设置" />
        </el-form-item> -->
        <el-form-item label="应用介绍">
          <el-input
            :rows="2"
            v-model="form.desc"
            type="textarea"
            maxlength="120"
            show-word-limit
            placeholder="请输入应用介绍"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-divider />
    <div class="app-base-info register-content">
      <div class="custom-title">
        <p> <span class="custom-span"></span> 资源信息 </p>
        <el-icon class="add-btn" :size="20" @click.stop="handleMemuEvent('Add')">
          <CirclePlus />
        </el-icon>
      </div>
      <SetAppMenu
        :menus="resources.resources"
        :key="resources.resources.length"
        @handleMemuEvent="handleMemuEvent"
      />
    </div>
    <el-divider />
    <div class="app-base-info register-content btns">
      <el-button type="info" @click="router.back()">取消</el-button>
      <el-button type="primary" @click="onSubmit">注册</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import API from '@/services'
  import SetAppMenu from './setAppMenu.vue'
  import { reactive, ref } from 'vue'
  import { ElMessage, FormRules } from 'element-plus'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  // 注册基本信息
  const form = reactive({
    code: '',
    name: '',
    desc: '',
    privateKey: ''
  })
  let resources = reactive({
    resources: [
      {
        name: '',
        link: '',
        code: '',
        privateKey: '',
        customId: '1'
      }
    ]
  })

  const handleMemuEvent = (type: ProductMenuEventType, selectId?: string) => {
    console.log('处理事件', type, selectId)
    switch (type) {
      case 'Add':
        resources.resources.push({
          name: '',
          link: '',
          code: '',
          privateKey: '',
          customId: `${resources.resources.length + 1}`
        })
        break
      case 'Delete':
        // handleDeleteMenu(selectId)
        if (resources.resources.length > 1) {
          resources.resources = resources.resources.filter((item) => item.customId !== selectId)
        } else {
          ElMessage({
            type: 'error',
            message: '请填写至少一个资源信息'
          })
        }

        break
      case 'Up':
        handleSortMenu('Up', selectId)
        break
      case 'Down':
        handleSortMenu('Down', selectId)
        break
      default:
        break
    }
  }

  const handleSortMenu = (type: ProductMenuEventType, aimId: string) => {
    const data = resources.resources
    // 根据当前所选标志 获取目标数据信息
    const obj = data.find((item) => item.customId === aimId)

    const idArr = data.map((item: AppMenuType) => item.customId)
    const index = idArr.indexOf(aimId)
    const endIndex = data.length - 1
    const willChageIndex = type === 'Up' ? index - 1 : index + 1
    // 若最后一个选择向下排序/第一个向上,则终止
    if ((type === 'Down' && willChageIndex > endIndex) || (type === 'Up' && index === 0)) {
      return
    }
    // 若最后一个选择向下排序,则终止
    if (index > -1) {
      const willChangeObj = data[willChageIndex]
      data[index] = willChangeObj
      data[willChageIndex] = obj
    }
  }

  const onSubmit = () => {
    console.log('submit!', form)
    onRegisterSubmit()
  }

  const registerFormRef = ref<any>(null)
  // 注册验证规则
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
    ]
  })
  // 提交注册
  const onRegisterSubmit = async () => {
    if (!registerFormRef) return

    registerFormRef.value.validate(async (valid: any, fields: any) => {
      if (valid) {
        // 无资源提示
        if (!resources.resources[0].link) {
          return ElMessage({
            type: 'error',
            message: '请填写至少一个资源地址'
          })
        }
        const { success, data } = await API.product.register({
          data: form
        })
        if (success) {
          // 过滤无效填写
          const resourcesData = resources.resources.filter((item) => {
            return item.link
          })
          const registerParams = {
            productId: data.id,
            resources: resourcesData
          }
          createBatchcode(registerParams)
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  const createBatchcode = async (params: any) => {
    const { success } = await API.product.createResources({ data: params })
    if (success) {
      ElMessage({
        type: 'success',
        message: '应用注册成功'
      })
      router.back()
    }
  }
</script>

<style lang="scss" scoped>
  .app-register-wrap {
    height: 100%;
    background: var(--el-bg-color-overlay);
    padding: 20px;
    overflow-y: auto;
    height: calc(100vh - 108px);

    .register-content {
      width: 600px;
      margin: 0 auto;
      :deep(.el-input__wrapper),
      :deep(.el-textarea__inner) {
        background-color: #f3f5fa;
        box-shadow: none;
        border: 1px solid var(--el-input-focus-border-color);
      }
      :deep(.el-textarea .el-input__count) {
        background-color: #f3f5fa;
        box-shadow: none;
      }
    }
    .page-title {
      font-size: 16px;
      text-align: center;
    }
    .btns {
      display: flex;
      justify-content: space-around;
      padding: 10px 0;
      margin-bottom: 30px;
    }

    // 自定义标题
    .custom-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 26px;
      font-size: 14px;
      margin-bottom: 10px;

      .custom-span {
        display: inline-block;
        width: 3px;
        height: 14px;
        margin-right: 6px;
        background-color: #3e5ed8;
      }
    }
    .add-btn {
      cursor: pointer;
      color: var(--el-color-primary);
      margin: 0 10px;
    }
  }
</style>
