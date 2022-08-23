<template>
  <div class="appLayout">
    <div class="appLayout-btn">
      <el-button type="primary">购物车</el-button>
    </div>
    <div class="appLayout-box">
      <div class="appLayout-header">我的市场</div>
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-bind="state.page"
            :pager-count="5"
            style="text-align: right; margin-top: 10px"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="appLayout-box">
      <div class="appLayout-header">我加入的市场</div>
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
  import { reactive } from 'vue'
  import Card from './components/card.vue'

  const state = reactive({
    myApp: [{}, {}, {}, {}, {}],
    page: {
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      pageSizes: [20, 30, 50], // 分页数量列表
      layout: 'total, prev, pager, next, '
    }
  })

  /**
   * el-pagination 分页配置
   */
  const handleSizeChange = (val: any) => {}
  const handleCurrentChange = (val: any) => {}
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
    display: flex;
    flex-direction: column;
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
      height: 84%;
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
      flex: 1;
      overflow: auto;
      margin-top: 10px;
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
