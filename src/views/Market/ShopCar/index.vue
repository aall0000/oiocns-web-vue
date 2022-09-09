<template>
  <div class="common-layout">
    <MarketCard>
      <template #right>
        <!-- <span class="top">
          <el-checkbox
            :v-model="allchecked.checked"
            @change="checkAll"
            v-if="cardActive"
            style="
              display: inline-block;
              vertical-align: top;
              height: 28px;
              padding-top: 11px;
              margin-right: 20px;
            "
            >全选</el-checkbox
          >
          <el-switch
            v-model="cardActive"
            @change="changeView"
            active-text="卡片"
            inactive-text="列表"
            style="display: inline-block; vertical-align: top; height: 28px; padding: 10px"
          />
        </span> -->
        <el-button type="text" @click="deleteStagings">删除</el-button>
        <el-button type="text" @click="createOrderByStaging(null)">购买</el-button>
        <div>
          <el-radio-group v-model="mode" size="small" class="button" @change="changeView">
            <el-radio-button label="list"
              ><el-icon :size="18"><Tickets /></el-icon
            ></el-radio-button>
            <el-radio-button label="card"
              ><el-icon :size="18"><Menu /></el-icon
            ></el-radio-button>
          </el-radio-group>
        </div>
      </template>
    </MarketCard>
    <div v-if="isRouterAlive" class="shopcar-content">
      <!-- <el-row :gutter="12" v-loading="loading" v-if="cardActive">
        <el-col :span="4" v-for="item in pageStore.tableData" :key="item.id">
           <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-checkbox
                  v-model="item.checked"
                  :label="item.id"
                  @change="checkedChange(item)"
                  ><h4>{{ item.merchandise.caption }}</h4></el-checkbox
                >
                <el-icon><Close @click="deleteStaging(item.id)" /></el-icon>
              </div>
              <div @click="gotoApp(item.market)"> ➮{{ item.market.name }} </div>
            </template>
            <div @click="detail(item)">
              <img
                src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                class="image"
              />
              <div style="padding: 14px">
               <span style="padding: 10px;">{{ item.merchandise.sellAuth }} {{item.merchandise.sellAuth=='使用权'?item.merchandise.days:''}}{{item.merchandise.sellAuth=='使用权'?'天':''}}<span style="color:red;margin-left:50px;font-size:18px;bold">¥{{ item.merchandise.price }}</span></span>
              </div>
            </div>
          </el-card> 
        </el-col>
      </el-row> -->
      <ul class="box-ul" v-if="mode=='card'">
        <li class="app-card">
          <ShopCard
            v-for="item in pageStore.tableData"
            :class="item.checked ? 'bule-shadow' : 'dark-shadow'"
            :info="item.id"
            :key="item.id"
            :cardContent="true"
            @click="checkedChange(item)"
          >
          <template #rightIcon>
              <el-dropdown trigger="click" placement="left-start">
                <el-icon :size="18" ><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="GoPageWithQuery('/market/merchandiseDetail',{data:item.id})">商品详情</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          <template #icon><HeadImg :name="item.name" :url="item.icon || merchandiseImg" :imgWidth="48" :limit="1" :isSquare="false" style="height: 40px;line-height: 40px;"/></template>

            <template #content>
              <div class="shopCar-box" @click="handleCardInfo(item)">
                <div class="app-con-title">{{ item.merchandise.caption }}</div>
                <div class="app-con-info" v-if="item.merchandise.sellAuth !== '所属权'"
                  >使用天数：{{ item.merchandise.days }}</div
                >
                <div class="app-con-info">价格：{{ item.merchandise.price }}</div>
                <div class="app-con-info">售卖权属：{{ item.merchandise.sellAuth }}</div>
              </div>
              <div class="app-card-item-con-desc"
                ><p>{{ item.merchandise.information }}</p></div
              >
            </template>
          </ShopCard>
        </li>
      </ul>
      <el-table
        class="table-row-sty"
        :header-cell-style="getRowClass"
        ref="shopcarTableRef"
        :data="pageStore.tableData"
        stripe
        border
        @select="handleSelect"
        @row-click="handleRowClick"
        v-if="mode=='list'"
        @select-all="checkAll"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="序号" type="index" width="80" align="center">
          <template #default="scope">
            <span>{{ (pagination.current - 1) * pagination.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caption" label="商品名称" />
        <el-table-column prop="information" label="商品信息" />
        <el-table-column prop="sellAuth" label="售卖权属" />
        <el-table-column prop="days" label="使用期限" />
        <el-table-column prop="price" label="售卖价格" />
        <el-table-column prop="number" label="数量" />
        <el-table-column prop="marketName" label="市场名称" />
        <el-table-column prop="marketCode" label="市场编号" />
        <el-table-column prop="name" label="操作" width="200" align="center">
          <template #default="scope">
            <DiyButton>
              <template v-slot:opt>
                <div class="diy-button" @click="deleteStaging(scope.row.id)"> 删除 </div>
                <div class="diy-button" @click="createOrderByStaging(scope.row.id)"> 购买 </div>
              </template>
            </DiyButton>
          </template>
        </el-table-column>
      </el-table>
      <template v-for="item in state.dialogShow" :key="item.key">
        <AppInfoDialog
          v-if="item.key == 'info' && item.value"
          :dialogShow="item"
          @closeDialog="closeDialog"
        ></AppInfoDialog>
      </template>
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
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import $services from '@/services'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PAGE_SIZES, PAGE_NUM } from '@/constant'
import { ElTable } from 'element-plus'
import ShopCard from '../components/shopCard.vue'
import AppInfoDialog from '../AppList/components/appInfoDialog.vue'
import DiyButton from '@/components/diyButton/index.vue'
import merchandiseImg from '@/assets/img/app_icon.png'
import moment from 'moment'
const router = useRouter()
// 表格分页数据
const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})
// const cardActive = ref(true)
const mode = ref('card')
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

const GoPage = (path: string) => {
    router.push(path)
}
const GoPageWithQuery = (path: string, query: any) => {
    router.push({ path, query })
  }
const viewform = (item: any) => {
  alert('55')
}

const state = reactive({
  page: {
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 20, // 每页条数
    pageSizes: [20, 30, 50], // 分页数量列表
    layout: 'total, prev, pager, next'
  },
  dialogShow: [
    {
      key: 'info',
      value: false
    }
  ]
})
// 查看卡片详情
const handleCardInfo = (item: any) => {
  state.dialogShow.map((el: { value: boolean; key: string; sendData?: any }) => {
    if (el.key == 'info') {
      el.value = true
      el.sendData = item
    }
  })
}
const closeDialog = (val: string) => {
  state.dialogShow.map((el: { value: boolean; key: string }) => {
    if (el.key == val) {
      el.value = false
    }
  })
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
  var ids = e.map((item) => item.id)
  for (let item of pageStore.tableData) {
    item.checked = false
    if (ids.includes(item.id)) {
      item.checked = true
    }
  }
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
  var checkedStagIds: any[] = []
  if (checkedId) {
    checkedStagIds = [checkedId]
  } else {
    checkedStagIds = pageStore.tableData.filter((item) => item.checked).map((item) => item.id)
  }
  console.log(checkedStagIds)
  if (checkedStagIds.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }
  var checkedStages = pageStore.tableData.filter((item) => checkedStagIds.includes(item.id))
  ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    setTimeout(
      async (ids) => {
        await $services.market
          .createOrderByStaging({
            data: {
              code: new Date().getTime().toString().substring(0, 13),
              name: checkedStages[0].merchandise.caption + (checkedStages.length>1?`...等${checkedStages.length}件商品`:''),
              stagIds: checkedStagIds
            }
          })
          .then((res: ResultType) => {
            if (res.code == 200) {
              getTableList()
              ElMessage({
                message: '创建订单成功',
                type: 'success'
              })
            }
          })
      },
      1,
      checkedStagIds
    )
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
        background: '#F5F6FC',
        color: '#333333',
        height: '36px',
        padding: '2px 0'
      }
    } else {
      return {}
    }
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
  item.checked = !item.checked
}
</script>


<style scoped lang="scss">
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
  bottom: 20px;
  position: fixed;
  right: 20px;
}

.table-row-sty {
  height: calc(100vh - 12rem);
}

.app-con-title {
  color: #000000d9;
  font-size: 16px;
  font-weight: 600;
}
.app-con-info {
  font-size: 12px;
  font-weight: 400;
}
.app-card-item-con-desc {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);

  position: absolute;
  bottom: 50px;
  width: 100%;
  left: 0;
  height: 30px;
  padding: 0px 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
:deep(.el-card__body) {
  padding: 0;
}
.shopCar {
  padding: 4px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

// :deep(.diy-button-pos) {
//   display: flex;
//   justify-content: left;
// }
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

.button {
  margin-left:20px
}

.box {
  .box-ul + .box-ul {
    margin-top: 10px;
  }
  &-ul {
    position: relative;
    background-color: #fff;
    height: 100%;
    &-title {
      font-weight: bold;
      padding-bottom: 10px;
    }
    .app-card {
      display: flex;
      flex-wrap: wrap;
      padding: 16px;
      .bule-shadow {
        box-shadow: 0px 0px 4px rgb(0, 89, 255, 0.7);
      }
      .dark-shadow {
        box-shadow: 4px 4px 4px rgb(174, 177, 184);
      }
    }
  }
}
</style>
