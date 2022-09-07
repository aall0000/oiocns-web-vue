<template>
  <div class="market-layout">
    <MarketCard>
      <template #right>
        <div class="edit-wrap">
          <el-button small link type="primary" @click="GoPage('/market/appApply')"
            >我的上架申请</el-button
          >
          <el-button small link type="primary" @click="GoPage('/market/register')"
            >注册应用</el-button
          >
          <el-button small link type="primary" @click="GoPage('/market/markList')"
            >商店列表</el-button
          >
          <el-button small link type="primary" @click.stop="GoPage('/market/order')"
            >我的订单</el-button
          >
          <el-badge :value="shopcarNum" style="padding-left: 10px">
            <el-button small link type="primary" @click.stop="GoPage('/market/shopCar')"
              >购物车</el-button
            >
          </el-badge>
        </div>
        <div>
          <el-radio-group v-model="mode" size="small" class="button">
            <el-radio-button label="list"
              ><el-icon :size="18"><Tickets /></el-icon
            ></el-radio-button>
            <el-radio-button label="card"
              ><el-icon :size="18"><Menu /></el-icon
            ></el-radio-button>
          </el-radio-group>
        </div>
      </template>
    </MarketCard>
    <div class="market-content box">
      <ul class="box-ul">
        <div class="getApp-radio">
          <p class="box-ul-title">我的应用</p>
        </div>
        <li class="app-card" v-show="mode === 'card'">
          <MarketCreate :info="add" @myclick="GoPage('/market/getApp')" />
          <ShopCard
            v-for="item in state.ownProductList"
            :info="item"
            :key="item.id"
            :over-id="item.id"
          >
            <template #icon
              ><HeadImg
                :name="item.name"
                :url="item.icon || appImg"
                :imgWidth="48"
                :limit="1"
                :isSquare="false"
            /></template>
            <template #rightIcon>
              <el-dropdown
                trigger="click"
                @command="(value) => handleCommand('own', value, item)"
                placement="left-start"
              >
                <el-icon :size="18"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="action in actionOptionsOfOwn"
                      :command="action.value"
                      :key="action.value"
                    >
                      {{ action.label }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteApp(item)">移除应用</el-dropdown-item>
                    <!-- <el-dropdown-item  @click="GoPage('/market/appDetail')">应用详情</el-dropdown-item> -->
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </ShopCard>
        </li>
        <li v-show="mode === 'list'">
          <DiyTable
            ref="diyTable"
            :hasTitle="true"
            :tableData="state.ownProductList"
            :tableHead="state.tableHead"
          >
            <template #operate="scope">
              <el-dropdown
                trigger="click"
                @command="(value) => handleCommand('own', value, scope.row)"
                placement="bottom-end"
              >
                <el-icon :size="18"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="action in actionOptionsOfOwn"
                      :command="action.value"
                      :key="action.value"
                    >
                      {{ action.label }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteApp(scope.row)">移除应用</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </DiyTable>
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
        <li class="app-card" v-show="mode === 'card'">
          <ShopCard
            v-for="item in state.shareProductList"
            :info="item"
            :key="item.id"
            :over-id="item.id"
          >
            <template #icon
              ><HeadImg
                :name="item.name"
                :url="item.icon || appImg"
                :imgWidth="48"
                :createUser="item.createUser"
                :limit="1"
                :isSquare="false"
            /></template>
            <template #rightIcon>
              <el-dropdown
                trigger="click"
                @command="(value) => handleCommand('own', value, item)"
                placement="left-start"
              >
                <el-icon :size="18"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="deleteApp(item)">移除应用</el-dropdown-item>
                    <!-- <el-dropdown-item  @click="GoPage('/market/appDetail')">应用详情</el-dropdown-item> -->
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <!-- <template #rightIcon>
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
            <el-button class="btn" link small @click="deleteApp(item)">移除应用</el-button> -->
          </ShopCard>
        </li>
        <li v-show="mode === 'list'">
          <DiyTable
            ref="diyTable"
            :hasTitle="true"
            :tableData="state.shareProductList"
            :tableHead="state.tableHead"
          >
            <template #operate="scope">
              <el-dropdown
                trigger="click"
                @command="(value) => handleCommand('own', value, scope.row)"
                placement="bottom-end"
              >
                <el-icon :size="18"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="action in actionOptionsOfOwn"
                      :command="action.value"
                      :key="action.value"
                    >
                      {{ action.label }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteApp(scope.row)">移除应用</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </DiyTable>
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
        <!-- <el-button @click="groupVisible = false">取消</el-button>
        <el-button type="primary" @click="shareUnit">确定</el-button> -->
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
  <el-dialog
    v-if="unitShareVisible"
    v-model="unitShareVisible"
    custom-class="share-dialog"
    title="应用分享"
    width="1000px"
    draggable
    :close-on-click-modal="false"
  >
    <Unit :groupId="groupId" :appInfo="appInfo" :groupName="groupName" />
  </el-dialog>
  <el-dialog
    v-if="groupShareVisible"
    v-model="groupShareVisible"
    custom-class="share-dialog"
    title="应用分享"
    width="1000px"
    draggable
    :close-on-click-modal="false"
  >
    <Group :groupId="groupId" :appInfo="appInfo" :groupName="groupName" />
  </el-dialog>
  <el-dialog
    v-if="personCohortShareVisible"
    v-model="personCohortShareVisible"
    custom-class="share-dialog"
    title="应用分享"
    width="1000px"
    draggable
    :close-on-click-modal="false"
  >
    <Person :groupId="groupId" :appInfo="appInfo" />
  </el-dialog>
</template>
<script setup lang="ts">
  import API from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, reactive, ref, watch, nextTick } from 'vue'
  import ShopCard from './components/shopCard.vue'
  import PutawayComp from './components/putawayComp.vue'
  import { baseData, actionOptionsOfOther, actionOptionsOfOwn } from './config'
  import Cohort from './components/cohortBox.vue'
  import { useRouter } from 'vue-router'
  import type { FormInstance, FormRules } from 'element-plus'
  import MarketCreate from './components/marketCreate.vue'
  import MarketCard from '@/components/marketCard/index.vue'
  import { useUserStore } from '@/store/user'
  import DiyTable from '@/components/diyTable/index.vue'
  import { appendFile } from 'fs'
  import appImg from '@/assets/img/app_icon.png'
  import $services from '@/services'
  import Unit from '../Market/AppShare/unit.vue'
  import Group from '../Market/AppShare/group.vue'
  import Person from '../Market/AppShare/person.vue'
  import TheTableButton from './AppList/components/theTableButton3.vue'
  const add: string = '从共享仓库中添加应用'
  const groupShareVisible = ref<boolean>(false)
  const unitShareVisible = ref<boolean>(false)
  const personCohortShareVisible = ref<boolean>(false)

  const isCard = ref(true)
  const mode = ref('card')
  // 注册页面实例
  const registerFormRef = ref<FormInstance>()
  const router = useRouter()
  const store = useUserStore()
  const cohort = ref(null)
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
  type StateType = {
    ownProductList: ProductType[] //我的应用
    ownTotal: number
    shareProductList: ProductType[] //其他应用
    shareTotal: number
    marketOptions: any[] //所有市场列表
    options: any[] //集团列表
    selectLabel: selectType // 选中的集团名称
    tableHead: any[]
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
    },
    tableHead: [
      {
        prop: 'name',
        label: '应用名称'
      },
      {
        prop: 'code',
        label: '应用编码'
      },
      {
        prop: 'source',
        label: '应用来源'
      },
      {
        prop: 'typeName',
        label: '应用类型'
      },
      {
        prop: 'authority',
        label: '持有权限'
      },
      {
        prop: 'createTime',
        label: '创建时间'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '80',
        name: 'operate'
      }
    ]
  })
  const title = ref<string>('')
  onMounted(() => {
    if (store.workspaceData.type == 1) {
      actionOptionsOfOwn.splice(2, 1)
    }
    // 获取列表
    getProductList('own')
    getProductList('share')
    getShopcarNum()
  })

  //列表
  watch([isCard], ([val], [valOld]) => {
    // 监听 展示方式变化
    nextTick(() => {
      if (val) {
        getProductList('own')
      } else {
        getProductList('share')
      }
    })
    // 监听所选市场变化
    // if (activeMVal!==activeMValOld) {
    //   getData()
    // }
  })

  const selectchange = (val: string) => {
    state.selectLabel = state.options.find((el) => {
      return el.value == val
    })
  }
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
      })
      .then((res: ResultType) => {
        var { result = [], total = 0 } = res.data
        shopcarNum.value = total
      })
  }
  // 关闭分享弹窗
  // const closeDialog = () => {
  //   shareVisible.value = false
  // }

  // 获取我的应用列表
  const getProductList = async (type: 'own' | 'share') => {
    const { data, success } = await API.product[
      type === 'own' ? 'searchOwnProduct' : 'searchShareProduct'
    ]({
      data: { offset: 0, limit: 10, filter: '' }
    })
    if (success) {
      const { result = [], total = 0 } = data
      console.log(result)
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

  //  打开集团选择弹窗
  const openShareDialog = () => {
    if (store.workspaceData.type == 1) {
      groupId.value = store.queryInfo.team.id

      appInfo.value = selectProductItem.value.id
      personCohortShareVisible.value = true

      // API.cohort
      //   .getJoinedCohorts({
      //     data: {
      //       offset: 0,
      //       limit: 10000,
      //       filter: ''
      //     }
      //   })
      //   .then((res: ResultType) => {
      //     console.log(res)
      //     if (res.data.result && res.data.result.length > 0) {
      //       let cor = res.data.result
      //       state.options = cor.map((g: any) => {
      //         return { value: g.id, label: g.name }
      //       })
      //       title.value = '选择群组'
      //       groupVisible.value = true
      //     } else {
      //       ElMessage({
      //         type: 'warning',
      //         message: '您暂未加入群组'
      //       })
      //     }
      //   })
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

  const groupId = ref('')
  const groupName = ref('')
  const appInfo = ref('')
  // 跳转到group分享界面
  const shareGroup = () => {
    if (selectedValue.value) {
      groupId.value = selectedValue.value
      groupName.value = state.selectLabel.label
      appInfo.value = selectProductItem.value.id
      groupVisible.value = false
      groupShareVisible.value = true
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
      groupId.value = selectedValue.value
      groupName.value = state.selectLabel.label
      appInfo.value = selectProductItem.value.id

      groupVisible.value = false
      unitShareVisible.value = true
    } else {
      ElMessage({
        type: 'warning',
        message: '请选择集团'
      })
    }
  }
  // 按群组分享
  const shareCohort = () => {}

  // 上架应用功能
  const publishVisible = ref<boolean>(false)
  const putawayRef = ref<any>()
  // 提交上架
  const putawaySubmit = () => {
    putawayRef.value.onPutawaySubmit()
  }
  const GoPageWithQuery = (path: string, query: any) => {
    router.push({ path, query })
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
    .edit-wrap{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .button {
      // position: absolute;
      // right: 50px;
      // bottom: 20px;
      margin-left:20px
    }
    .box {
      .box-ul + .box-ul {
        margin-top: 10px;
      }
      &-ul {
        background-color: var(--el-bg-color);
        padding: 10px 24px;

        &-title {
          font-weight: bold;
          padding: 8px 0;
        }
        .getApp-radio {
          display: flex;
          width: 100%;
          .box-ul-title {
            width: 50%;
            display: flex;
            justify-content: flex-start;
          }
        }
        .app-card {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
