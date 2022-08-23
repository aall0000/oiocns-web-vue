<template>
  <div class="appLayout">
    <div class="appLayout-box">
      <div class="appLayout-header">应用列表</div>
      <div class="appLayout-content">
        <div class="appLayout-content__box">
          <Card
            v-for="item in state.myApp"
            style="height: 184px; width: 322px"
            class="appLayout-content__card"
          ></Card>
        </div>
        <div class="footer-pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-bind="state.page"
            :pager-count="5"
            style="text-align: right; margin-top: 10px"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import Card from './components/card.vue'
  import $services from '@/services'

  const state = reactive({
    myApp: [{}, {}, {}, {}, {}],
    page: {
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      pageSizes: [20, 30, 50], // 分页数量列表
      layout: 'total, prev, pager, next, sizes'
    },
    joinMarket: [],
    myMarket: []
  })

  onMounted(() => {
    getMyData()
    getOwnData()
  })

  const getMyData = async () => {
    state.myMarket = await $services.appstore.searchManager({
      data: {
        offset: 0,
        limit: 5,
        filter: ''
      }
    })
  }

  const getOwnData = async () => {
    state.joinMarket = await $services.appstore.searchOwn({
      data: {
        offset: 0,
        limit: 5,
        filter: ''
      }
    })
  }

  /**
   * el-pagination 分页配置
   */
  const handleCurrentChange = (val: any) => {}
  const handleSizeChange = (val: any) => {}
</script>

<style lang="scss" scoped>
  .footer-pagination {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 10px;
  }
  .el-button {
    margin-right: 10px;
  }
  .appLayout {
    width: 100%;
    height: 100%;
    padding: 10px;
    &-btn {
      width: 100%;
      height: 60px;
      background-color: #fff;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }
    &-content {
      position: relative;
      padding: 20px;
      flex: 1;
      width: 100%;
      &__box {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      &__card {
        margin-right: 24px;
      }
      &__card:last-child {
        margin-right: unset;
      }
    }
    &-box {
      background-color: #fff;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;
    }
    &-header {
      margin: 16px 0 16px 24px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
  }
</style>
