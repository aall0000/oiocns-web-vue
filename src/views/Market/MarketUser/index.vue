<template>
  <div class="marketUser">
    <div class="market-head">
      <div class="cardLeft">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="已加入" name="1"> </el-tab-pane>
          <el-tab-pane label="待审批" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="cardRight">
        <el-button type="primary">邀请</el-button>
      </div>
    </div>
    <div class="marketBody">
      <diyTable />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { TabsPaneContext } from 'element-plus'
  import diyTable from '@/components/diyTable/index.vue'
  import { ref } from 'vue'

  const activeName = ref('1')
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>

<style lang="scss" scoped>
  .marketUser {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    background-color: #eff0f4;
    .market-head {
      width: 100%;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 7%;
      padding: 0 20px;
      .cardLeft {
        display: flex;
        justify-content: flex-end;
        :deep(.el-tabs__item) {
          font-size: 20px !important;
          font-weight: 600;

          margin-left: 30px;

          border-color: #1a5773;
        }
        :deep(.el-tabs__header) {
          margin: 0;
          padding-top: 25px;
        }
      }
      .cardRight {
        display: flex;
        justify-content: flex-start;
      }
    }
    .marketBody {
      border: 10px solid #eff0f4;

      height: 93%;
      background-color: #fff;
    }
  }
</style>
