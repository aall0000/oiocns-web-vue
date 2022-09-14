<template>
  <MarketCard>
    <template #right>
        <el-select v-model="statusvalue" filterable placeholder="订单状态" clearable size="small" @change="getTableList(searchType)" style="margin:5px 5px 5px 15px;">
          <el-option
            v-for="item in statusoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
    </template>
  </MarketCard>
  <div class="container">
    <div class="limit_table_height">
      <DiyTable
        v-if="route.fullPath.includes('buy')"
        ref="diyTable"
        :hasTitle="true"
        :tableData="state.orderList"
        :tableHead="state.tableHeadBuy"
        :options="{ noPage: true }"
        @handleUpdate="handleUpdate"
        @select="handleSelect"
      >
      <template #expand="props">
        <div style="margin-left: 50px">
          <DiyTable
        ref="diyTableDetail"
        :tableData="props.row.details"
        :tableHead="state.tableHeadSellDetail"
        :options="{ noPage: true }"
      >

          <template #paylist="scope">
            <el-link type="primary" @click="showPayList(scope.row)">点击查看</el-link>
          </template>

          <template #merchandiseStatus="scope">
            <el-tag v-show="scope.row.merchandise" >在售</el-tag>
            <el-tag class="ml-2" type="danger"  v-show="!scope.row.merchandise">已下架</el-tag>
          </template>

          <template #operate="scope">
            <DiyButton >
                <template v-slot:opt>
                  <div class="diy-button" v-show="scope.row.status < 102" @click="cancelOrderDetail(scope.row.id, 220, null)">
                    取消订单
                  </div> 
                  <div class="diy-button" v-show="scope.row.status == 102" @click="reject(scope.row.id)">
                    退货退款
                  </div> 
                </template>
            </DiyButton>
          </template>
      </DiyTable>
        </div>
      </template>
    </DiyTable>

      <DiyTable
        v-else
        ref="diyTable"
        :hasTitle="true"
        :tableData="state.orderList"
        :tableHead="state.tableHeadSell"
        :options="{ noPage: true }"
        @handleUpdate="handleUpdate"
        @select="handleSelect"
      >

          <template #paylist="scope">
            <el-link type="primary" @click="showPayList(scope.row)">点击查看</el-link>
          </template>

          <template #merchandiseStatus="scope">
            <el-tag v-show="scope.row.merchandise" >在售</el-tag>
            <el-tag class="ml-2" type="danger"  v-show="!scope.row.merchandise">已下架</el-tag>
          </template>

          <template #operate="scope">
            <DiyButton>
              <template v-slot:opt>
                <div class="diy-button" v-show="scope.row.status < 102" @click="cancelOrderDetail(scope.row.id, 221, null)"> 取消订单 </div>
                <div
                  class="diy-button"
                  v-show="scope.row.status < 102 && scope.row.merchandise"
                  @click="delivery(scope.row.id)"
                >
                  确认交付
                </div>
              </template>
            </DiyButton>
          </template>
      </DiyTable>
      <payView v-if="payDialog.show" :order="payDialog.data" @close="closePay"></payView>
      <payList v-if="payListDialog.show" :selectLimit="0" @closeDialog="closePayList" />
    </div>
    <el-pagination
      class="page-pagination"
      @size-change="(e) => handlePaginationChange(e, 'limit')"
      @current-change="(e) => handlePaginationChange(e, 'current')"
      
      background
      :page-sizes="pageSizes"
      v-model:currentPage="pagination.current"
      v-model:page-size="pagination.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageStore.total"
    />
  </div>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PAGE_SIZES, PAGE_NUM } from '@/constant'
import renderDict from '@/services/dict'
import payView from '@/components/pay/pay.vue'
import payList from '@/components/pay/list.vue'
import DiyButton from '@/components/diyButton/index.vue'
import { ElTable } from 'element-plus'
import orgChat from '@/hubs/orgchat'
import moment from 'moment'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
  const route = useRoute()
// 表格分页数据
const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})
const searchType = ref<string>('buy')
const isBuy =  ref<boolean>(true)
const pageSizes = ref<Array<any>>(PAGE_SIZES)
const payDialog = reactive({ show: false, data: {} })
const payListDialog = reactive({ show: false, data: {} })
const remoteOperate = ref<boolean>(false)
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const orderTableRef = ref<InstanceType<typeof ElTable>>()
//点击行触发，选中或不选中复选框
const handleRowClick = (row: any) => {
  orderTableRef.value!.toggleRowSelection(row, undefined)
}
const statusvalue = ref('')
const statusoptions = [
        {label: '待卖方确认', value: 1},
        //包含第三方监管和卖方的审核状态
        {label: '已发货', value: 102},
        //后续可能有物流状态接入
        {label: '买方取消订单', value: 220},
        {label: '卖方取消订单', value: 221},
        {label: '已退货', value: 222}
]
// 会话列表搜索关键字
const searchValue = ref<string>('')

  onMounted(() => {
    if(route.fullPath.includes('buy')){
      getTableList('buy')
    }else{
      getTableList('sell')
    }
    
  })

  const options = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)
  const handleUpdate = (page: any) => {
    getTableList(searchType.value)
  }
  const state = reactive({ qunList: [], orderList: [], tableHeadBuy:[
      {
        type:'expand',
        name:'expand',
      },
      {
        prop: 'code',
        label: '订单号'
      },
      {
        prop: 'name',
        label: '名称'
      },
      {
        prop: 'createTime',
        label: '创建时间'
      },

  ],tableHeadSellDetail:[

      {
        prop: 'caption',
        label: '名称'
      },
      {
        prop: 'sellAuth',
        label: '售卖权属'
      },
      {
        prop: 'days',
        label: '使用期限'
      },
      {
        prop: 'price',
        label: '价格'
      },
      {
        prop:'sellerId',
        label:"卖方名称",
        formatter: (row:any, column:any) => orgChat.getName(row.sellerId)
      },
      {
        prop: 'status',
        label: '状态',
        formatter: (row:any, column:any) => renderDict(row, column, 'OrderStatus')
      },
      {
        prop: 'createTime',
        label: '创建时间'
      },
      {
        type: 'slot',
        label: '支付记录',
        fixed: 'right',
        align: 'center',
        width: '150',
        name: 'paylist'
      },
      {
        type: 'slot',
        label: '商品状态',
        fixed: 'right',
        align: 'center',
        width: '150',
        name: 'merchandiseStatus'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '120',
        name: 'operate'
      }
  ],tableHeadSell: [
      {
        prop: 'code',
        label: '订单号'
      },
      {
        prop: 'caption',
        label: '名称'
      },
      {
        prop: 'belongId',
        label: '买方名称',
        formatter: (row:any, column:any) => orgChat.getName(row.belongId)
      },
      {
        prop: 'sellAuth',
        label: '售卖权属'
      },
      {
        prop: 'days',
        label: '使用期限'
      },
      {
        prop: 'price',
        label: '价格'
      },
      {
        prop: 'status',
        label: '状态',
        formatter: (row:any, column:any) => renderDict(row, column, 'OrderStatus')
      },
      {
        prop: 'createTime',
        label: '创建时间'
      },
      {
        type: 'slot',
        label: '支付记录',
        fixed: 'right',
        align: 'center',
        width: '150',
        name: 'paylist'
      },
      {
        type: 'slot',
        label: '商品状态',
        fixed: 'right',
        align: 'center',
        width: '150',
        name: 'merchandiseStatus'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '120',
        name: 'operate'
      }
    ] })
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
    state.orderList = [];
    await $services.order
      .searchSellList({
        data: {
          offset: (pagination.current - 1) * pagination.limit,
          limit: pagination.limit,
          status: statusvalue.value? statusvalue.value:0, //后续改成-1
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
        state.orderList = result?.map(
          (item: {
            merchandise: { caption: any; days: any; sellAuth: any; price: any; information: any }
            order: { code: any; name: any; status: any,belongId:any }
          }) => {
            // if(!item.merchandise) {item.merchandise = {caption: null, days: null, sellAuth: null, price:null, information: null}}
            return {
              ...item,
              code: item.order.code,
              belongId: item.order.belongId,
            }
          }
        )
      })
  }
  //查询已购入订单
  const searchBuyList = async () => {
     state.orderList = [];
    await $services.order
      .searchBuyList({
        data: {
          offset: (pagination.current - 1) * pagination.limit,
          limit: pagination.limit,
          status: statusvalue.value? statusvalue.value:0, //后续改成-1
          filter: ''
        }
      })
      .then((res: ResultType) => {
        const { result = [], total = 0 } = res.data
        pageStore.total = total
        result.forEach((item: any) => {
          item.ordertype = 'buy'
          if (item.details) {
            item.details = item.details.map((e:any) => {
              return {
                ...e,
              }
            })
          }

          item.hasChildren = false
          if (item.details) {
            item.children = item.details
            item.hasChildren = item.details.length > 0
          }
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
            type: 'success'
          })
        }
      })
  }
  //查询支付列表
  const showPayList = async (data: any) => {
    payListDialog.data = data
    payListDialog.show = true
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
  //关闭支付记录列表
  const closePayList = async () => {
    payListDialog.show = false
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
  //取消
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
            message: '取消成功',
            type: 'success'
          })
        }
      })
  }
    //退货退款
  const reject = async (id: string) => {
    await $services.order
      .reject({
        data: {
          id: id,
          status: 222
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          getTableList(searchType.value)
          ElMessage({
            message: '退货成功',
            type: 'success'
          })
        }
      })
  }

  //取消订单详情  由删除更改为中止
  const cancelOrderDetail = async (id: string,status:number,reason:string) => {
    // await $services.order
    //   .deleteDetail({
    //     data: {
    //       id: id
    //     }
    //   })
    //   .then((res: ResultType) => {
    //     if (res.code == 200) {
    //       getTableList(searchType.value)
    //       ElMessage({
    //         message: '取消成功',
    //         type: 'success'
    //       })
    //     }
    //   })
    ElMessageBox.prompt('请输入原因', '确认取消订单?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    .then(({ value }) => {
      $services.order
      .orderConfirm({
        data: {
          id: id,
          status: status
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          getTableList(searchType.value)
          ElMessage({
            message: '取消订单成功',
            type: 'success'
          })
        }
      })
    })
    .catch(() => {})
  }
  //确认交付
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
            message: '交付成功',
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
    //配置表头背景
    const getRowClass = ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: any
    column: any
    rowIndex: number
    columnIndex: number
  }) => {
    if (rowIndex === 0) {
      return {
        background: 'var(--el-color-primary-light-9)',// '#F5F6FC',
        color: 'var(--el-text-color-primary)',// '#333333',
        height: '36px',
        padding: '2px 0'
      }
    } else {
      return {}
    }
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
    // width: 100%;
    height: 100vh;
    // background: var(--el-bg-color);
    display: flex;
    flex-direction: column;
    margin: 16px;
    border: 0;
    .limit_table_height {
      
    }
    .tables {
      height: 50%;
    }
    .operate-btns {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      // background: #fff;
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
      width: 220px;
      margin-right: 20px;
      margin-left: 20px;
      position: relative;
    }
  }

  .diy-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;

    &__header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10px;

      .header-title {
        font-size: 16px;
        font-weight: bold;
        // color: #303133;
        padding: 0 0 10px;

        i {
          font-size: 20px;
          color: var(--el-color-primary);
        }
      }

      .header-tabs {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: -5px;
      }

      .header-buttons {
        display: flex;
      }
    }

    &__btn {
      display: flex;
      justify-content: space-between;
    }

    &__body {
      width: 100%;
      height: 100px; //避免el-table无限变高
      display: flex;
      flex: 1;
      margin-top: 10px;

      &-box {
        width: 1vw;
        flex: auto;
      }
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .footer-operate {
        width: 110px;
        height: 40px;
        border: 1px solid rgba(209, 223, 245, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .el-dropdown {
          width: 100%;
          height: 100%;
        }
        .el-dropdown-link {
          width: 100%;
          height: 100%;
          display: block;
          text-align: center;
          height: 38px;
          line-height: 38px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }

      .footer-buttons {
        width: 350px;
        display: flex;
        justify-content: space-between;

        .select-options {
          width: 150px;
        }
      }

      .footer-pagination {
        & :deep(.btn-prev) {
          border-radius: 16px;
        }
        & :deep(.el-pager > .number) {
          border-radius: 4px;
        }
        & :deep(.btn-next) {
          border-radius: 16px;
        }
        & :deep(.el-pagination__sizes .el-input__inner) {
          border-radius: 16px;
          // background: rgba(231, 239, 252, 1);
          border-color: transparent;
        }
      }
    }
  }
  .el-dropdown-menu {
    width: 110px;
  }
  .table-row-sty {
    height: calc(100vh - 12rem);
    padding: 16px;
  }
  .table-row-sty tr:hover,
  .table-row-sty tbody tr.el-table__row.not-read:hover {
    cursor: pointer;
    color: #2da1f8;
  }
  .el-icon-question {
  }
  .tableClass {
    background-color: #edf2fc;
    cursor: no-drop;
  }
  .diy-button {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: rgba(235, 238, 245, 1);
      border-radius: 4px;
    }
  }
  @media screen and (max-width: 1280px) {
    .diy-table__header {
      display: flex;
      display: none;
      flex-wrap: wrap;
    }
  }
  :deep(.el-table__header-wrapper .el-checkbox) {
    display: none;
  }
</style>
