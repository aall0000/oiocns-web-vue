<template>
  <div class="container">
    <el-button-group style="padding: 10px">
      <!-- <el-button type="primary" @click="getTableList('all')">全部</el-button> -->
      <el-button type="primary" @click="getTableList('buy')">已购入</el-button>
      <el-button type="primary" @click="getTableList('sell')">已卖出</el-button>
      <el-button type="primary" @click="getTableList('pre-sell')">待审批</el-button>
    </el-button-group>

    <div class="group-side-bar-search">
      <el-input placeholder="搜索" v-model="searchValue" prefix-icon="Search" />
    </div>
    <div class="tab-list">
          <div>
    <div style="margin-bottom: 15px">fill: <el-switch v-model="fill" /></div>
    <el-space :fill="fill" wrap>
      <el-card v-for="i in 3" :key="i" class="box-card">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
            <el-button class="button" text>Operation button</el-button>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">
          {{ 'List item ' + o }}
        </div>
      </el-card>
    </el-space>
      <el-button-group>
    <el-button style="color: aliceblue;font-weight:bold;background-color:orange" round>加入购物车</el-button>
    <el-button style="color: aliceblue;font-weight:bold;background-color:red" round>立即购买</el-button>
  </el-button-group>
  </div>
        <payView v-if="payDialog.show" :order="payDialog.data" @close="closePay"></payView>
      <el-pagination
        class="page-pagination"
        @size-change="(e) => handlePaginationChange(e, 'limit')"
        @current-change="(e) => handlePaginationChange(e, 'current')"
        small
        background
        :page-sizes="pageSizes"
        v-model:currentPage="pagination.current"
        v-model:page-size="pagination.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageStore.total"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGE_SIZES, PAGE_NUM } from '@/constant'
import renderDict from '@/services/dict'
import payView from '@/components/pay/pay.vue'

// 表格分页数据
const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})
const searchType = ref<string>('buy')
const pageSizes = ref<Array<any>>(PAGE_SIZES)
const payDialog = reactive({ show: false, data: {} })
const remoteOperate = ref<boolean>(false)
const expandColumnKey = 'details'
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
// 会话列表搜索关键字
const searchValue = ref<string>('')
const expandedRowKeys = ref<string[]>([])
const fill = ref(true)
onMounted(() => {
  getTableList('buy')
})
const options = ref<ListItem[]>([])
const value = ref('')
const loading = ref(false)
const state = reactive({ qunList: [], orderList: [] })
//查询
const getTableList = async (type: string) => {
  searchType.value = type
  switch (type) {
    case 'all':
      searchAllOrderList()
      break
    case 'buy':
      searchBuyList()
      break
    case 'sell':
      searchSellList()
      break
    case 'pre-sell':
      searchPreSellList()
      break
  }
}
//查询所有订单
const searchAllOrderList = async () => {}

//查询出售 待审批/确认交易内容的订单
const searchPreSellList = async () => {
  await $services.order
    .searchSellList({
      data: {
        offset: (pagination.current - 1) * pagination.limit,
        limit: pagination.limit,
        status: 1,
        filter: ''
      }
    })
    .then((res: ResultType) => {
      const { result = [], total = 0 } = res.data
      pageStore.total = total
      result.forEach((item: any) => {
        item.ordertype = 'sell'
        return item
      })
      state.orderList = result?.map((item: { market: { remark: any; code: any; name: any } }) => {
        return {
          ...item,
          remark: item.market.remark,
          marketCode: item.market.code,
          marketName: item.market.name
        }
      })
    })
}
//查询已出售订单
const searchSellList = async () => {
  await $services.order
    .searchSellList({
      data: {
        offset: (pagination.current - 1) * pagination.limit,
        limit: pagination.limit,
        status: 0, //后续改成-1
        filter: ''
      }
    })
    .then((res: ResultType) => {
      var { result = [], total = 0 } = res.data
      pageStore.total = total
      result.forEach((item: any) => {
        item.ordertype = 'sell'
        return item
      })
      state.orderList = result?.map((item: { market: { remark: any; code: any; name: any } }) => {
        return {
          ...item,
          remark: item.market.remark,
          marketCode: item.market.code,
          marketName: item.market.name,
          details: [
            { name: 'detail1', code: 'code1' },
            { name: 'detail12', code: 'code2' }
          ]
        }
      })
    })
}
//查询已购入订单
const searchBuyList = async () => {
  await $services.order
    .searchBuyList({
      data: {
        offset: (pagination.current - 1) * pagination.limit,
        limit: pagination.limit,
        status: 1, //后续改成-1
        filter: ''
      }
    })
    .then((res: ResultType) => {
      const { result = [], total = 0 } = res.data
      pageStore.total = total
      result.forEach((item: any) => {
        item.ordertype = 'buy'
        return item
      })
      state.orderList = result?.map((item: { market: { remark: any; code: any; name: any } }) => {
        return {
          ...item
        }
      })
    })
}
//确认开始交易
const sureContent = (id: string) => {
  ElMessage({
    message: '确认开始交易',
    type: 'success'
  })
}
//支付
const showPay = async (data: any) => {
  payDialog.data = data
  payDialog.show = true
}
//关闭支付
const closePay = async () => {
  payDialog.show = false
}

//取消
const cancelOrder = async (id: string) => {
  await $services.order
    .delete({
      data: {
        id: id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 100) {
        getTableList(searchType.value)
        ElMessage({
          message: '取消成功',
          type: 'warning'
        })
      }
    })
}
//确认发货
const delivery = async (id: string) => {
  await $services.order
    .deliverMerchandise({
      data: {
        id: id,
        status: 102
      }
    })
    .then((res: ResultType) => {
      if (res.code == 100) {
        getTableList(searchType.value)
        ElMessage({
          message: '确认发货成功',
          type: 'success'
        })
      }
    })
}
//确认收货
const accept = async (id: string) => {
  await $services.order
    .orderConfirm({
      data: {
        id: id,
        status: 103
      }
    })
    .then((res: ResultType) => {
      if (res.code == 100) {
        getTableList(searchType.value)
        ElMessage({
          message: '确认收货成功',
          type: 'success'
        })
      }
    })
}
//评论
const comment = (id: string) => {
  ElMessage({
    message: '评论成功',
    type: 'success'
  })
}
//查看评价
const viewComment = (id: string) => {
  ElMessage({
    message: '该功能暂未开放',
    type: 'warning'
  })
}
// 处理表格分页操作
const handlePaginationChange = (newVal: number, type: 'current' | 'limit') => {
  pagination[type] = newVal
  getTableList(searchType.value)
}

interface ListItem {
  value: string
  label: string
}

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    $services.order
      .searchPersons({
        data: {
          text: query,
          offset: 0,
          limit: 10
        }
      })
      .then((res: ResultType) => {
        if (res.code == 100) {
          let arr: { value: any; label: any }[] = []
          console.log(res.data.result != undefined, res.data.result)
          if (res.data.result != undefined) {
            let states = res.data.result
            states.forEach((el: any) => {
              let obj = {
                value: el.id,
                label: el.name
              }
              arr.push(obj)
            })
            options.value = arr
            loading.value = false
          } else {
            options.value = arr
            loading.value = false
          }
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  } else {
    options.value = []
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: #f0f2f5;
  padding: 15px;
  .operate-btns {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #fff;
    .edit {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .page-pagination {
    padding: 10px 0;
    display: flex;
    justify-content: end;
  }

  .group-side-bar-search {
    padding: 10px;
    float: right;
    width: 300px;
    margin-right: 20px;
    position: relative;
  }
}
</style>
