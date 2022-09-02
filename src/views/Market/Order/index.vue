<template>
  <MarketCard>
    <template #right>
      <el-button type="primary" @click="getTableList('buy')">已购入</el-button>
      <el-button type="primary" @click="getTableList('sell')">已卖出</el-button>
      <!-- <div class="group-side-bar-search">
      <el-input placeholder="搜索" v-model="searchValue" prefix-icon="Search" />
    </div> -->
    </template>
  </MarketCard>
  <div class="container">
    <!-- <el-button-group style="padding: 10px;">
      <el-button type="primary" @click="getTableList('buy')">已购入</el-button>
      <el-button type="primary" @click="getTableList('sell')">已卖出</el-button>
    </el-button-group> -->

    <div class="tab-list">
      <el-table
        :data="state.orderList"
        stripe
        @select="handleSelect"
        ref="orderTableRef"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="code" label="订单号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="number" label="数量" />
        <el-table-column prop="marketCode" label="市场编号" />
        <el-table-column prop="marketName" label="市场名称" />
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
        // var result: any = [
        //   {
        //     id: '348129171096636636',
        //     name: '邵一刀的待出售订单(海贼王-白胡子手办)2022-02-22 14:05:30',
        //     code: 'syd_20200222_001',
        //     status: 1,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '233',
        //       name: '闲鱼',
        //       code: 'market_xy_001',
        //       remark: '闲鱼'
        //     }
        //   }
        // ]
        pageStore.total = result.length
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
        // console.log(res.data)
        //  result = result.length>0?result:[
        //   {
        //     id: '348129171096636636',
        //     name: '邵一刀的待出售订单(海贼王-白胡子手办)2022-02-22 14:05:30',
        //     code: 'syd_20200222_001',
        //     status: 1,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '233',
        //       name: '闲鱼',
        //       code: 'market_xy_001',
        //       remark: '闲鱼'
        //     },
        //     merchandise: {
        //       caption: '海贼王-白胡子手办',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171098145636',
        //     name: '邵一刀的出售订单(原神初始号)2022-02-22 14:05:30',
        //     code: 'syd_20200222_001',
        //     status: 100,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '222',
        //       name: '游戏商城',
        //       code: 'market_yx_001',
        //       remark: '游戏商城'
        //     },
        //     merchandise: {
        //       caption: '原神初始号',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171092213532',
        //     name: '邵一刀的出售订单(原神-钟离雷神号)2022-03-21 12:36:30',
        //     code: 'syd_20200321_001',
        //     status: 101,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '222',
        //       name: '游戏商城',
        //       code: 'market_yx_001',
        //       remark: '游戏商城'
        //     },
        //     merchandise: {
        //       caption: '原神-钟离雷神号',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171265102421',
        //     name: '邵一刀的出售订单(二手小台灯)2022-02-05 10:16:30',
        //     code: 'syd_20200205_001',
        //     status: 102,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '233',
        //       name: '闲鱼',
        //       code: 'market_xy_001',
        //       remark: '闲鱼'
        //     },
        //     merchandise: {
        //       caption: '二手小台灯',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171265102421',
        //     name: '邵一刀的出售订单(书籍-茶花女)2022-02-05 10:16:30',
        //     code: 'syd_20200205_003',
        //     status: 103,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '255',
        //       name: '当当网',
        //       code: 'market_ddw_001',
        //       remark: '当当网'
        //     },
        //     merchandise: {
        //       caption: '书籍-茶花女',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171265102463',
        //     name: '邵一刀的出售订单(潮鞋-椰子鞋2022新年特供)2022-02-05 10:16:30',
        //     code: 'syd_20200205_005',
        //     status: 104,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '301',
        //       name: '抖音商城',
        //       code: 'market_dy_001',
        //       remark: '抖音商城'
        //     },
        //     merchandise: {
        //       caption: '潮鞋-椰子鞋2022新年特供',
        //       price: 500
        //     }
        //   }
        // ]
        pageStore.total = result.length
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
        // var result = [
        //   {
        //     id: '348129171098177536',
        //     name: '邵一刀的购买订单2022-08-22 14:05:30',
        //     code: 'syd_20200822_001',
        //     status: 1,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '5555',
        //       name: '邵某某的市场',
        //       code: 'market_sld_001',
        //       remark: '邵某某的市场'
        //     },
        //     merchandise: {
        //       caption: '商品1',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171098177532',
        //     name: '邵一刀的购买订单2022-08-21 12:36:30',
        //     code: 'syd_20200821_001',
        //     status: 100,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '5555',
        //       name: '邵某某的市场',
        //       code: 'market_sld_001',
        //       remark: '邵某某的市场'
        //     },
        //     merchandise: {
        //       caption: '商品2',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171098176421',
        //     name: '邵一刀的购买订单2022-07-05 10:16:30',
        //     code: 'syd_20200705_001',
        //     status: 101,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '5555',
        //       name: '邵某某的市场',
        //       code: 'market_sld_001',
        //       remark: '邵某某的市场'
        //     },
        //     merchandise: {
        //       caption: '商品3',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171098176636',
        //     name: '邵一刀的购买订单(跳蚤)2022-02-22 14:05:30',
        //     code: 'syd_20200222_001',
        //     status: 102,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '111',
        //       name: '跳蚤市场',
        //       code: 'market_tz_001',
        //       remark: '跳蚤市场'
        //     },
        //     merchandise: {
        //       caption: '洗衣机',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171098133532',
        //     name: '邵一刀的购买订单(跳蚤)2022-03-21 12:36:30',
        //     code: 'syd_20200321_001',
        //     status: 103,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '111',
        //       name: '跳蚤市场',
        //       code: 'market_tz_001',
        //       remark: '跳蚤市场'
        //     },
        //     merchandise: {
        //       caption: '高等数学(上)教材',
        //       price: 500
        //     }
        //   },
        //   {
        //     id: '348129171098102421',
        //     name: '邵一刀的购买订单(跳蚤)2022-02-05 10:16:30',
        //     code: 'syd_20200205_001',
        //     status: 100,
        //     createUser: '338792423297781760',
        //     updateUser: '348098798750404608',
        //     version: '3',
        //     createTime: '2022-08-18 15:41:02.000',
        //     updateTime: '2022-08-18 16:16:59.000',
        //     market: {
        //       id: '111',
        //       name: '跳蚤市场',
        //       code: 'market_tz_001',
        //       remark: '跳蚤市场'
        //     },
        //     merchandise: {
        //       caption: '电风扇',
        //       price: 500
        //     }
        //   }
        // ]
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
      padding: 10px 0;
      display: flex;
      justify-content: end;
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
