<template>
  <el-container class="pages home-wrap">
    <el-header>
      <CustomHeadr />
    </el-header>
    <el-container>
      <el-aside width="220px">
        <Menu />
      </el-aside>
      <el-container>
        <el-main class="main-wrap">
          <keep-alive v-if="$route.meta.keepAlive">
            <router-view />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" />
        </el-main>
        <el-footer>Copyright 2021 资产云开放协同创新中⼼ 主办单位：浙江省财政厅</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import CustomHeadr from './components/CustomHeader.vue'
import Menu from './components/Menu.vue'
</script>

<style lang='scss'>
.el-footer {
  background: rgb(240, 242, 245);
  justify-content: center;
  display: flex;
  align-items: center;
}
.home-wrap {
  .el-menu,
  .el-scrollbar__view {
    height: 100%;
  }

  .main-wrap {
    background: rgb(240, 242, 245);
    width: 100%;
    height: 100%;
    position: relative;
    padding: 15px;
  }
}
</style>
