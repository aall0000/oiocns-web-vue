<template>
  <div class="market-layout">
    <MarketCard :isSee="true">
      <template #right>
        <div class="edit-wrap">
          <el-button small link type="primary" @click="GoPage('/market/appApply')"
            >我的上架申请</el-button
          >
          <el-button small link type="primary" @click="GoPage('/market/register')"
            >注册应用</el-button
          >
          <!-- <el-button small link type="primary" @click="GoPage('/market/softShare')"
            >从开放市场中添加应用</el-button
          > -->
          <el-button small link type="primary" @click="GoPage('/market/marketList')"
            >商店列表</el-button
          >
          <el-button small link type="primary" @click.stop="GoPage('/market/order/buy')"
            >采购订单</el-button
          >
          <el-button small link type="primary" @click.stop="GoPage('/market/order/sell')"
            >售卖订单</el-button
          >
          <el-badge :value="shopcarNum" style="padding-left: 10px">
            <el-button small link type="primary" @click.stop="GoPage('/market/shopCar')"
              >购物车</el-button
            >
          </el-badge>
        </div>
        <div>
          <el-radio-group v-model="mode" size="small" class="button">
            <el-radio-button label="list">
              <el-icon :size="18">
                <Tickets />
              </el-icon>
            </el-radio-button>
            <el-radio-button label="card">
              <el-icon :size="18">
                <Menu />
              </el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
      </template>
    </MarketCard>
    <div class="market-content box">
      <ul class="box-ul">
        <div class="getApp-radio">
          <p class="box-ul-title">我的应用</p>
          <div class="search">
            <el-input v-model="searchText" @input="searchList" placeholder="搜索应用" clearable />
          </div>
          <!-- <p style="margin-right: 20px">切换视图</p>
          <el-switch v-model="isCard" /> -->
        </div>
        <li class="app-card" v-show="mode === 'card'">
          <MarketCreate
            :info="add"
            @myclick="GoPage('/market/softShare')"
          />
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
                @command="(value:any) => handleCommand('own', value, item)"
                placement="left-start"
              >
                <el-icon style="cursor: pointer" :size="20"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <div v-for="action in actionOptionsOfOwn" :key="action.value">
                      <div v-if="new Date().getTime() < formartDateTime(item?.endTime)">
                        <el-dropdown-item
                          v-if="
                            item.authority == '所属权' &&
                            item.belongId == store.workspaceData.id &&
                            action.label == '上架'
                          "
                          :command="action.value"
                          >{{ action.label }}</el-dropdown-item
                        >
                        <el-dropdown-item
                          v-if="item.belongId == store.workspaceData.id && action.label == '分享'"
                          :command="action.value"
                          >{{ action.label }}</el-dropdown-item
                        >
                        <el-dropdown-item
                          v-if="store.workspaceData.type == 2 && action.label == '分发'"
                          :command="action.value"
                          >{{ action.label }}</el-dropdown-item
                        >
                      </div>
                      <el-dropdown-item v-if="action.label == '详情'" :command="action.value">{{
                        action.label
                      }}</el-dropdown-item>
                    </div>
                    <el-dropdown-item @click="deleteApp(item)">移除应用</el-dropdown-item>
                    <!-- <el-dropdown-item  @click="GoPage('/market/appDetail')">应用详情</el-dropdown-item> -->
                    <el-dropdown-item @click="GoPageWithQuery('/market/publishList', {id:item.id})"
                      >应用上架列表</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </ShopCard>
        </li>
        <li class="tab-card" v-show="mode === 'list'">
          <DiyTable
            ref="diyTable"
            :hasTitle="true"
            @handleUpdate="handleUpdate"
            :tableData="state.ownProductList"
            :tableHead="state.tableHead"
          >
            <template #name="scope">
              {{ scope.row.name }}
            </template>
            <template #tag="scope">
              <el-tag
                v-if="
                  scope.row.endTime == undefined ||
                  new Date().getTime() < formartDateTime(scope.row?.endTime)
                "
                style="margin-left: 10px"
                :type="scope.row.createUser == queryInfo.id ? '' : 'success'"
                >{{ scope.row.createUser == queryInfo.id ? '可管理' : '可使用' }}</el-tag
              >
              <el-tag
                v-if="new Date().getTime() > formartDateTime(scope.row?.endTime)"
                style="margin-left: 10px"
                :type="'danger'"
                >失效</el-tag
              >
              <el-tag style="margin-left: 10px">{{ scope.row.source }}</el-tag>
            </template>
            <template #operate="scope">
              <el-button
                v-if="
                  scope.row.authority == '所属权' && scope.row.belongId == store.workspaceData.id
                "
                link
                type="primary"
                @click="publishVisible = true"
                >上架</el-button
              >
              <el-button
                link
                type="primary"
                v-if="scope.row.belongId == store.workspaceData.id"
                @click="openShareDialog"
                >分享</el-button
              >
              <el-button
                link
                type="primary"
                v-if="store.workspaceData.type == 2"
                @click="cohortVisible = true"
                >分发</el-button
              >
              <el-button
                link
                type="primary"
                @click="GoPage(`/market/detail/${selectProductItem.id}`)"
              >
                详情
              </el-button>

              <el-button link type="primary" @click="deleteApp(scope.row)">移除应用</el-button>
            </template>
          </DiyTable>
        </li>
        <div class="page-flex" v-show="mode === 'card'">
          <Pagination ref="pageContent" @handleUpdate="handleUpdate"></Pagination>
        </div>
      </ul>
    </div>
  </div>
  <el-dialog
    v-model="publishVisible"
    title="应用上架"
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
    v-if="shareVisible"
    v-model="shareVisible"
    custom-class="share-dialog"
    title="应用分享"
    width="1000px"
    draggable
    :close-on-click-modal="false"
  >
    <ShareCohort
      v-if="store.workspaceData.type == 2"
      @closeDialog="shareVisible = false"
      :info="selectProductItem"
    ></ShareCohort>
    <SharePersonBox
      v-else
      @closeDialog="shareVisible = false"
      :info="selectProductItem"
    ></SharePersonBox>
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
  import ShareCohort from './components/shareCohortBox.vue'
  import SharePersonBox from './components/sharePersonBox.vue'
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
  import Pagination from '@/components/pagination/index.vue'
  import { storeToRefs } from 'pinia'
  // hoverItem--鼠标移入item的id 用于展示按钮区域

  const add: string = '从开放市场中添加应用'
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

  const { queryInfo } = storeToRefs(store)

  // 当前用户的集团
  let groups = reactive([])
  // 当前选中的集团
  let selectedValue = ref<string>('')
  // 集团分享
  const groupVisible = ref<boolean>(false)
  // 分享功能
  const cohortVisible = ref<boolean>(false)

  const shareVisible = ref<boolean>(false)
  // 路由跳转
  const searchText = ref<string>('')
  const pageContent = ref(null)
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  const GoPageWithQuery = (path: string, query: any) => {
    router.push({ path, query })
  }
  //应用搜索
  const GoPage = (path: string) => {
    router.push(path)
  }
  type StateType = {
    ownProductList: ProductType[] //我的应用
    ownTotal: number
    shareTotal: number
    marketOptions: any[] //所有市场列表
    options: any[] //集团列表
    selectLabel: selectType // 选中的集团名称
    tableHead: any[]
  }

  const state: StateType = reactive({
    ownProductList: [],
    ownTotal: 0,
    shareTotal: 0,
    marketOptions: [],
    options: [],
    selectLabel: {
      label: '',
      id: ''
    },
    tableHead: [
      {
        type: 'slot',
        prop: 'name',
        name: 'name',
        label: '应用名称'
      },
      {
        type: 'slot',
        prop: 'tag',
        name: 'tag',
        label: '应用状态'
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
        label: '创建时间',
        width: '200'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '300',
        name: 'operate'
      }
    ]
  })
  const title = ref<string>('')
  onMounted(() => {
    // 获取列表
    getProductList()
    getShopcarNum()
  })

  //列表
  watch([isCard], ([val], [valOld]) => {
    // 监听 展示方式变化
    nextTick(() => {
      if (val) {
        getProductList()
      } else {
        getProductList()
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
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getProductList()
  }
  // 获取我的应用列表
  const getProductList = async () => {
    const { data, success } = await API.product['searchOwnProduct']({
      data: {
        offset: (pageStore.currentPage - 1) * pageStore.pageSize,
        limit: pageStore.pageSize,
        filter: searchText.value
      }
    })
    if (success) {
      const { result = [], total = 0 } = data
      state[`ownProductList`] = [...result]
      state[`ownTotal`] = total
      pageStore.total = total
      diyTable.value.state.page.total = total
      pageContent.value.state.page.total = total
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
          getProductList()
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
      case 'detail':
        GoPage(`/market/detail/${item.id}`)
        break
      default:
        break
    }
  }

  //  打开集团选择弹窗
  const openShareDialog = () => {
    shareVisible.value = true
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
  // const shareUnit = () => {
  //   if (selectedValue.value) {
  //     groupId.value = selectedValue.value
  //     groupName.value = state.selectLabel.label
  //     appInfo.value = selectProductItem.value.id

  //     groupVisible.value = false
  //     // groupShareVisible.value = true
  //     shareVisible.value = true
  //   } else {
  //     ElMessage({
  //       type: 'warning',
  //       message: '请选择集团'
  //     })
  //   }
  // }
  // 按群组分享
  const shareCohort = () => {}

  // 上架应用功能
  const publishVisible = ref<boolean>(false)
  const putawayRef = ref<any>()
  // 提交上架
  const putawaySubmit = () => {
    putawayRef.value.onPutawaySubmit()
  }
  //搜索应用
  const searchList = () => {
    pageStore.currentPage = 1
    getProductList()
  }
  const formartDateTime = (dateStr: any) => {
    if (dateStr) {
      var timestamp = new Date(dateStr).getTime()
      return timestamp
    } else {
      return new Date().getTime() + 1000
    }
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

  .page-flex {
    height: 64px;
    width: 100%;
    overflow: hidden;
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
    position: relative;
    .market-head {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
      padding: 0 20px;
    }
    .market-content {
      position: absolute;
      padding: 16px 16px 0;
      // margin-top: 4px;
      width: 100%;
      height: calc(100% - 76px);
      overflow-y: auto;
    }
    .edit-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .button {
      // position: absolute;
      // right: 50px;
      // bottom: 20px;
      margin-left: 20px;
    }
    .box {
      .box-ul{
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
      }
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
          justify-content: space-between;
          margin-bottom: 20px;
          .box-ul-title {
            width: 50%;
            display: flex;
            justify-content: flex-start;
          }
          .search {
            width: 200px;
            display: flex;
            justify-content: flex-start;
          }
        }
        .app-card {
          display: flex;
          flex-wrap: wrap;
          height: calc(100% - 50px);
          align-content:flex-start;
          overflow-y: auto;
        }
        .tab-card{
          height: 100%;
        }
      }
    }
  }
</style>
