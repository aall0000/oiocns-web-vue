<template>
  <div class="market-layout">
    <MarketCard>
      <template #right>
        <el-button link type="primary" @click="createDialog = true">创建商店</el-button>
        <el-button link type="primary" @click="state.addDialog.value = true">加入商店</el-button>
        <el-button
          link
          type="primary"
          @click="GoPage('/market/userApply')"
          style="margin-right: 10px"
          >我的加入申请</el-button
        >

        <el-radio-group v-model="showType" size="small" class="button">
          <el-radio-button label="list"
            ><el-icon :size="18"><Tickets /></el-icon
          ></el-radio-button>
          <el-radio-button label="card"
            ><el-icon :size="18"><Menu /></el-icon
          ></el-radio-button>
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
          <ShopCard
            v-if="state.myMarket.length !== 0"
            v-for="item in state.myMarket"
            :info="item"
            :key="item.id"
            :overId="item.id"
            type="market"
            @click="GoPageWithQuery('/market/appList', { data: item.id, type: 'manage' })"
          >
            <template #icon
              ><HeadImg
                :name="item.name"
                :url="item.icon || storeImg"
                :imgWidth="48"
                :limit="1"
                :isSquare="false"
            /></template>
            <template #rightIcon>
              <el-dropdown trigger="click" placement="left-start" v-if="item.id != '355346477339512833'">
                <el-icon :size="18"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu >
                    <el-dropdown-item @click.stop="hadleClick(item)"
                      ><el-button class="btn" type="primary" link small
                        >删除商店</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item @click.stop="hadleUserManage(item)"
                      ><el-button class="btn" link small >用户管理</el-button></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <!-- <template #rightTriangle
              ><div :class="item.public ? 'triangle-public' : 'triangle-'">{{
                item.public ? '公' : ''
              }}</div></template
            > -->
          </ShopCard>
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
                :type="scope.row.createUser == queryInfo.id ? '' : 'success'"
                >{{ scope.row.public == true ? '公开的' : '私有的' }}</el-tag
              >
          </template>
          <template #tag="scope">
            <el-tag
            v-if="scope.row.id != '355346477339512833'"
                style="margin-left: 10px"
                :type="scope.row.createUser == queryInfo.id ? '' : 'success'"
                >{{ scope.row.belongId == queryInfo.id ? '创建的' : '加入的' }}</el-tag
              >

          </template>
            <template #operate="scope">
              <el-button
              v-if="scope.row.id != '355346477339512833'"
                class="btn"
                type="primary"
                link
                small
                @click.stop="hadleUserManage(scope.row)"
                >用户管理</el-button
              >
              <el-button class="btn" type="primary" link small @click.stop="marketQuit(scope.row)" v-if="scope.row.id != '355346477339512833'"
                >删除商店</el-button
              >
            </template>
          </DiyTable>
        </li>
        <!-- <el-pagination
          v-if="state.myMarket?.length !== 0"
          @current-change="handleCurrentChange"
          v-bind="state.pageMy"
          :pager-count="5"
          style="text-align: right; margin-top: 10px; justify-content: end"
        /> -->
        <div class="page-flex" v-show="showType === 'card'">
          <Pagination ref="pageContent" @handleUpdate="handleUpdate"></Pagination>
        </div>
      </ul>
      <!-- <ul class="box-ul">
        <p class="box-ul-title">我加入的商店</p>

        <li class="app-card" v-show="showType === 'card'">
          <ShopCard
            v-if="state.joinMarket.length !== 0"
            v-for="item in state.joinMarket"
            :info="item"
            :key="item.id"
            :overId="item.id"
            type="market"
            @click="GoPageWithQuery('/market/appList', { data: item.id, type: 'shop' })"
          >
            <template #icon
              ><HeadImg
                :name="item.name"
                :url="item.icon || storeImg"
                :imgWidth="48"
                :limit="1"
                :isSquare="false"
            /></template>
            <template #rightIcon>
              <el-dropdown trigger="click" placement="left-start">
                <el-icon :size="18"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.stop="hadleClick(item)"
                      ><el-button
                        class="btn"
                        type="primary"
                        link
                        small
                        @click.stop="marketQuit(item)"
                        >退出商店</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item @click.stop="hadleUserManage(item)"
                      ><el-button class="btn" link small>用户管理</el-button></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>

          </ShopCard>
        </li>
        <li v-show="showType === 'list'">
          <DiyTable
            ref="diyTable"
            :hasTitle="true"
            :options="{ noPage: true, order: true }"
            :tableData="state.joinMarket"
            :tableHead="state.tableHead"
          >
            <template #operate="scope">
              <el-button class="btn" type="primary" link small @click.stop="marketQuit(scope.row)"
                >退出商店</el-button
              >
            </template>
          </DiyTable>
        </li>
        <el-pagination
          v-if="state.joinMarket.length !== 0"
          @current-change="handleCurrentJoinChange"
          v-bind="state.pageJoin"
          :pager-count="5"
          style="text-align: right; margin-top: 10px; justify-content: end"
        />
      </ul> -->
    </div>
    <el-dialog v-model="createDialog" title="创建商店" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="商店名称">
          <el-input v-model="form.name" style="width: 80%" />
        </el-form-item>
        <el-form-item label="商店编码">
          <el-input v-model="form.code" style="width: 80%" />
        </el-form-item>
        <el-form-item label="商店简介">
          <el-input v-model="form.remark" style="width: 80%" />
        </el-form-item>
        <el-form-item label="商店是否公开">
          <el-select v-model="form.public" style="width: 80%" placeholder="是否公开">
            <el-option v-for="item in options" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialog = false">取消</el-button>
          <el-button type="primary" @click="create">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <diySearch
      :dialogShow="state.addDialog"
      title="加入商店"
      placeholder="搜索商店"
      @submit="submit"
      @remoteMethod="remoteMethod"
      @closeDialog="closeDialog"
    ></diySearch>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, computed, ref } from 'vue'
  import diySearch from '@/components/diySearch/index.vue'
  import ShopCard from '../components/shopCard.vue'
  import ShopCardBadge from '../components/shopCardBadge.vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import MarketCreate from '../components/marketCreate.vue'
  import { useUserStore } from '@/store/user'
  import storeImg from '@/assets/img/app_icon.png'
  import Pagination from '@/components/pagination/index.vue'
  import { storeToRefs } from 'pinia'


  const router = useRouter()
  const store = useUserStore()
  const { queryInfo } = storeToRefs(store)
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
  const state = reactive({
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
        label: '商店名称',
      },
      {
        prop: 'code',
        label: '商店编码',
      },
      {
        type: 'slot',
        prop: 'isPublic',
        name: 'isPublic',
        label: '是否公开',
      },
      {
        type: 'slot',
        prop: 'tag',
        name: 'tag',
        label: '应用权属',
      },
      {
        prop: 'remark',
        label: '商店简介',

      },
      {
        prop: 'createTime',
        label: '创建时间',
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
          const {result = [],total = 0} = res.data
          state.myMarket = []
          result?.forEach((item: { id: string })=>{
            if(item.id === '355346477339512833'){
              state.myMarket.unshift(item)
            }
            else{
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
    if (store.workspaceData.type === 1) {
      $services.appstore
        .create({
          data: {
            name: form.name,
            code: form.code,
            samrId: store.queryInfo.id,
            authId: store.queryInfo.team.authId,
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
    if (store.workspaceData.type === 2) {
      $services.appstore
        .create({
          data: {
            name: form.name,
            code: form.code,
            samrId: store.queryInfo.id,
            remark: form.remark,
            authId: store.workspaceData.authId,
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
          id: data
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '加入成功',
            type: 'success'
          })
          state.addDialog.value = false
          //getJoinMarketData()
        }
      })
  }
  const closeDialog = (data: { value: boolean }) => {
    state.addDialog.value = false
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
