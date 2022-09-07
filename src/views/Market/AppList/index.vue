<template>
  <div class="market-layout">
    <MarketCard>
      <template #right>
        <el-radio-group v-model="mode" size="small" class="button">
          <el-radio-button label="list"
            ><el-icon :size="18"><Tickets /></el-icon
          ></el-radio-button>
          <el-radio-button label="card"
            ><el-icon :size="18"><Menu /></el-icon
          ></el-radio-button>
        </el-radio-group>
        <!-- <el-button type="primary" @click="GoPage('/market/managerApproval')">申请审批</el-button>
        <el-button type="primary" @click.stop="GoPage('/market/order')">我的订单</el-button>
        <el-badge :value="shopcarNum" style="padding-left:10px">
          <el-button type="primary" @click.stop="GoPage('/market/shopCar')">购物车</el-button>
        </el-badge> -->
      </template>
    </MarketCard>

    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的商店</p>

        <li class="app-card" v-show="mode === 'card'">
          <MarketCreate :info="add" @click="dialogVisible1 = true" />

          <ShopCard
            v-if="state.myMarket.length !== 0"
            v-for="item in state.myMarket"
            :info="item"
            :key="item.id"
            :overId="item.id"
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
              <el-dropdown trigger="click" placement="left-start">
                <el-icon :size="18"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.stop="hadleClick(item)"
                      ><el-button class="btn" type="primary" link small
                        >删除商店</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item @click.stop="hadleUserManage(item)"
                      ><el-button class="btn" link small>用户管理</el-button></el-dropdown-item
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
        <li v-show="mode === 'list'">
          <DiyTable
            ref="diyTable"
            :options="{ noPage: true, order: true }"
            :hasTitle="true"
            :tableData="state.myMarket"
            :tableHead="state.tableHead"
          >
            <template #operate="scope">
              <el-button
                class="btn"
                type="primary"
                link
                small
                @click.stop="hadleUserManage(scope.row)"
                >用户管理</el-button
              >
              <el-button class="btn" type="primary" link small @click.stop="marketQuit(scope.row)"
                >退出商店</el-button
              >
            </template>
          </DiyTable>
        </li>
        <el-pagination
          v-if="state.myMarket?.length !== 0"
          @current-change="handleCurrentChange"
          v-bind="state.pageMy"
          :pager-count="5"
          style="text-align: right; margin-top: 10px; justify-content: end"
        />
      </ul>
      <ul class="box-ul">
        <p class="box-ul-title">我加入的商店</p>

        <li class="app-card" v-show="mode === 'card'">
          <MarketCreate :info="add1" @click="state.dialogShow.value = true" />
          <ShopCard
            v-if="state.joinMarket.length !== 0"
            v-for="item in state.joinMarket"
            :info="item"
            :key="item.id"
            :overId="item.id"
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
            <!-- <template #rightTriangle
              ><div :class="item.public ? 'triangle-public' : 'triangle-'">{{
                item.public ? '公' : ''
              }}</div></template
            > -->
          </ShopCard>
        </li>
        <li v-show="mode === 'list'">
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
      </ul>
    </div>
    <el-dialog v-model="dialogVisible1" title="创建商店" width="30%">
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
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="create">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <diySearch
      :dialogShow="state.dialogShow"
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
  import storeImg from '@/assets/img/store.png'
  const router = useRouter()
  const store = useUserStore()
  const handleCurrentMy: any = computed(() => {
    return (state.pageMy.currentPage - 1) * state.pageMy.pageSize
  })
  const handleCurrentJoin: any = computed(() => {
    return (state.pageJoin.currentPage - 1) * state.pageJoin.pageSize
  })
  const GoPageWithQuery = (path: string, query: any) => {
    router.push({ path, query })
  }
  const mode = ref('card')
  const add: string = '创建商店'
  const add1: string = '加入商店'
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
    dialogShow: {
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
        prop: 'public',
        label: '是否公开'
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

  const dialogVisible1 = ref(false)

  onMounted(() => {
    getMyMarketData()
    getJoinMarketData()
    getShopcarNum()
  })

  const handleCurrentChange = (val: number) => {
    state.pageMy.currentPage = val
    getMyMarketData()
    console.log(val)
  }
  const handleCurrentJoinChange = (val: number) => {
    state.pageJoin.currentPage = val
    getJoinMarketData()
  }
  const GoPage = (path: string) => {
    router.push(path)
  }

  const hadleUserManage = (item: { id: number }) => {
    router.push({ path: '/market/userManage', query: { data: item.id } })
  }

  const gotoApp = (item: { id: string }) => {
    router.push({ path: '/market/appList', query: { data: item.id } })
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
    $services.appstore
      .searchManager({
        data: {
          offset: state.pageMy.current,
          limit: state.pageMy.pageSize,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.myMarket = res.data.result ? res.data.result : []
          state.pageMy.total = res.data.total
        }
      })
  }
  const getJoinMarketData = () => {
    $services.appstore
      .searchJoined({
        data: {
          offset: state.pageJoin.current,
          limit: state.pageJoin.pageSize,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.joinMarket = res.data.result ? res.data.result : []
          state.pageJoin.total = res.data.total
        }
      })
  }
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
              getJoinMarketData()
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
          dialogVisible1.value = false
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
          dialogVisible1.value = false
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
          state.dialogShow.value = false
          getJoinMarketData()
        }
      })
  }
  const closeDialog = (data: { value: boolean }) => {
    state.dialogShow.value = false
  }
</script>

<style lang="scss" scoped>
  :deep(.el-card__body) {
    padding: 0;
  }

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
      height: calc(100vh - 70px);
      overflow-y: auto;
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
          padding-bottom: 10px;
        }
        .app-card {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
