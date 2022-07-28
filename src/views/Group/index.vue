<template>
  <div class='group-wrap'>
    <teleport v-if="isShow" to="#menu-teleport-target">
      <el-aside width="220px">
        <groupSideBarVue />
      </el-aside>
    </teleport>
    <div class="page-right">
      <!-- 头部 -->
      <groupHeaderVue />
      <!-- 聊天区域 -->

      <h1>聊天区域</h1>
      <!-- 输入区域 -->
      <h1>输入区域</h1>
    </div>
  </div>
</template>

<script lang="ts" setup name="group">
import { onMounted, ref } from 'vue';
import groupSideBarVue from './components/groupSideBar.vue';
import groupHeaderVue from './components/groupHeader.vue'
const isShow = ref<boolean>(false);
onMounted(() => {
  isShow.value = true
})
</script>

<style lang='scss' scoped>
.group-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #fff;

  .page-left {}

  .page-right {
    flex-grow: 1;
  }
}
</style>
