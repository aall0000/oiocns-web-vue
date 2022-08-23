<template>
  <div class="market-layout">
    <el-card shadow="always" class="market-head flex">
      <el-button type="primary">注册</el-button>
      <el-button type="primary">订单</el-button>
      <el-button type="primary">市场</el-button>
    </el-card>
    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的应用</p>
        <li class="app-card">
          <el-card class="app-card-item" shadow="always" v-for="o in 8">
            <div class="app-card-item-con">
              <div class="app-card-item-con-top flex">
                <HeadImg name="测试" :limit="1" :isSquare="false" />
                <p>应用名称</p>
              </div>
            </div>
            <div class="app-card-item-footer">
              <el-button small>按钮1</el-button><el-button small>按钮2</el-button> </div>
          </el-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeadImg from '@/components/headImg.vue'
</script>

<style lang="scss" scoped>
  .market-layout {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    .market-head {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
    }
    .market-content {
      padding: 20px;
      margin-top: 4px;
      height: calc(100% - 64px);
    }
    .box {
      background-color: #fff;
      &-ul {
        &-title {
          font-weight: bold;
          padding-bottom: 10px;
        }
        .app-card {
          display: flex;
          // justify-content: ;
          flex-wrap: wrap;
          &-item {
            width: 24%;
            min-width: 200px;
            height: 184px;
            margin-bottom: 10px;
            margin-right: 1%;
            // background-color: aqua;
          }
        }
      }
    }
  }
</style>
