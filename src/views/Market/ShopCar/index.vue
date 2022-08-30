<template>
  <div class="common-layout">
    <MarketCard>
      <template #right>
        <span class="top">
          <el-checkbox
            :v-model="allchecked.checked"
            @change="checkAll"
            v-if="cardActive"
            style="
              display: inline-block;
              vertical-align: top;
              height: 28px;
              padding-top: 12px;
              margin-right: 20px;
            "
            >全选</el-checkbox
          >
          <el-switch
            v-model="cardActive"
            @change="changeView"
            active-text="卡片"
            inactive-text="列表"
            style="
              display: inline-block;
              vertical-align: top;
              height: 28px;
              padding: 10px;
              margin-right: 200px;
            "
          />
        </span>
        <el-button type="primary" @click="deleteStagings">删除</el-button>
        <el-button type="primary" @click="createOrderByStaging">购买</el-button>
      </template>
    </MarketCard>
    <div v-if="isRouterAlive">
      <el-row :gutter="12" v-loading="loading" v-if="cardActive">
        <!-- date遍历循环的数据 -->
        <el-col :span="4" v-for="item in pageStore.tableData" :key="item.id">
          <el-card shadow="hover"
            ><!--style="background-color: #5daf34"  灰 #e1e1e1 绿 #5daf34-->
            <!-- 卡片的头部位 -->
            <template #header>
              <div class="card-header">
                <!-- 
              	这里声明一下,我在多选时,往数组中添加的是对象
              	label属性:是多选框的值,若该标签中无内容,则该属性也充当 checkbox 按钮后的介绍
              	@change:改变事件,多选框勾选和取消勾选都会触发事件,所以在取消勾选时要删除勾选状态下的值
              -->
                <el-checkbox
                  v-model="item.checked"
                  :label="item.id"
                  @change="checkedChange(item)"
                  >{{ item.merchandise.caption }}</el-checkbox
                >

                <div @click="gotoApp(item.market)"> >>{{ item.market.name }} </div>
                <!-- <el-button class="button" text>Operation button</el-button> -->
                <el-icon><Close @click="deleteStaging(item.id)" /></el-icon>
              </div>
            </template>
            <!-- 卡片显示的内容 -->
            <div>
              <img
                src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                class="image"
              />
              <div style="padding: 14px">
                <span>{{ item.merchandise.information }}</span
                ><span style="color: red; padding: 60px; font-size: 18px"
                  >¥{{ item.merchandise.price }}</span
                >
                <div class="bottom">
                  <time class="time">{{ new Date() }}</time>
                  <el-button text class="button"
                    ><el-input-number
                      v-loading="loading"
                      v-model="item.number"
                      :min="1"
                      @change="numChange(item)"
                  /></el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-table
        ref="shopcarTableRef"
        :data="pageStore.tableData"
        stripe
        @select="handleSelect"
        @row-click="handleRowClick"
        v-if="!cardActive"
        @select-all="checkAll"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="caption" label="商品名称" />
        <el-table-column prop="information" label="商品信息" />
        <el-table-column prop="sellAuth" label="出售权益" />
        <el-table-column prop="days" label="期限" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="number" label="数量" />
        <el-table-column prop="marketName" label="市场名称" />
        <el-table-column prop="marketCode" label="市场编号" />
        <el-table-column prop="name" label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" @click="deleteStaging(scope.row.id)">删除</el-button>
            <el-button type="primary" @click="createOrderByStaging(scope.row.id)">购买</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import $services from '@/services'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { PAGE_SIZES, PAGE_NUM } from '@/constant'
import { ElTable } from 'element-plus'
import moment from 'moment'
const router = useRouter()
// 表格分页数据
const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})
const cardActive = ref(true)
const loading = ref(false)
const isRouterAlive = ref(true)
const allchecked = reactive({ anyData: [], checked: false })
const pageSizes = ref<Array<any>>(PAGE_SIZES)
onMounted(() => {
  getTableList()
})
// 会话列表搜索关键字
const searchValue = ref<string>('')
const shopcarTableRef = ref<InstanceType<typeof ElTable>>()
//点击行触发，选中或不选中复选框
const handleRowClick = (row: any) => {
  shopcarTableRef.value!.toggleRowSelection(row, undefined)
}

//查询
const getTableList = async () => {
  isRouterAlive.value = false
  await $services.market
    .searchStaging({
      data: {
        id: 0, //市场id （需删除）
        offset: (pagination.current - 1) * pagination.limit,
        limit: pagination.limit,
        filter: ''
      }
    })
    .then((res: ResultType) => {
      var { result = [], total = 0 } = res.data
      pageStore.total = total
      result.forEach((item: any) => {
        item.ordertype = 'sell'
        item.checked = false
        return item
      })
      pageStore.tableData = result?.map(
        (item: {
          market: { remark: any; code: any; name: any }
          merchandise: { caption: any; information: any; sellAuth: any; days: any; price: any }
        }) => {
          return {
            ...item,
            caption: item.merchandise.caption,
            information: item.merchandise.information,
            sellAuth: item.merchandise.sellAuth,
            days: item.merchandise.days,
            price: item.merchandise.price,
            marketName: item.market.name,
            marketCode: item.market.code
          }
        }
      )

      console.log('pageStore.tableData', pageStore.tableData)
      isRouterAlive.value = true
    })
}
const gotoApp = (item: { id: string }) => {
  router.push({ path: '/market/appList', query: { data: item.id } })
}

const handleSelect = (e: any[], row: any) => {
  // debugger
  var ids = e.map((item) => item.id)
  for (let item of pageStore.tableData) {
    item.checked = false
    if (ids.includes(item.id)) {
      item.checked = true
    }
  }

  // row.checked = e.value;
  console.log(pageStore.tableData)
}

//切换视图
const changeView = (e: any) => {
  //清空选中状态
  pageStore.tableData.forEach((item) => {
    item.checked = false
    return item
  })
}

const checkAll = (e: any) => {
  allchecked.checked = e
  console.log(allchecked.checked)
  pageStore.tableData.forEach((item) => {
    item.checked = allchecked.checked
    return item
  })
  console.log(pageStore.tableData)
}
// 处理表格分页操作
const handlePaginationChange = (newVal: number, type: 'current' | 'limit') => {
  pagination[type] = newVal
  getTableList()
}

function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

//创建订单(批量)
const createOrderByStaging = async (checkedId?: string) => {
  var checkedStagIds = []
  if (checkedId) {
    checkedStagIds = [checkedId]
  } else {
    checkedStagIds = pageStore.tableData.filter((item) => item.checked).map((item) => item.id)
  }
  // var checkedStagIds = pageStore.tableData.filter((item) => item.checked).map((item) => item.id)
  console.log(checkedStagIds)
  if (checkedStagIds.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }
  await $services.market
    .createOrderByStaging({
      data: {
        name: moment().format('YYYY-MM-DD hh:mm:ss') + '的订单',
        code: getUuid(),
        stagIds: checkedStagIds
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        getTableList()
        ElMessage({
          message: '创建订单成功',
          type: 'warning'
        })
      }
    })
}

//从购物车移除 (批量)
const deleteStagings = () => {
  //检查数据
  var checkedRecords = pageStore.tableData.filter((item) => item.checked)
  if (checkedRecords.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }
  //要改为并发删除
  for (let item of pageStore.tableData) {
    if (item.checked) {
      $services.market
        .deleteStaging({
          data: {
            id: item.id
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            getTableList()
            ElMessage({
              message: '移除成功',
              type: 'warning'
            })
          }
        })
    }
  }
}
//从购物车移除
const deleteStaging = async (id: string) => {
  console.log(id)
  await $services.market
    .deleteStaging({
      data: {
        id: id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        getTableList()
        ElMessage({
          message: '移除成功',
          type: 'warning'
        })
      }
    })
}
//改变购物车商品数量
const numChange = async (item: any) => {
  console.log(item)
  ElMessage({
    message: '该功能尚未开放',
    type: 'warning'
  })
  return
  loading.value = true
  await $services.market
    .updateStaging({
      data: {
        id: item.id,
        number: item.number
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        loading.value = false
      }
    })
  loading.value = false
}
//选中/取消选中
const checkedChange = (item: any) => {
  console.log(item.checked)
}
</script>


<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}

.main-content {
  width: 100%;
  height: 95%;
  overflow-y: auto;
  top: 60px;
  position: absolute;
}
/* .top_1 {
  display: inline-block;
  margin-right: 10px;
} */
/* .top {
  display: inline-block;
  height: 100%;
  margin-right: 10px;
} */

.group-side-bar-search {
  padding: 6px;
  float: right;
  width: 300px;
  margin-right: 20px;
  position: relative;
}

.header {
  height: 60px; /*设定footer高度*/
  position: absolute; /*设定footer绝对位置在底部*/
  top: 0;
  width: 100%; /*展开footer宽度*/
  /* line-height: 60px; */
}
.footer {
  height: 60px; /*设定footer高度*/
  position: absolute; /*设定footer绝对位置在底部*/
  bottom: 0;
  width: 100%; /*展开footer宽度*/
  background-color: gray;
  line-height: 60px;
}

.send-box {
  justify-content: flex-end;
  text-align: center;
  margin-left: 30px;
}

.page-pagination {
  padding: 10px 0;
  display: flex;
  justify-content: end;
}
</style>
