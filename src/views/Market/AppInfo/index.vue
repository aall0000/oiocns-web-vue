<template>
  <MarketCard />
  <div class="app-info-wrap">
    <el-tabs v-model="activeName" class="demo-tabs">
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
                  <el-input v-model="form.data.name" :readonly="editControl" placeholder="请设置" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="应用编码" prop="code">
                  <el-input v-model="form.data.code" :readonly="editControl" placeholder="请设置" />
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
                :rows="4"
                v-model="form.data.remark"
                type="textarea"
                maxlength="120"
                show-word-limit
                placeholder="请输入应用介绍"
                :readonly="editControl"
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
            :readOnly="editControl"
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
        <el-button
          v-if="form.data.createUser == useStore.queryInfo.id"
          small
          link
          type="primary"
          class="editBtn"
          @click="editForm"
        >
          {{ editControl ? '编辑' : '完成' }}</el-button
        >
      </el-tab-pane>
      <el-tab-pane v-if="isDetailPage" label="共享信息" name="1">
        <ShareGroup
          v-if="!isPerson && activeName == '1'"
          :form="form.data"
          :info="resources.info"
        ></ShareGroup>
        <SharePerson
          v-else-if="isPerson && activeName == '1'"
          :form="form.data"
          :info="resources.info"
        ></SharePerson>
      </el-tab-pane>
      <el-tab-pane v-if="isDetailPage && !isPerson" label="分配信息" name="2">
        <CohortBox v-if="activeName == '2'" :info="resources.info" :form="form.data"></CohortBox>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
  import SetAppMenu from './setAppMenu.vue'
  import { onMounted, reactive, ref, computed } from 'vue'
  import { ElMessage, FormRules, ElMessageBox } from 'element-plus'
  import { useRouter, useRoute } from 'vue-router'
  import { useCommonStore } from '@/store/common'
  import ShareGroup from './shareGroup.vue'
  import SharePerson from './sharePerson.vue'
  import CohortBox from './cohortBox.vue'
  import { useUserStore } from '@/store/user'
  import { appstore, Application } from '@/module/store/app'

  const useStore = useUserStore()
  const commonStore = useCommonStore()
  const router = useRouter()
  const routeInfo = useRoute()
  const isDetailPage = !!routeInfo.params.id
  const application = new Application(routeInfo.params.id.toString(), 1)
  const isPerson = ref<boolean>(false)
  const editShow = ref<boolean>(false)
  let form = reactive({
    data: {
      id: '',
      code: '',
      name: '',
      remark: '',
      privateKey: '',
      createUser: '',
      resources: []
    }
  })
  const activeName = ref<string>('0')
  let resources = reactive({
    info: {
      id: ''
    },
    resources: [
      {
        id: '',
        name: '',
        link: '',
        code: '',
        privateKey: '',
        customId: '1'
      }
    ]
  })
  const editControl = computed(() => {
    if (isDetailPage && editShow.value) {
      return false
    } else {
      return true
    }
  })
  // 处理资源信息操作
  const handleMemuEvent = async (type: ProductMenuEventType, selectId?: string) => {
    switch (type) {
      case 'Add':
        resources.resources.push({
          id: '',
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
          ElMessageBox.confirm('确认删除所选资源？', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              resources.resources = resources.resources.filter(
                (item) => item.customId ?? item.id !== selectId
              )
              const res = await appstore.deleteResource(selectId)
              if (res) {
                ElMessage({
                  type: 'success',
                  message: '删除成功'
                })
                getAppResource()
              }
            })
            .catch(() => {
              return
            })
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
    appstore.handleSortMenu(resources.resources, type, aimId)
  }
  // 触发表单 提交信息
  const onSubmit = () => {
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
        const success = await appstore.onRegister(params)
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
    useStore.workspaceData.type == 1 ? (isPerson.value = true) : (isPerson.value = false)
    resources.info = JSON.parse(JSON.stringify(routeInfo.params))
    resources.info.id.toString()
    if (isDetailPage) {
      getAppResource()
      queryInfo()
    }
  })

  const editForm = async () => {
    if (editShow.value) {
      form.data.resources = resources.resources
      let params = form.data
      await appstore.updateProduct(params)
    }
    editShow.value = !editShow.value
  }

  const queryInfo = async () => {
    const data = await appstore.queryInfo(routeInfo.params.id.toString())
    form.data = { ...data }
  }
  // 详情功能区域
  const getAppResource = async () => {
    const result = await application.searchResource()
    result.forEach((el: any) => {
      el.flows = JSON.parse(el.flows)
      el.components = JSON.parse(el.components)
    })

    resources.resources = result
  }
</script>

<style lang="scss" scoped>
  .editBtn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .app-info-wrap {
    // height: 100%;
    background: var(--el-bg-color-overlay);
    margin: 6px;
    border: 0;
    overflow-y: auto;
    height: calc(100vh - 148px);
    padding: 20px;

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
      :deep(.el-tab-pane) {
        height: 100%;
      }
    }
  }
</style>
