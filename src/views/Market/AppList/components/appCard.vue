<template>
  <div class="market-layout" style="height:calc(100% - 56px)">
    <div class="market-content box" style="height: 100%">
      <ul class="box-ul">
        <li class="app-card" v-if="dataList?.length !== 0">
          <ShopCard
            v-for="item in dataList"
            :info="item.id"
            :key="item.id"
            :cardContent="true"
            @click="handleCardInfo(item)"
          >
            <template #rightIcon>
              <el-dropdown trigger="click" placement="left-start">
                <el-icon :size="18">
                  <Operation />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="GoPageWithQuery('/market/merchandiseDetail',item)">商品详情</el-dropdown-item>
                    <el-dropdown-item @click="joinStaging(item)">加入购物车</el-dropdown-item>
                    <el-dropdown-item @click="unpublishFun(item)" v-if="type == 'manage'"
                      >下架</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template #content>
              <div class="shopCar-box">
                <div class="app-con-title">{{ item.caption }} </div>
                <!-- <div class="app-con-info" v-if="item.sellAuth !== '所属权'">使用期限：{{ item.days }}天</div> -->
                <div class="app-con-info"
                  >单价：
                  <span style="color: var(--el-color-warning)"> ￥ </span>
                  <strong style="color: var(--el-color-warning); font-size: 16px">{{
                    item.price || '0.00'
                  }}</strong>
                </div>

                <div class="app-con-info"
                  >售卖权属：{{ item.sellAuth }}
                  <el-tag size="small" v-if="item.sellAuth !== '所属权'">
                    使用期：{{ item.sellAuth !== '所属权' ? item.days + '天' : '无期限' }}</el-tag>
                </div>
                <!-- <div class="app-con-info">上架时间：{{ item.createTime.substring(0, 11) }}</div> -->
              </div>
            </template>
            <template #footer>
              <el-divider style="margin: 16px 0"></el-divider>
              <div class="app-card-item-con-desc">
                <p>详情：{{ item.information || '暂无' }}</p>
              </div>
            </template>
            <template #icon>
              <HeadImg
                :name="item.name"
                :url="item.icon || merchandiseImg"
                :imgWidth="48"
                :limit="1"
                :isSquare="false"
              />
            </template>
            <!-- <template #footer> -->
            <el-button link @click="createOrder(item)">立即购买</el-button>
            <!-- <div v-if="type == 'shop'">
              <el-button link @click="joinStaging(item)">加入购物车</el-button>
              <el-divider direction="vertical" />
              <el-button link @click="createOrder(item)">立即购买</el-button>
            </div>
            <div v-else>
              <el-button
                style="color: aliceblue; font-weight: bold; background-color: orange; width: 100px"
                round
                @click="unpublishFun(item)"
                >下架</el-button
              >
            </div> -->
          </ShopCard>
        </li>
        <div v-else>暂无数据</div>
      </ul>
    </div>
  </div>
  <template v-for="item in state.dialogShow" :key="item.key">
    <AppInfoDialog
      v-if="item.key == 'info' && item.value"
      :dialogShow="item"
      @closeDialog="closeDialog"
    >
    </AppInfoDialog>
  </template>
</template>

<script setup lang="ts">
import { reactive, computed, withDefaults } from 'vue'
import $services from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus'
import ShopCard from '../../components/shopCard.vue'
import AppInfoDialog from './appInfoDialog.vue'
import { ElNotification } from 'element-plus'
import merchandiseImg from '@/assets/img/app_icon.png'
import { useRouter } from 'vue-router'
const router = useRouter()
const emit = defineEmits(['handleUpdate', 'shopcarNumChange'])
type Props = {
  dataList: any
  type?: any
}
const props = withDefaults(defineProps<Props>(), { dataList: [], type: 'manage' })
const handleCurrent: any = computed(() => {
  return (state.page.currentPage - 1) * state.page.pageSize
})

const state = reactive({
  page: {
    total: 0, // 总条数
    currentPage: 1, // 当前页
    current: handleCurrent,
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

const moreOperations = () => {
  ElMessage({
    message: '更多操作',
    type: 'success'
  })
}

const handleUpdate = (page: any) => {
  state.page.currentPage = page.currentPage
  state.page.pageSize = page.pageSize
}

const GoPage = (path: string) => {
  router.push(path)
}

const GoPageWithQuery = (path: string, query: any) => {
  router.push({ path, query })
}

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

const handleCurrentChange = (val: number) => {
  state.page.currentPage = val
  emit('handleUpdate')
}

const addShopCar = (data: any) => {
  $services.appstore
    .staging({
      data: {
        id: data.id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '添加成功',
          type: 'success'
        })
      }
    })
}

const joinStaging = async (item: any) => {
  console.log(item)
  await $services.market
    .joinStaging({
      data: {
        id: item.id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        emit('shopcarNumChange')

        // ElMessage({
        //   message: '添加成功',
        //   type: 'success'
        // })
        ElNotification.success({
          title: '已加入购物车',
          offset: 100,
          showClose: false
        })
      }
    })
}

function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const createOrder = async (item: any) => {
  ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    $services.order
      .create({
        data: {
          code: new Date().getTime().toString().substring(0, 13),
          name: item.caption,
          merchandiseId: item.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
        }
      })
  })
}

  const unpublishFun = (item: any) => {
    let title: string
    title = `确定把 ${item.caption} 下架吗？`
    ElMessageBox.confirm(title, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        unpublishApp(item)
      })
      .catch(() => {})
  }
  //下架应用
  const unpublishApp = (item: any) => {
    $services.market
      .unpublishMerchandise({
        data: {
          id: item.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          emit('handleUpdate')
          ElMessage({
            message: '下架成功',
            type: 'success'
          })
        }
      })
  }

  defineExpose({
    state
  })
</script>

<style lang="scss" scoped>
.market-layout {
  height: 100%;
}

.app-con-title {
  // color: #000000d9;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.app-con-info {
  font-size: 13px;
  // font-weight: 400;
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.app-card-item-con-desc {
  p {
    font-size: 12px;
    font-weight: 400;
    color: var(--el-text-color-secondary);
    // line-height: 1.8;
    // position: absolute;
    // bottom: 50px;
    // width: 100%;
    // left: 0;
    // height: 30px;
    // padding: 0px 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-break: break-all;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}

// :deep(.el-card__body) {
//   padding: 0;
// }
.shopCar {
  padding: 4px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.box {
  .box-ul + .box-ul {
    margin-top: 16px;
  }

  &-ul {
    position: relative;
    // background-color: #fff;
    height: 100%;

    &-title {
      font-weight: bold;
      padding-bottom: 10px;
    }

    .app-card {
      display: flex;
      flex-wrap: wrap;
      height: calc(100% - 60px);
    }
  }
}
</style>
