<template>
  <div class="market-layout">
    <el-card shadow="always" class="market-head flex">
      <el-button type="primary">注册</el-button>
      <el-button type="primary">订单</el-button>
      <el-button type="primary" @click="goMarket">市场</el-button>
    </el-card>
    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的应用</p>
        <li class="app-card">
          <ShopCard v-for="item in baseData" :info="item" :key="item.id">
            <template #footer>
              <el-button class="btn" type="primary" link small @click="hadleClick(item)"
                >设置</el-button
              >
              <el-divider direction="vertical" />
              <el-button class="btn" link small>移除应用</el-button>
            </template>
          </ShopCard>
        </li>
        <el-pagination style="justify-content: end" layout="prev, pager, next" :total="50" />
      </ul>
      <ul class="box-ul">
        <p class="box-ul-title">其他应用</p>
        <li class="app-card">
          <ShopCard v-for="item in baseData" :info="item" :key="item.id">
            <template #footer>
              <el-button class="btn" type="primary" link small>设置</el-button>
              <el-divider direction="vertical" />
              <el-button class="btn" link small>移除应用</el-button>
            </template>
          </ShopCard>
        </li>
        <el-pagination style="justify-content: end" layout="prev, pager, next" :total="50" />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ShopCard from './components/shopCard.vue'
  import { baseData } from './config'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const goMarket = () => {
    router.push({ path: '/market/markList' })
  }

  const hadleClick = (item: any) => {
    console.log('村上春树', item.name)
  }
</script>

<style lang="scss" scoped>
  :deep(.el-card__body) {
    padding: 0;
  }
  .market-layout {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    .market-head {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
      padding: 0 20px;
    }
    .market-content {
      padding: 16px;
      // margin-top: 4px;
      height: calc(100vh - 124px);
      overflow-y: auto;
    }
    .box {
      .box-ul + .box-ul {
        margin-top: 10px;
      }
      &-ul {
        background-color: #fff;
        padding: 10px 24px;

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
  }
</style>
