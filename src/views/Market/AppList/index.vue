<template>
  <div class="market-layout">
    <el-card shadow="always" class="market-head flex">
      <el-button type="primary" @click.stop="linkOrder()">我的订单</el-button>
      <el-button type="primary" @click.stop="linkShopCar()">购物车</el-button>
    </el-card>
    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的市场</p>
        <li class="app-card" v-if="state.myMarket.length !== 0">
          <MarketCreate :info="add" @click="dialogVisible = true" />
          <ShopCard
            v-for="item in state.myMarket"
            :info="item"
            :key="item.id"
            :overId="item.id"
            @click="gotoApp(item)"
          >
            <!-- <template> -->
            <el-button class="btn" type="primary" link small @click.stop="hadleClick(item)"
              >删除市场</el-button
            >
            <el-divider direction="vertical" />
            <el-button class="btn" link small @click.stop="hadleUserManage(item)"
              >用户管理</el-button
            >
            <!-- </template> -->
          </ShopCard>
        </li>
        <div v-else>暂无数据</div>
        <el-pagination
          v-if="state.myMarket?.length !== 0"
          @current-change="handleCurrentChange"
          v-bind="state.pageMy"
          :pager-count="5"
          style="text-align: right; margin-top: 10px; justify-content: end"
        />
      </ul>
      <ul class="box-ul">
        <p class="box-ul-title">我加入的市场</p>
        <li class="app-card" v-if="state.joinMarket?.length !== 0">
          <MarketCreate :info="add1" @click="dialogVisible = true" />
          <ShopCard
            v-for="item in state.joinMarket"
            :info="item"
            :key="item.id"
            :overId="item.id"
            @click="gotoApp(item)"
          >
            <!-- <template #footer> -->
            <el-button class="btn" type="primary" link small @click.stop="marketQuit(item)"
              >退出市场</el-button
            >
            <!-- <el-divider direction="vertical" />
              <el-button class="btn" link small>用户管理</el-button> -->
            <!-- </template> -->
          </ShopCard>
        </li>
        <div v-else> 暂无数据 </div>
        <el-pagination
          v-if="state.joinMarket.length !== 0"
          @current-change="handleCurrentJoinChange"
          v-bind="state.pageJoin"
          :pager-count="5"
          style="text-align: right; margin-top: 10px; justify-content: end"
        />
      </ul>
    </div>
    <el-dialog v-model="dialogVisible" title="提示" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="市场名称">
          <el-input v-model="form.name" style="width: 80%" />
        </el-form-item>
        <el-form-item label="市场编码">
          <el-input v-model="form.code" style="width: 80%" />
        </el-form-item>
        <el-form-item label="市场简介">
          <el-input v-model="form.remark" style="width: 80%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="create">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, computed, ref } from 'vue'
  import ShopCard from '../components/shopCard.vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import MarketCreate from '../components/marketCreate.vue'
  import { useUserStore } from '@/store/user'
  const router = useRouter()
  const store = useUserStore()
  const handleCurrentMy: any = computed(() => {
    return (state.pageMy.currentPage - 1) * state.pageMy.pageSize
  })
  const handleCurrentJoin: any = computed(() => {
    return (state.pageJoin.currentPage - 1) * state.pageJoin.pageSize
  })
  const add: string = '创建市场'
  const add1: string = '加入市场'
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
    }
  })

  onMounted(() => {
    getMyMarketData()
    getJoinMarketData()
  })

  const createMarket = () => {}
  const joinMarket = () => {}

  const handleCurrentChange = (val: number) => {
    state.pageMy.currentPage = val
    getMyMarketData()
    console.log(val)
  }
  const handleCurrentJoinChange = (val: number) => {
    state.pageJoin.currentPage = val
    getJoinMarketData()
  }

  const linkOrder = () => {
    router.push({ path: '/market/order' })
  }

  const linkShopCar = () => {
    router.push({ path: '/market/shopCar' })
  }

  const hadleUserManage = (item: { id: number }) => {
    router.push({ path: '/market/userManage', query: { data: item.id } })
  }

  const gotoApp = (item: { id: string }) => {
    router.push({ path: '/market/appList', query: { data: item.id } })
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
          state.myMarket = res.data.result
          state.pageMy.total = res.data.total
        }
      })
  }
  const getJoinMarketData = () => {
    $services.appstore
      .searchOwn({
        data: {
          offset: state.pageJoin.current,
          limit: state.pageJoin.pageSize,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.joinMarket = res.data.result
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
  const dialogVisible = ref(false)
  const form = reactive({
    name: '',
    code: '',
    samrId: '',
    remark: '',
    authId: '',
    public: true
  })
  //创建市场
  const create = () => {
    $services.appstore
      .create({
        data: {
          name: form.name,
          code: form.code,
          samrId: store.queryInfo.id,
          remark: form.remark,
          authId: store.queryInfo.team.authId,
          public: form.public
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
        }
      })
  }
</script>

<style lang="scss" scoped>
  :deep(.el-card__body) {
    padding: 0;
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
