<template>
  <div class="market-layout">
    <el-card shadow="always" class="market-head flex">
      <el-button type="primary">购物车</el-button>
    </el-card>
    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的市场</p>
        <li class="app-card" v-if="state.myMarket.length !== 0">
          <ShopCard
            v-for="item in state.myMarket"
            :info="item"
            :key="item.id"
            @click="gotoApp(item)"
          >
            <template #footer>
              <el-button class="btn" type="primary" link small @click="hadleClick(item)"
                >退出市场</el-button
              >
              <el-divider direction="vertical" />
              <el-button class="btn" link small>用户管理</el-button>
            </template>
          </ShopCard>
        </li>
        <div v-else>暂无数据</div>
        <el-pagination
          v-if="state.myMarket.length !== 0"
          @current-change="handleCurrentChange"
          v-bind="state.pageMy"
          :pager-count="5"
          style="text-align: right; margin-top: 10px; justify-content: end"
        />
      </ul>
      <ul class="box-ul">
        <p class="box-ul-title">我加入的市场</p>
        <li class="app-card" v-if="state.joinMarket.length !== 0">
          <ShopCard v-for="item in state.joinMarket" :info="item" :key="item.id">
            <template #footer>
              <el-button class="btn" type="primary" link small>退出市场</el-button>
              <el-divider direction="vertical" />
              <el-button class="btn" link small>用户管理</el-button>
            </template>
          </ShopCard>
        </li>
        <div v-else> 暂无数据 </div>
        <el-pagination
          v-if="state.joinMarket.length !== 0"
          @current-change="handleCurrentChange"
          v-bind="state.pageJoin"
          :pager-count="5"
          style="text-align: right; margin-top: 10px; justify-content: end"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue'
  import ShopCard from '../components/shopCard.vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'

  const router = useRouter()

  const state = reactive({
    myMarket: [],
    joinMarket: [],
    pageMy: {
      total: 0, // 总条数
      currentPage: 0, // 当前页
      pageSize: 20, // 每页条数
      pageSizes: [20, 30, 50], // 分页数量列表
      layout: 'total, prev, pager, next'
    },
    pageJoin: {
      total: 0, // 总条数
      currentPage: 0, // 当前页
      pageSize: 20, // 每页条数
      pageSizes: [20, 30, 50], // 分页数量列表
      layout: 'total, prev, pager, next'
    }
  })

  onMounted(() => {
    getMyMarketData()
    getJoinMarketData()
  })

  const handleSizeChange = () => {}
  const handleCurrentChange = () => {}

  const gotoApp = (item: { id: string }) => {
    router.push({ path: '/market/appList', query: { data: item.id } })
  }

  const getMyMarketData = () => {
    $services.appstore
      .searchManager({
        data: {
          offset: state.pageMy.currentPage,
          limit: 10,
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
          offset: state.pageJoin.currentPage,
          limit: 10,
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

  const hadleClick = (item: any) => {
    console.log('村上春树', item.name)
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
