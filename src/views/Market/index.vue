<template>
  <div class="market-layout">
    <MarketCard>
      <template #right>
        <el-button type="primary" @click="GoPage('/market/appApply')">我的上架申请</el-button>
        <el-button type="primary" @click="registerVisible = true">注册应用</el-button>
        <el-button type="primary" @click="GoPage('/market/markList')">管理商店</el-button>
        <el-button type="primary" @click="GoPage('/market/managerApproval')">申请审批</el-button>
        <el-button type="primary" @click.stop="GoPage('/market/order')">我的订单</el-button>
        <el-badge :value="shopcarNum" style="padding-left: 10px">
          <el-button type="primary" @click.stop="GoPage('/market/shopCar')">购物车</el-button>
        </el-badge>
      </template>
    </MarketCard>
    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的应用</p>
        <li class="app-card">
          <MarketCreate :info="add" @myclick="GoPage('/market/getApp')" />
          <ShopCard
            v-for="item in state.ownProductList"
            :info="item"
            :key="item.id"
            :over-id="item.id"
          >
          <template #rightIcon>
              <el-dropdown trigger="click" @command="(value) => handleCommand('own', value, item)" placement="left-start">
                <el-icon :size="18" ><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="action in actionOptionsOfOwn" :command="action.value" :key="action.value">
                    {{ action.label }}
                  </el-dropdown-item>
                  <el-dropdown-item  @click="deleteApp(item)">移除应用</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>

          </ShopCard>
        </li>
        <el-pagination
          style="justify-content: end"
          hide-on-single-page
          layout="prev, pager, next"
          :total="state.ownTotal"
        />
      </ul>
      <ul class="box-ul">
        <p class="box-ul-title">其他应用</p>
        <li class="app-card">
          <ShopCard
            v-for="item in state.shareProductList"
            :info="item"
            :key="item.id"
            :over-id="item.id"
          >
          <template #rightIcon>
              <el-dropdown trigger="click">
                <el-icon :size="18" ><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item >Action 1</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <el-dropdown @command="(value) => handleCommand('other', value, item)" placement="left-start">
              <el-button class="btn" type="primary" link small> 设置 </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="action in actionOptionsOfOther" :command="action.value" :key="action.value">
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-divider direction="vertical" />
            <el-button class="btn" link small @click="deleteApp(item)">移除应用</el-button>
          </ShopCard>
        </li>
        <el-pagination
          style="justify-content: end"
          hide-on-single-page
          layout="prev, pager, next"
          :total="state.shareTotal"
        />
      </ul>
    </div>
  </div>
  <el-dialog
    v-model="registerVisible"
    title="注册应用"
    width="600px"
    draggable
    :close-on-click-modal="false"
  >
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(registerFormRef)">取消</el-button>
        <el-button type="primary" @click="onRegisterSubmit(registerFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="publishVisible"
    title="上架应用"
    width="600px"
    draggable
    :close-on-click-modal="false"
  >
    <putaway-comp :info="selectProductItem" ref="putawayRef" @closeDialog="publishVisible = false">
      <template #btns>
        <div class="putaway-footer" style="text-align: right">
          <el-button @click="publishVisible = false">取消</el-button>
          <el-button type="primary" @click="putawaySubmit()"> 确认</el-button>
        </div>
      </template>
    </putaway-comp>
  </el-dialog>
  <el-dialog
    v-if="groupVisible"
    v-model="groupVisible"
    custom-class="group-dialog"
    :title="title"
    width="600px"
    draggable
    :close-on-click-modal="false"
  >
    <el-select
      v-model="selectedValue"
      value-key="id"
      :placeholder="'请' + title"
      @change="selectchange"
    >
      <el-option
        v-for="item in state.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <template #footer>
      <span class="dialog-footer" v-if="store.workspaceData.type == 2">
        <el-button @click="shareGroup">按集团分享</el-button>
        <el-button type="primary" @click="shareUnit">按单位分享</el-button>
      </span>
      <span class="dialog-footer" v-else>
        <el-button type="primary" @click="shareCohort">按群组分享</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-if="cohortVisible"
    v-model="cohortVisible"
    custom-class="share-dialog"
    title="应用分发"
    width="1000px"
    draggable
    :close-on-click-modal="false"
  >
    <Cohort @closeDialog="cohortVisible = false" :info="selectProductItem"></Cohort>
  </el-dialog>
</template>
<script setup lang="ts">
  import API from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  import ShopCard from './components/shopCard.vue'
  import PutawayComp from './components/putawayComp.vue'
  import { baseData, actionOptionsOfOther, actionOptionsOfOwn } from './config'
  import Cohort from './components/cohortBox.vue'
  import { useRouter } from 'vue-router'
  import type { FormInstance, FormRules } from 'element-plus'
  import MarketCreate from './components/marketCreate.vue'
  import MarketCard from '@/components/marketCard/index.vue'
  import type { TabsPaneContext } from 'element-plus'
  import { useUserStore } from '@/store/user'
  import { appendFile } from 'fs'
  import $services from '@/services'
  const add: string = '从应用市场中添加'
  // 注册页面实例
  const registerFormRef = ref<FormInstance>()
  const router = useRouter()
  const store = useUserStore()
  const cohort = ref(null)
  type StateType = {
    ownProductList: ProductType[] //我的应用
    ownTotal: number
    shareProductList: ProductType[] //其他应用
    shareTotal: number
    marketOptions: any[] //所有市场列表
    options: any[] //集团列表
    selectLabel: selectType // 选中的集团名称
  }

  const state: StateType = reactive({
    ownProductList: [],
    ownTotal: 0,
    shareProductList: [],
    shareTotal: 0,
    marketOptions: [],
    options: [],
    selectLabel: {
      label: '',
      id: ''
    }
  })
  const title = ref<string>('')
  onMounted(() => {
    // 获取列表
    getProductList('own')
    getProductList('share')
    getShopcarNum()
  })

  const shopcarNum = ref(0)

const getShopcarNum = async () => {
  await $services.market
    .searchStaging({
      data: {
        id: 0, //市场id （需删除）
        offset: 0,
        limit: 20,
        filter: ''
      }
    }).then((res: ResultType) => {
      var { result = [], total = 0 } = res.data
      shopcarNum.value = total
    })
  }
  // 获取我的应用列表
  const getProductList = async (type: 'own' | 'share') => {
    const { data, success } = await API.product[
      type === 'own' ? 'searchOwnProduct' : 'searchShareProduct'
    ]({
      data: { offset: 0, limit: 10, filter: '' }
    })
    if (success) {
      const { result = [], total = 0 } = data
      state[`${type}ProductList`] = [...result]
      state[`${type}Total`] = total
    }
  }


// 移除app
const deleteApp = (item: any) => {
  ElMessageBox.confirm(`确认删除  ${item.name}?`, '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { success } = await API.product.delete({
        data: { id: item.id }
      })
      if (success) {
        getProductList('own')
        ElMessage({
          type: 'success',
          message: '操作成功'
        })
      }
    })
    .catch(() => {})
}

  // 记录当前操作的 应用信息
  const selectProductItem = ref<ProductType>()
  // 处理 设置 菜单选择事件
  const handleCommand = (
    type: 'own' | 'other',
    command: string | number | object,
    item: ProductType
  ) => {
    selectProductItem.value = item
    switch (command) {
      case 'share':
        openShareDialog()
        break
      case 'putaway':
        publishVisible.value = true
        break
      case 'unsubscribe':
        break
      case 'distribution':
        cohortVisible.value = true
        break
      default:
        break
    }
  }
  // 按群组分享
  const shareCohort = () => {}

  //  打开集团选择弹窗
  const openShareDialog = () => {
    if (store.workspaceData.type == 1) {
      API.cohort
        .getJoinedCohorts({
          data: {
            offset: 0,
            limit: 10000,
            filter: ''
          }
        })
        .then((res: ResultType) => {
          console.log(res)
          if (res.data.result && res.data.result.length > 0) {
            let cor = res.data.result
            state.options = cor.map((g: any) => {
              return { value: g.id, label: g.name }
            })
            title.value = '选择群组'
            groupVisible.value = true
          } else {
            ElMessage({
              type: 'warning',
              message: '您暂未加入群组'
            })
          }
        })
    } else {
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
            title.value = '选择集团'
            groupVisible.value = true
            // loadOrgTree(groups[0].id)
          } else {
            groups = []
          }
        })
    }
  }
  // 跳转到group分享界面
  const shareGroup = () => {
    if (selectedValue.value) {
      router.push({
        path: '/market/group',
        query: {
          id: selectedValue.value,
          name: state.selectLabel.label,
          appInfo: selectProductItem.value.id
        }
      })
    } else {
      ElMessage({
        type: 'warning',
        message: '请选择集团'
      })
    }
  }
  // 跳转到unit分享界面
  const shareUnit = () => {
    if (selectedValue.value) {
      router.push({
        path: '/market/unit',
        query: {
          id: selectedValue.value,
          name: state.selectLabel.label,
          appInfo: selectProductItem.value.id
        }
      })
    } else {
      ElMessage({
        type: 'warning',
        message: '请选择集团'
      })
    }
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
const onRegisterSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!', form)
      const { success } = await API.product.register({
        data: form
      })
      if (success) {
        getProductList('own')
        ElMessage({
          type: 'success',
          message: '应用注册成功'
        })
        resetForm(formEl)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
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

// 重置注册表单
const resetForm = (formEl: FormInstance) => {
  registerVisible.value = false
  if (!formEl) return
  formEl.resetFields()
}

// 上架应用功能
const publishVisible = ref<boolean>(false)
const putawayRef = ref<any>()
// 提交上架
const putawaySubmit = () => {
  putawayRef.value.onPutawaySubmit()
}

  // 当前用户的集团
  let groups = reactive([])
  // 当前选中的集团
  let selectedValue = ref<string>('')
  // 集团分享
  const groupVisible = ref<boolean>(false)
  // 分享功能
  const cohortVisible = ref<boolean>(false)
  // 路由跳转
  const GoPage = (path: string) => {
    router.push(path)
  }
</script>

<style>
  .group-dialog > .el-dialog__body {
    padding: 10px 20px;
    height: 100px;
    display: flex;
    align-items: center;
  }
  .share-dialog > .el-dialog__header {
    text-align: center;
    font-weight: bold;
  }
  .share-dialog > .el-dialog__body {
    padding: 10px 20px;
  }
</style>
<style lang="scss" scoped>
  .header-box {
    display: flex;
  }
  .cohortLayout {
    width: 100%;
    height: 500px;
    overflow: auto;
  }
  .menuRight {
    width: 100px;
    height: 60px;
    position: absolute;
    background-color: rgb(247, 247, 247);
    font-size: 12px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

  &-fixed {
    padding: 5px 0;
    width: 100%;
    text-align: center;
    &:hover {
      background-color: #fff;
    }
  }
  &-cancel {
    padding: 10px 0;
    width: 100%;
    text-align: center;
    &:hover {
      background-color: #fff;
    }
  }
}
.el-select {
  width: 100%;
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
