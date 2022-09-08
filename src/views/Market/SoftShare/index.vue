<template>
  <MarketCard>
    <template #right>
      <el-button type="primary" @click.stop="GoPage('/market/order')">我的订单</el-button>
      <el-badge :value="shopcarNum" style="padding-left: 10px">
        <el-button type="primary" @click.stop="GoPage('/market/shopCar')">购物车</el-button>
      </el-badge>
    </template>
  </MarketCard>
  <div class="getApp">
    <div class="getApp-container">
      <el-tabs class="marketTag" v-model="activeMarket" @tabChange="handleTabChange">
        <el-tab-pane v-for="item in marketTabs" :label="item.name" :name="item.id"></el-tab-pane>
      </el-tabs>
      <!-- <div class="getApp-header">
        <p>应用{{ isCard ? '图' : '列' }}表</p>
      </div> -->
      <div class="getApp-content">
        <AppCard
          v-if="isCard"
          ref="appCard"
          :dataList="state.myAppList"
          type="shop"
          @handleUpdate="handleCardUpdate"
        ></AppCard>
        <DiyTable
          v-else
          ref="diyTable"
          :hasTitle="true"
          :tableData="state.myAppList"
          :tableHead="tableHead"
          @handleUpdate="handleUpdate"
        >
          <template #operate="scope">
            <TheTableButton :data="scope.row" type="shop" @update="getData"></TheTableButton>
          </template>
        </DiyTable>
      </div>
      <div class="getApp-radio">
        <p style="margin-right: 20px">切换视图</p>
        <el-switch v-model="isCard" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, ref, watch, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'
  import AppCard from '../AppList/components/appCard.vue'
  import DiyTable from '@/components/diyTable/index.vue'
  import TheTableButton from '../AppList/components/theTableButton2.vue'
  import MarketCard from '@/components/marketCard/index.vue'
  const router = useRouter()
  const diyTable = ref(null)
  const isCard = ref(true)
  const appCard = ref(null)
  const shopcarNum = ref(0)
  const softShareInfo = ref<MarketType>({} as MarketType)
  const state = reactive({
    myAppList: []
  })
  // 表格展示信息
  const tableHead = [
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
      label: '单价/天'
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

  onMounted(() => {
    getMarketInfo()
    // getShopcarNum()
  })

  // const getShopcarNum = async () => {
  //   await $services.market
  //     .searchStaging({
  //       data: {
  //         id: 0, //市场id （需删除）
  //         offset: 0,
  //         limit: 20,
  //         filter: ''
  //       }
  //     })
  //     .then((res: ResultType) => {
  //       var { result = [], total = 0 } = res.data
  //       shopcarNum.value = total
  //     })
  // }

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
          id: activeMarket.value,
          offset: diyTable.value.state.page.current,
          limit: diyTable.value.state.page.pageSize,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log('getTableData',res)
        if (res.code == 200) {
          state.myAppList = res.data.result || []
          diyTable.value.state.page.total = res.data.total || 0
        }
      })
  }
  // 获取应用列表
  const getData = () => {
    $services.appstore
      .merchandise({
        data: {
          id: softShareInfo.value.id,
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
  // 页面顶部 tab页列表
  const marketTabs = ref([])
  const activeMarket = ref<string>('')

  const handleTabChange = (name: string) => {
    console.log('切换', name)
  }
  // 获取已加入市场列表
  const getMarketInfo = () => {
    $services.market.getSoftShareInfo().then((res: ResultType) => {
      if (res.code == 200) {
        console.log('共享仓库', res.data)
        softShareInfo.value = res?.data || {}
        getData()
        // const { result = [] } = res.data
        // marketTabs.value = result
        // activeMarket.value = result.length > 0 ? result[0].id : ''
      }
    })
  }
  const GoPage = (path: string) => {
    router.push(path)
  }
  watch([isCard, activeMarket], ([val, activeMVal], [valOld, activeMValOld]) => {
    // 监听 展示方式变化
    nextTick(() => {
      if (val) {
        appCard.value.state.page.currentPage = 1
        getData()
      } else {
        diyTable.value.state.page.currentPage = 1
        getTableData()
      }
    })
    // 监听所选市场变化
    // if (activeMVal!==activeMValOld) {
    //   getData()
    // }
  })
</script>
<style lang="scss">
  .getApp-container {
    .marketTag {
      .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
        padding-left: 20px;
      }
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        padding: 0 5px;
      }
      .el-tabs__nav {
        padding: 0 4px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .getApp {
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
      background-color: #fff;
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
      padding: 0 24px 16px 24px;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      p {
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
</style>
