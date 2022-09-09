<template>
  <MarketCard />
  <div class="app-register-wrap">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabsClick">
      <el-tab-pane label="基本信息" name="0">
        <div class="app-base-info register-content">
          <div class="custom-title">
            <p><span class="custom-span"></span> 基础信息</p>
          </div>
          <el-form
            :model="form.data"
            ref="registerFormRef"
            :rules="isDetailPage ? {} : rules"
            label-position="top"
            class="demo-form-inline"
          >
            <el-row :gutter="40" justify="space-between">
              <el-col :span="12">
                <el-form-item label="应用名称" prop="name">
                  <el-input
                    v-model="form.data.name"
                    :readonly="isDetailPage"
                    placeholder="请设置"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="应用编码" prop="code">
                  <el-input
                    v-model="form.data.code"
                    :readonly="isDetailPage"
                    placeholder="请设置"
                  />
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
                v-model="form.data.remark"
                type="textarea"
                maxlength="120"
                show-word-limit
                placeholder="请输入应用介绍"
                :readonly="isDetailPage"
              />
            </el-form-item>
          </el-form>
        </div>
        <el-divider />
        <div class="app-base-info register-content resource-box">
          <div class="custom-title">
            <p> <span class="custom-span"></span> 资源信息 </p>
            <el-icon
              v-if="!isDetailPage"
              class="add-btn"
              :size="20"
              @click.stop="handleMemuEvent('Add')"
            >
              <CirclePlus />
            </el-icon>
          </div>
          <SetAppMenu
            :menus="resources.resources"
            :key="`${resources.resources.length}-${resources.resources.map((v:any)=>v?.id||v.customId).join('&')}`"
            :readOnly="isDetailPage"
            @handleMemuEvent="handleMemuEvent"
          />
        </div>
        <el-divider />
        <div class="app-base-info register-content btns">
          <el-button :type="isDetailPage ? 'primary' : 'info'" @click="router.back()">{{
            isDetailPage ? '返回' : '取消'
          }}</el-button>
          <el-button type="primary" @click="onSubmit" v-if="!isDetailPage">注册</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="分享信息" name="1">
        <el-select
          v-model="selectedValue"
          @change="changeGroupIndex"
          value-key="id"
          placeholder="请选择集团"
        >
          <el-option
            v-for="item in state.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-descriptions style="margin-top: 10px" class="margin-top" :column="3" border>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                Username
              </div>
            </template>
            kooriookami
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <iphone />
                </el-icon>
                Telephone
              </div>
            </template>
            18100000000
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <location />
                </el-icon>
                Place
              </div>
            </template>
            Suzhou
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <tickets />
                </el-icon>
                Remarks
              </div>
            </template>
            <el-tag size="small">School</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <office-building />
                </el-icon>
                Address
              </div>
            </template>
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="分配信息" name="2">Role</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
  import API from '@/services'
  import SetAppMenu from './setAppMenu.vue'
  import { onMounted, reactive, ref } from 'vue'
  import { ElMessage, FormRules } from 'element-plus'
  import { useRouter, useRoute } from 'vue-router'
  import { useCommonStore } from '@/store/common'
  import type { TabsPaneContext } from 'element-plus'
  const commonStore = useCommonStore()
  const router = useRouter()
  const routeInfo = useRoute()
  const isDetailPage = !!routeInfo.params.id
  console.log('搜索', isDetailPage, routeInfo.params.id)
  let form = reactive({
    data: {
      id: '',
      code: '',
      name: '',
      remark: '',
      privateKey: ''
    }
  })
  const activeName = ref<string>('0')
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

  // 当前选中的集团
  let selectedValue = ref<string>()
  // 当前用户的集团
  let groups = reactive([])
  const state = reactive({
    options: []
  })
  const handleTabsClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab.index)
    if (tab.index == '1') {
      getGroupList()
    }
  }
  // 查询集团列表
  const getGroupList = () => {
    API.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      .then((res: ResultType) => {
        if (res.data.result && res.data.result.length > 0) {
          groups = res.data.result
          state.options = groups.map((g) => {
            return { value: g.id, label: g.name }
          })
          selectedValue.value = groups[0].name
        } else {
          groups = []
        }
      })
  }
  // 处理资源信息操作
  const handleMemuEvent = (type: ProductMenuEventType, selectId?: string) => {
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
  // 排序资源信息
  const handleSortMenu = (type: ProductMenuEventType, aimId: string) => {
    const data = resources.resources
    // 根据当前所选标志 获取目标数据信息
    const obj = data.find((item) => item.customId === aimId)

    const idArr = data.map((item: AppResourcesType) => item.customId)
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
  // 触发表单 提交信息
  const onSubmit = () => {
    console.log('submit!', form.data)
    onRegisterSubmit()
  }
  // 注册表单Dom
  const registerFormRef = ref<any>(null)
  // 注册验证规则
  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入应用名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度限制2-20', trigger: 'blur' }
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
        // 过滤无效填写
        const resourcesData = resources.resources.filter((item) => {
          return item.link
        })
        const params = { ...form.data, resources: resourcesData }
        const { success, data } = await API.product.register({
          data: params
        })
        if (success) {
          ElMessage({
            type: 'success',
            message: '应用注册成功'
          })
          commonStore.isChangeStartApp = true
          router.back()
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  onMounted(() => {
    if (isDetailPage) {
      getAppResource()
      queryInfo()
    }
  })

  const queryInfo = async () => {
    const { data, success } = await API.product.queryInfo({
      data: {
        id: routeInfo.params.id
      }
    })
    if (success) {
      console.log('应用信息', data, form)
      // registerFormRef.value.resetFields(data)
      form.data = { ...data }
    }
  }
  // 详情功能区域
  const getAppResource = async () => {
    const { data, success } = await API.product.queryOwnResource({
      data: {
        id: routeInfo.params.id,
        offset: 0,
        limit: 10,
        filter: ''
      }
    })
    if (success) {
      const { result = [], total = 0 } = data
      if (total === 0 && !isDetailPage) {
        return ElMessage({
          type: 'error',
          message: '该应用资源缺失,请联系管理员'
        })
      } else {
        console.log('是是是', result)

        resources.resources = result
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-register-wrap {
    // height: 100%;
    background: var(--el-bg-color-overlay);
    margin: 16px;
    border: 0;
    overflow-y: auto;
    height: calc(100vh - 148px);

    .register-content {
      width: 600px;
      margin: 0 auto;
      :deep(.el-input__wrapper),
      :deep(.el-textarea__inner) {
        background-color: var(--el-color-primary-light-9); //#f3f5fa;
        box-shadow: none;
        border: 1px solid var(--el-input-focus-border-color);
      }
      :deep(.el-textarea .el-input__count) {
        background-color: var(--el-color-primary-light-9); //#f3f5fa;
        box-shadow: none;
      }
    }
    .resource-box {
      min-height: 200px;
    }
    .page-title {
      font-size: 16px;
      text-align: center;
    }
    .btns {
      display: flex;
      justify-content: space-around;
      padding: 10px 0 24px;
      // margin-bottom: 30px;
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
    .demo-tabs {
      height: 100%;
      :deep(.el-tabs__content) {
        height: calc(100% - 55px);
        overflow-y: auto;
      }
      :deep(.el-tab-pane){
        height: 100%;
      }
    }
  }
</style>
