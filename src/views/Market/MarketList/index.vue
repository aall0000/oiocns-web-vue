<template>
  <div class="market-layout">
    <MarketCard>
      <template #right>
        <el-button link type="primary" @click="createDialog = true">创建商店</el-button>
        <el-button link type="primary" @click="searchDialog = true">加入商店</el-button>
        <el-button
          link
          type="primary"
          @click="GoPage('/market/userApply')"
          style="margin-right: 10px"
          >我的加入申请
        </el-button>

        <el-radio-group v-model="showType" size="small" class="button">
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
      </template>
    </MarketCard>

    <div class="market-content box">
      <ul class="box-ul">
        <div class="getApp-radio">
          <p class="box-ul-title">我的商店</p>
          <div class="search">
            <el-input v-model="searchText" @input="searchList" placeholder="搜索商店" clearable />
          </div>
        </div>

        <li class="app-card" v-show="showType === 'card'">
          <template v-if="state.myMarket.length !== 0">
            <ShopCard
              v-for="item in state.myMarket"
              :info="item"
              :key="item.id"
              :overId="item.id"
              :softwareId = software
              type="market"
              @click="GoPageWithQuery('/market/appList', { data: item.id, type: 'manage' })"
            >
              <template #icon>

                <HeadImg
                  :name="item.name"
                  :url="item.icon || storeImg"
                  :imgWidth="32"
                  :limit="1"
                  :isSquare="true"
                />
              </template>
              <template #rightIcon>
                <el-dropdown
                  trigger="click"
                  placement="left-start"
                  v-if="item.id != software"
                >
                  <el-icon :size="18">
                    <Operation />
                  </el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click.stop="hadleClick(item)">
                        <el-button class="btn" type="primary" link small v-if="item.belongId==workspaceData.id"
                        >删除商店</el-button>
                        <el-button class="btn" type="primary" link small v-if="item.belongId!=workspaceData.id"
                        >退出商店</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item @click.stop="hadleUserManage(item)">
                        <el-button class="btn" link small>用户管理</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
              <template #footer>
                <el-divider style="margin: 16px 0"></el-divider>
                <el-descriptions size="small" :column="1">
                  <el-descriptions-item label="简介：">{{
                    item?.remark || '暂无'
                  }}</el-descriptions-item>
                </el-descriptions>
              </template>
              <!-- <template #rightTriangle
                ><div :class="item.public ? 'triangle-public' : 'triangle-'">{{
                  item.public ? '公' : ''
                }}</div></template
              > -->
            </ShopCard>
          </template>
        </li>
        <li v-show="showType === 'list'">
          <DiyTable
            ref="diyTable"
            :options="{ noPage: true, order: true }"
            :hasTitle="true"
            :tableData="state.myMarket"
            :tableHead="state.tableHead"
          >
            <template #isPublic="scope">
              <el-tag
                style="margin-left: 10px"
                :type="scope.row.public == true ? 'success' : ''"
                >{{ scope.row.public == true ? '公开的' : '私有的' }}</el-tag
              >
          </template>
          <template #tag="scope">
            <el-tag
            v-if="scope.row.id != software"
                style="margin-left: 10px"
                :type="scope.row.createUser == workspaceData.id ? '' : 'success'"
                >{{ scope.row.belongId == workspaceData.id ? '创建的' : '加入的' }}</el-tag
              >

          </template>
            <template #operate="scope">
              <el-button
                v-if="scope.row.id != software"
                class="btn"
                type="primary"
                link
                small
                @click.stop="hadleUserManage(scope.row)"
                >用户管理</el-button
              >
              <el-button
                class="btn"
                type="primary"
                link
                small
                @click.stop="marketQuit(scope.row)"
                v-if="scope.row.id != software"
                >删除商店</el-button
              >
            </template>
          </DiyTable>
        </li>

        <div class="page-flex" v-show="showType === 'card'">
          <Pagination ref="pageContent" @handleUpdate="handleUpdate"></Pagination>
        </div>
      </ul>
    </div>
    <el-dialog append-to-body v-model="createDialog" title="创建商店" width="30%" class="">
      <el-descriptions :model="form" :column="1" border>
        <el-descriptions-item label="商店名称">
          <el-input v-model="form.name" />
        </el-descriptions-item>
        <el-descriptions-item label="商店编码">
          <el-input v-model="form.code" />
        </el-descriptions-item>
        <el-descriptions-item label="商店简介">
          <el-input v-model="form.remark" />
        </el-descriptions-item>
        <el-descriptions-item label="商店是否公开">
          <el-switch
            v-model="form.public"
            active-text="是"
            inactive-text="否"
            inline-prompt
          ></el-switch>
          <!-- <el-select v-model="form.public" placeholder="是否公开" style="width: 100%">
            <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.label"/>
          </el-select> -->
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialog = false">取消</el-button>
          <el-button type="primary" @click="create">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- <diySearch
      :dialogShow="state.addDialog"
      title="加入商店"
      placeholder="搜索商店"
      @submit="submit"
      @remoteMethod="remoteMethod"
      @closeDialog="closeDialog"
    ></diySearch> -->

    <searchMarket
      v-if="searchDialog"
      @closeDialog="closeDialog"
      :serachType="7"
      @checksSearch="checksSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue'
import diySearch from '@/components/diySearch/index.vue'
import ShopCard from '../components/shopCard.vue'
import ShopCardBadge from '../components/shopCardBadge.vue'
import { useRouter } from 'vue-router'
import $services from '@/services'
import searchMarket from '@/components/searchs/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MarketCreate from '../components/marketCreate.vue'
import { useUserStore } from '@/store/user'
import storeImg from '@/assets/img/app_icon.png'
import Pagination from '@/components/pagination/index.vue'
import { storeToRefs } from 'pinia'

const searchDialog = ref<boolean>(false)
const searchType = ref<number>()

const router = useRouter()
const store = useUserStore()
const { queryInfo, workspaceData } = storeToRefs(store)
const handleCurrentMy: any = computed(() => {
  return (state.pageMy.currentPage - 1) * state.pageMy.pageSize
})
const handleCurrentJoin: any = computed(() => {
  return (state.pageJoin.currentPage - 1) * state.pageJoin.pageSize
})
const GoPageWithQuery = (path: string, query: any) => {
  router.push({ path, query })
}
const pageContent = ref(null)
const showType = ref('card')
const add: string = '创建商店'
const add1: string = '加入商店'
const searchText = ref<string>('')
const software = ref<string>('')
const state = reactive({
  softShareInfo:{
    id: ""
  },
  myMarket: [],
  joinMarket: [],
  pageMy: {
    total: 0, // 总条数
    currentPage: 1, // 当前页
    current: handleCurrentMy,
    pageSize: 12, // 每页条数
    layout: 'total, prev, pager, next'
  },
  pageJoin: {
    total: 0, // 总条数
    currentPage: 1, // 当前页
    current: handleCurrentJoin,
    pageSize: 12, // 每页条数
    layout: 'total, prev, pager, next'
  },
  addDialog: {
    value: false
  },
  tableHead: [
    {
      prop: 'name',
      label: '商店名称'
    },
    {
      prop: 'code',
      label: '商店编码'
    },
    {
      type: 'slot',
      prop: 'isPublic',
      name: 'isPublic',
      label: '是否公开'
    },
    {
      type: 'slot',
      prop: 'tag',
      name: 'tag',
      label: '应用权属'
    },
    {
      prop: 'remark',
      label: '商店简介'
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
      width: '200',
      name: 'operate'
    }
  ]
})

  const createDialog = ref(false)

  onMounted(() => {
    getMarketInfo()
    getMyMarketData()
    //getJoinMarketData()
    getShopcarNum()
  })

const handleCurrentChange = (val: number) => {
  getMyMarketData()
  console.log(val)
}
const handleUpdate = (val: any) => {
  state.pageMy.currentPage = val

  getMyMarketData()
}
// const handleCurrentJoinChange = (val: number) => {
//   state.pageJoin.currentPage = val
//   getJoinMarketData()
// }
const GoPage = (path: string) => {
  router.push(path)
}
type arrList = {
  id: string
}
const hadleUserManage = (item: { id: number }) => {
  router.push({ path: '/market/userManage', query: { data: item.id } })
}

const gotoApp = (item: { id: string }) => {
  router.push({ path: '/market/appList', query: { data: item.id } })
}
const searchList = () => {
  state.pageMy.currentPage = 1
  getMyMarketData()
}
const checksSearch = (val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    })
    submit(arr)
  } else {
    searchDialog.value = false
  }
}

  const getShopcarNum = async () => {
    await $services.market
      .searchStaging({
        data: {
          id: 0, //商店id （需删除）
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

const getMyMarketData = () => {
  $services.market
    .searchOwn({
      data: {
        offset: state.pageMy.current,
        limit: state.pageMy.pageSize,
        filter: searchText.value
      }
    })
    .then((res: ResultType) => {
      if (res.success) {
        const { result = [], total = 0 } = res.data
        state.myMarket = []
        result?.forEach((item: { id: string }) => {
          if (item.id === software.value) {
            state.myMarket.unshift(item)
          } else {
            state.myMarket.push(item)
          }
        })

        state.pageMy.total = total
        pageContent.value.state.page.total = total
      }
    })
}
// const getJoinMarketData = () => {
//   $services.appstore
//     .searchJoined({
//       data: {
//         offset: state.pageJoin.current,
//         limit: state.pageJoin.pageSize,
//         filter: ''
//       }
//     })
//     .then((res: ResultType) => {
//       if (res.code == 200) {
//         state.joinMarket = res.data.result ? res.data.result : []
//         state.pageJoin.total = res.data.total
//       }
//     })
// }
const marketQuit = (item: any) => {
  ElMessageBox.confirm(`确认退出  ${item.name}?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      $services.appstore
        .marketQuit({
          data: {
            id: item.id
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            //getJoinMarketData()
            ElMessage({
              message: '退出成功',
              type: 'success'
            })
          }
        })
    })
    .catch(() => {})
}
const hadleClick = (item: any) => {
  ElMessageBox.confirm(`确认删除  ${item.name}?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      $services.appstore
        .marketDel({
          data: {
            id: item.id
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            getMyMarketData()
            ElMessage({
              message: '删除成功',
              type: 'success'
            })
          }
        })
    })
    .catch(() => {})
}
const shopcarNum = ref(0)

const form = reactive({
  name: '',
  code: '',
  samrId: '',
  remark: '',
  authId: '',
  public: true
})
const options = [
  {
    value: true,
    label: '是'
  },
  {
    value: false,
    label: '否'
  }
]
//创建商店
const create = () => {
  $services.appstore
    .create({
      data: {
        name: form.name,
        code: form.code,
        samrId: store.queryInfo.id,
        authId:
          store.workspaceData.type === 2 ? store.workspaceData.authId : store.queryInfo.team.authId, // 空间为组织单位时取组织单位 的authId
        remark: form.remark,
        public: form.public
      }
    })
    .then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '创建成功',
          type: 'success'
        })
      }
      createDialog.value = false
      getMyMarketData()
    })
}
const remoteMethod = (query: string, callback: any) => {
  $services.appstore
    .searchAll({
      data: {
        offset: 0,
        limit: 100,
        filter: query
      }
    })
    .then((res: ResultType) => {
      console.log(res)

        if (res.data.result) {
          let states = res.data.result
          let arr: { value: any; label: any }[] = []
          states.forEach((el: any) => {
            let obj = {
              value: el.id,
              label: el.name
            }
            arr.push(obj)
          })
          callback(arr)
        }
      })
  }
  const submit = (data: any) => {
    $services.appstore
      .applyJoin({
        data: {
          id: data[0]
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '加入成功',
            type: 'success'
          })
          searchDialog.value = false
          //getJoinMarketData()
        }
      })
  }
  const closeDialog = (data: { value: boolean }) => {
    searchDialog.value = false
  }
   // 获取共享仓库信息
  const getMarketInfo = () => {
    $services.market.getSoftShareInfo().then((res: ResultType) => {
      if (res.code == 200) {
        state.softShareInfo = res?.data || {}
        software.value = state.softShareInfo.id
      }
    })
}
</script>

<style lang="scss" scoped>
.triangle-private {
  margin-right: 0px;
  margin-top: 0px;
  width: 40px;
  height: 40px;
  background-color: rgb(255, 0, 0, 0.5);
  clip-path: polygon(0 0, 100% 100%, 100% 0%);
  font-size: 18px;
  color: #fff;
  text-align: right;
}

.triangle-public {
  margin-right: 0px;
  margin-top: 0px;
  width: 40px;
  height: 40px;
  background-color: rgb(0, 238, 255, 0.5);
  clip-path: polygon(0 0, 100% 100%, 100% 0%);
  font-size: 18px;
  color: #fff;
  text-align: right;
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
    padding: 16px;
    // margin-top: 4px;
    height: calc(100vh - 108px);
    overflow-y: auto;
  }

  .box {
    .box-ul {
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

      .page-flex {
        position: absolute;
        right: 40px;
        bottom: 36px;
      }

      .app-card {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
