<template>
  <div class="market-layout">
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
              <!-- <div class="shopCar" @click.stop="addShopCar(item)">
                <el-icon><ShoppingCart /></el-icon>
              </div> -->
            </template>
            <template #content>
              <div class="shopCar-box">
                <div class="app-con-title">{{ item.caption }}</div>
                <div class="app-con-info" v-if="item.sellAuth !== '所属权'"
                  >使用天数：{{ item.days }}</div
                >
                <div class="app-con-info">价格：{{ item.price }}</div>

                <div class="app-con-info">售卖权属：{{ item.sellAuth }}</div>
                <!-- <div class="app-con-info">上架时间：{{ item.createTime.substring(0, 11) }}</div> -->
              </div>
              <div class="app-card-item-con-desc">
                <p>{{ item.information }}</p>
              </div>
            </template>
            <!-- <template #footer> -->

            <el-button-group v-if="cardType=='manage'">
              <el-button
                style="color: aliceblue; font-weight: bold; background-color: orange; width: 100px"
                round
                @click="joinStaging(item)"
                >加入购物车</el-button
              >
              <el-button
                style="color: aliceblue; font-weight: bold; background-color: red; width: 100px"
                round
                @click="createOrder(item)"
                >立即购买</el-button
              >
            </el-button-group>
            <el-button-group v-else>
              <el-button
                style="color: aliceblue; font-weight: bold; background-color: orange; width: 100px"
                round
                >下架</el-button
              >
            </el-button-group>
            <!-- <el-divider direction="vertical" />
            <el-button class="btn" link small>用户管理</el-button> -->
            <!-- </template> -->
          </ShopCard>
        </li>
        <div v-else>暂无数据</div>
        <div class="pagination">
          <el-pagination
            v-if="dataList?.length !== 0"
            @current-change="handleCurrentChange"
            v-bind="state.page"
            :pager-count="5"
            style="text-align: right; margin-top: 10px; justify-content: end"
          />
        </div>
      </ul>
    </div>
  </div>
  <template v-for="item in state.dialogShow" :key="item.key">
    <AppInfoDialog
      v-if="item.key == 'info' && item.value"
      :dialogShow="item"
      @closeDialog="closeDialog"
    ></AppInfoDialog>
  </template>
</template>

<script setup lang="ts">
  import { reactive, computed,withDefaults } from 'vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  import ShopCard from '../../components/shopCard.vue'
  import AppInfoDialog from './appInfoDialog.vue'
  import moment from 'moment'
  const emit = defineEmits(['handleUpdate'])
  type Props={
    dataList: any
    cardType:'manage'|'shop'
  }
  const props =withDefaults(defineProps<Props>(),{ dataList:[],cardType:'manage'})
    console.log('上厕所',props);


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
          ElMessage({
            message: '添加成功',
            type: 'success'
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
    console.log(item)
    await $services.order
      .create({
        data: {
          name: moment().format('YYYY-MM-DD hh:mm:ss') + '的订单',
          code: getUuid(),
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
  }

  defineExpose({
    state
  })
</script>

<style lang="scss" scoped>
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
      }
    }
  }
</style>
