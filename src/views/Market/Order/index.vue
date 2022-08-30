<template>
  <div class="container">
    <MarketCard>
      <template #right>
        <el-button type="primary" @click="getTableList('buy')">已购入</el-button>
        <el-button type="primary" @click="getTableList('sell')">已卖出</el-button>
      </template>
    </MarketCard>

    <div class="tab-list">
      <el-table
        :data="state.orderList"
        stripe
        @select="handleSelect"
        ref="orderTableRef"
        v-if="searchType == 'buy'"
      >
        <el-table-column prop="code" label="订单号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column
          prop="status"
          label="状态"
          :formatter="(row, column) => renderDict(row, column, 'OrderStatus')"
        />
        <el-table-column prop="name" label="操作" width="600">
          <template #default="scope">
            <el-button
              v-show="scope.row.status == 1 && scope.row.ordertype == 'sell'"
              @click="sureContent(scope.row.id)"
              type="primary"
              >开始交易</el-button
            >
            <el-button
              v-show="scope.row.status == 100 && scope.row.ordertype == 'buy'"
              @click="showPay(scope.row)"
              type="primary"
              >支付</el-button
            >
            <el-button
              v-show="scope.row.status <= 100"
              @click="cancelOrder(scope.row.id)"
              type="primary"
              >取消订单</el-button
            >
            <el-button
              v-show="scope.row.status == 101 && scope.row.ordertype == 'sell'"
              @click="delivery(scope.row.id)"
              type="primary"
              >确认发货</el-button
            >
            <el-button
              v-show="scope.row.status == 102 && scope.row.ordertype == 'buy'"
              @click="accept(scope.row.id)"
              type="primary"
              >确认收货</el-button
            >
            <el-button
              v-show="scope.row.status == 103 && scope.row.ordertype == 'buy'"
              @click="comment(scope.row.id)"
              type="primary"
              >评价</el-button
            >
            <el-button
              v-show="scope.row.status == 104 && scope.row.ordertype == 'sell'"
              @click="viewComment(scope.row.id)"
              type="primary"
              >查看评价</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="state.orderList"
        stripe
        @select="handleSelect"
        ref="orderTableRef"
        v-if="searchType == 'sell'"
      >
        <el-table-column prop="code" label="订单号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column
          prop="status"
          label="状态"
          :formatter="(row, column) => renderDict(row, column, 'OrderStatus')"
        />
        <el-table-column prop="name" label="操作" width="600">
          <template #default="scope">
            <el-button
              v-show="scope.row.status == 1 && scope.row.ordertype == 'sell'"
              @click="sureContent(scope.row.id)"
              type="primary"
              >开始交易</el-button
            >
            <el-button
              v-show="scope.row.status == 100 && scope.row.ordertype == 'buy'"
              @click="showPay(scope.row)"
              type="primary"
              >支付</el-button
            >
            <el-button
              v-show="scope.row.status <= 100"
              @click="cancelOrder(scope.row.id)"
              type="primary"
              >取消订单</el-button
            >
            <el-button
              v-show="scope.row.status == 101 && scope.row.ordertype == 'sell'"
              @click="delivery(scope.row.id)"
              type="primary"
              >确认发货</el-button
            >
            <el-button
              v-show="scope.row.status == 102 && scope.row.ordertype == 'buy'"
              @click="accept(scope.row.id)"
              type="primary"
              >确认收货</el-button
            >
            <el-button
              v-show="scope.row.status == 103 && scope.row.ordertype == 'buy'"
              @click="comment(scope.row.id)"
              type="primary"
              >评价</el-button
            >
            <el-button
              v-show="scope.row.status == 104 && scope.row.ordertype == 'sell'"
              @click="viewComment(scope.row.id)"
              type="primary"
              >查看评价</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
import { ElTable } from 'element-plus'
import moment from 'moment'
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
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const orderTableRef = ref<InstanceType<typeof ElTable>>()
//点击行触发，选中或不选中复选框
const handleRowClick = (row: any) => {
  orderTableRef.value!.toggleRowSelection(row, undefined)
}
// 会话列表搜索关键字
const searchValue = ref<string>('')

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
      pageStore.total = result.length
      result.forEach((item: any) => {
        item.ordertype = 'sell'
        return item
      })
      state.orderList = result?.map((item: { market: { remark: any; code: any; name: any } }) => {
        return {
          ...item
          // remark: item.market.remark,
          // marketCode: item.market.code,
          // marketName: item.market.name
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
      pageStore.total = result.length
      result.forEach((item: any) => {
        item.ordertype = 'sell'
        return item
      })
      state.orderList = result?.map(
        (item: {
          merchandise: { caption: any; days: any; sellAuth: any; price: any; information: any }
          order: { code: any; name: any; status: any }
        }) => {
          return {
            ...item,
            code: item.order.code,
            name: item.merchandise.caption
            // remark: item.market.remark,
            // marketCode: item.market.code,
            // marketName: item.market.name
          }
        }
      )
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
      pageStore.total = result.length
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
const sureContent = async (id: string) => {
  await $services.order
    .orderConfirm({
      data: {
        id: id,
        status: 100
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        getTableList(searchType.value)
        ElMessage({
          message: '确认开始交易',
          type: 'warning'
        })
      }
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

// const pay = async (id: string, price: number, paymentType: string) => {
//   await $services.order
//     .createPay({
//       data: {
//         orderId: parseInt(id),
//         price: price,
//         paymentType: paymentType
//       }
//     })
//     .then((res: ResultType) => {res.code == 200
//       if (res.code == 200) {
//         getTableList(searchType.value)
//         ElMessage({
//           message: '支付成功',
//           type: 'warning'
//         })
//       } else {
//         ElMessage({
//           message: res.msg,
//           type: 'warning'
//         })
//       }
//     })
// }
//取消订单
const cancelOrder = async (id: string) => {
  await $services.order
    .delete({
      data: {
        id: id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        getTableList(searchType.value)
        ElMessage({
          message: '取消订单成功',
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
      if (res.code == 200) {
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
      if (res.code == 200) {
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
        if (res.code == 200) {
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
    bottom: 20px;
    position: fixed;
    right: 20px;
  }

  .group-side-bar-search {
    // padding: 10px;
    float: right;
    width: 300px;
    margin-right: 20px;
    margin-left: 20px;
    position: relative;
  }
}
</style>
