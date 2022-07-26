<template>
  <el-container class="pages home-wrap">
    <el-header>
      <CustomHeadr />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Menu />
      </el-aside>
      <el-container>
        <el-main class="main-wrap">
          <keep-alive v-if="$route.meta.keepAlive">
            <router-view />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" />
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import CustomHeadr from './components/CustomHeader.vue'
import Menu from './components/Menu.vue'
</script>

<style lang='scss'>
.home-wrap {

  .el-menu,
  .el-scrollbar__view {
    height: 100%;
  }

  .main-wrap{
    width: 100%;
    height: 100%;
    background-color: beige;
    position: relative;
    padding: 15px;
  }
}
</style>
