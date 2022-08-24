<template>
  <div class="market-layout">
    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的市场</p>
        <li class="app-card" v-if="state.myAppList.length !== 0">
          <ShopCard v-for="item in state.myAppList" :info="item" :key="item.id">
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
        <div class="pagination">
          <el-pagination
            v-if="state.myAppList.length !== 0"
            @current-change="handleCurrentChange"
            v-bind="state.pageMy"
            :pager-count="5"
            style="text-align: right; margin-top: 10px; justify-content: end"
          />
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue'
  import ShopCard from '../components/shopCard.vue'
  import { useRoute } from 'vue-router'
  import $services from '@/services'

  const route = useRoute()

  const state = reactive({
    myAppList: [],
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
    getData()
  })

  const handleSizeChange = () => {}
  const handleCurrentChange = () => {}

  const getData = () => {
    $services.appstore
      .searchManager({
        data: {
          id: route.query.data,
          offset: state.pageMy.currentPage,
          limit: 10,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.myAppList = res.data.result
          state.pageMy.total = res.data.total
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
  .pagination {
    position: absolute;
    bottom: 0;
    right: 10px;
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
      height: calc(100vh - 60px);
      overflow-y: auto;
    }
    .box {
      .box-ul + .box-ul {
        margin-top: 10px;
      }
      &-ul {
        position: relative;
        background-color: #fff;
        padding: 10px 24px;
        height: 100%;
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
