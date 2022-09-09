<template>
  <MarketCard>
    <template #right>
      <el-button small link type="primary" @click="GoPage('/market/appShelvesApproval')"
        >应用上架审批</el-button
      >
      <el-button small link type="primary" @click.stop="GoPage('/market/order')"
        >我的订单</el-button
      >
      <el-badge :value="shopcarNum" style="padding-left: 10px">
        <el-button small link type="primary" @click.stop="GoPage('/market/shopCar')"
          >购物车</el-button
        >
      </el-badge>
    </template>
  </MarketCard>
  <div class="appListLayout">
    <div class="appListLayout-container">
      <div class="appListLayout-header">
        <p>应用列表</p>
      </div>
      <div class="appListLayout-content">
        <AppCard
          v-if="switchValue"
          ref="appCard"
          :dataList="state.myAppList"
          :type="route.query.type"
          @handleUpdate="handleCardUpdate"
          @shopcarNumChange="getShopcarNum"
        ></AppCard>
        <DiyTable
          v-else
          ref="diyTable"
          :hasTitle="true"
          :tableData="state.myAppList"
          :tableHead="state.tableHead"
          @handleUpdate="handleUpdate"
        >
          <template #operate="scope">
            <TheTableButton :data="scope.row" @update="getData"></TheTableButton>
          </template>
        </DiyTable>
      </div>
      <div class="appListLayout-radio" v-if="state.myAppList.length > 0">
        <p style="margin-right: 20px">切换视图</p>
        <el-switch v-model="switchValue" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, ref, watch, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import $services from '@/services'
  import AppCard from './components/appCard.vue'
  import DiyTable from '@/components/diyTable/index.vue'
  import TheTableButton from './components/theTableButton2.vue'
  import MarketCard from '@/components/marketCard/index.vue'
  const router = useRouter()
  const route = useRoute()
  const diyTable = ref(null)
  const switchValue = ref(true)
  const appCard = ref(null)
  const shopcarNum = ref(0)
  const state = reactive({
    myAppList: [],
    tableHead: [
      {
        prop: 'caption',
        label: '应用名称'
      },
      {
        prop: 'sellAuth',
        label: '应用权限'
      },
      {
        prop: 'price',
        label: '价格'
      },
      {
        prop: 'days',
        label: '使用期限'
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

  watch(switchValue, (val) => {
    nextTick(() => {
      if (val) {
        appCard.value.state.page.currentPage = 1
        getData()
      } else {
        diyTable.value.state.page.currentPage = 1
        getTableData()
      }
    })
  })

  onMounted(() => {
    getData()
    getShopcarNum()
  })

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

  // 卡片切换页数
  const handleCardUpdate = () => {
    getData()
  }
  // 表格切换页数
  const handleUpdate = (page: any) => {
    getTableData()
  }

  const getTableData = () => {
    $services.appstore
      .merchandise({
        data: {
          id: route.query.data,
          offset: diyTable.value.state.page.current,
          limit: diyTable.value.state.page.pageSize,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log(res)
        if (res.code == 200) {
          state.myAppList = res.data.result || []
          diyTable.value.state.page.total = res.data.total || 0
        }
      })
  }

  const getData = () => {
    $services.appstore
      .merchandise({
        data: {
          id: route.query.data,
          offset: appCard.value.state.page.current,
          limit: 12,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.myAppList = res.data.result || []
          appCard.value.state.page.total = res.data.total || 0
        }
      })
  }
  const GoPage = (path: string) => {
    router.push({ path: path, query: { marketId: route.query.data } })
  }
</script>

<style lang="scss" scoped>
  .appListLayout {
    width: 100%;
    height: calc(100vh - 60px);
    padding: 16px;
    &-radio {
      display: flex;
      align-items: center;
      position: absolute;
      left: 16px;
      bottom: 0px;
    }
    &-container {
      position: relative;
      width: 100%;
      height: calc(100% - 60px);
      background-color: var(--el-bg-color-overlay);
      overflow: auto;
      display: flex;
      flex-direction: column;
    }
    &-content {
      width: 100%;
      flex: 1;
      padding: 0 24px;
    }
    &-header {
      padding: 16px 24px 16px 24px;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      p {
        font-weight: 600;
        // color: rgba(0, 0, 0, 0.85);
      }
    }
  }
</style>
