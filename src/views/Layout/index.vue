<template>
  <el-container class="pages home-wrap">
    <el-header class="page-header">
      <CustomHeadr />
    </el-header>
    <el-container>
        <!-- <Menu /> -->
        <div id="menu-teleport-target"/>

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
  .page-header {
    height: 58px;
    box-shadow: 0px 5px 3px 1px #e0e0e0;
    // border-bottom: 1px solid #d7d7d7;
    margin-bottom: 2px;
  }

  .main-wrap {
    background: rgb(240, 242, 245);
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
  }
}
</style>
