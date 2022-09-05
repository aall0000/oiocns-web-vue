<template>
  <MarketCard />
  <div class="app-register-wrap">
    <div class="app-base-info register-content">
      <p class="custom-title"><span class="custom-span"></span> 基础信息</p>
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
              <el-input v-model="form.name" placeholder="请设置" @change="handleAppNameChage" />
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
      <p class="custom-title"><span class="custom-span"></span> 资源信息</p>
      <SetAppMenu :menus="appMenu.menus" @handleMemuEvent="handleMemuEvent" />
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
  import { ElMessage, FormInstance, FormRules } from 'element-plus'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  // 注册基本信息
  const form = reactive({
    code: '',
    name: '',
    // desc: '',
    privateKey: ''
  })
  // 默认应用菜单
  const appMenu = reactive({
    menus: [
      {
        caption: '',
        link: '',
        resource: '',
        customId: '1',
        menus: []
      }
    ]
  })

  const handleMemuEvent = (type: ProductMenuEventType, selectId: string) => {
    console.log('处理事件', type, selectId)
    switch (type) {
      case 'Add':
        handleAddMenu(selectId)
        break
      case 'Delete':
        handleDeleteMenu(selectId)
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
  // 组件功能处理 添加子应用菜单
  const handleAddMenu = (selectId: string) => {
    // 根据当前所选标志 获取目标数据信息
    const aim: AppMenuType = getDataWithId(selectId)
    const oldList = aim?.menus ?? []
    // 向目标数据新增 展示位
    aim['menus'] = [
      ...oldList,
      {
        caption: '',
        link: '',
        resource: '',
        customId: `${selectId}-${oldList.length + 1}`
      }
    ]
  }
  const handleDeleteMenu = (aimId: string) => {
    // 根据当前所选标志 获取目标数据信息
    function delData(data: AppMenuType[], parentObj?: AppMenuType) {
      const obj = data.find((item) => item.customId === aimId)

      if (!obj) {
        data.forEach((val) => {
          val?.menus && delData(val.menus, val)
        })
      } else {
        parentObj.menus = data.filter((item) => item.customId !== aimId)
      }
    }
    delData(appMenu.menus)
  }
  const handleSortMenu = (type: ProductMenuEventType, aimId: string) => {
    // 根据当前所选标志 获取目标数据信息
    function sortData(data: AppMenuType[], parentObj?: AppMenuType) {
      const obj = data.find((item) => item.customId === aimId)
      if (!obj) {
        data.forEach((val) => {
          val?.menus && sortData(val.menus, val)
        })
      } else {
        const idArr = parentObj.menus.map((item: AppMenuType) => item.customId)
        const index = idArr.indexOf(aimId)
        const endIndex = parentObj.menus.length - 1
        const willChageIndex = type === 'Up' ? index - 1 : index + 1
        // 若最后一个选择向下排序/第一个向上,则终止
        if ((type === 'Down' && willChageIndex > endIndex) || (type === 'Up' && index === 0)) {
          return
        }
        // 若最后一个选择向下排序,则终止
        if (index > -1) {
          const willChangeObj = parentObj.menus[willChageIndex]
          parentObj.menus[index] = willChangeObj
          parentObj.menus[willChageIndex] = obj
        }
      }
    }
    sortData(appMenu.menus)
  }
  // 获取目标数据
  const getDataWithId = (aimId: string) => {
    let aimData: AppMenuType
    // 获取目标数据
    function deepGet(data: AppMenuType[]) {
      const obj = data.find((item) => item.customId === aimId)
      if (!obj) {
        data.forEach((val) => {
          val?.menus && deepGet(val.menus)
        })
      } else {
        aimData = obj
      }
    }
    deepGet(appMenu.menus)
    return aimData
  }
  // 根据填写内容设置资源展示名称
  const handleAppNameChage = (name: string) => {
    appMenu.menus[0].caption = name
  }
  const onSubmit = () => {
    console.log('submit!', form, appMenu)
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
    console.log('搜索',registerFormRef);

    registerFormRef.value.validate(async (valid: any, fields: any) => {
      if (valid) {
        const { success, data } = await API.product.register({
          data: form
        })
        if (success) {
          const registerParams = {
            productId: data.id,
            resources: [{ ...form, ...appMenu }]
          }
          createBatchResource(registerParams)
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  const createBatchResource = async (params: any) => {
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
      margin-bottom: 40px;
    }

    // 自定义标题
    .custom-title {
      display: flex;
      align-items: center;
      height: 26px;
      font-size: 14px;
      margin-bottom: 10px;

      .custom-span {
        display: inline-block;
        width: 4px;
        height: 60%;
        margin-right: 6px;
        background-color: #3e5ed8;
      }
    }
  }
</style>
