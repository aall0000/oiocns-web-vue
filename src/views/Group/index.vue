<template>
  <div class='group-wrap'>
    <!-- 导航传送门 -->
    <teleport v-if="isShow" to="#menu-teleport-target">
      <el-aside class="custom-group-silder-menu" width="220px">
        <groupSideBarVue v-model:active="activeId" @addUser="handleAddUser" />
      </el-aside>
    </teleport>
    <!-- 右侧展示主体 -->
    <div class="chart-page">
      <!-- 头部 -->
      <groupHeaderVue class="chart-header" />
      <!-- 聊天区域 -->
      <groupContent class="chart-content"></groupContent>
      <!-- 输入区域 -->
      <groupInputBox class="chart-input" @submitInfo="submit" />
    </div>
    <groupDetail v-if='true' />
  </div>
</template>

<script lang="ts" setup name="group">
import { onMounted, ref } from 'vue';
import * as signalR from '@microsoft/signalr';
import groupSideBarVue from './components/groupSideBar.vue';
import groupHeaderVue from './components/groupHeader.vue';
import groupInputBox from './components/groupInputBox.vue'
import groupContent from './components/groupContent.vue'
import groupDetail from './components/groupDeatil.vue'
// 是否展示导航
const isShow = ref<boolean>(false);
onMounted(() => {
  isShow.value = true
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("/orginone/orgchat/msghub")
    .build();
  connection.start().catch((err) => document.write(err));
}) 
// 记录所选聊天对象---群或者人
const activeId = ref<number>(1);

// 添加群人员
const handleAddUser = () => {
  console.log('添加人员');

}

const submit = (value) => {
  console.log('发送消息', value.value);
}
</script>

<style lang='scss'>
.custom-group-silder-menu.el-aside {
  height: 100%;
}
</style>
<style lang='scss' scoped>
.group-wrap {
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: space-between;
  background-color: #fff;

  .chart-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    overflow: hidden;

    .chart-header {
      height: 80px;
      box-shadow: 0 1px 2px 1px rgb(229, 229, 229);
      z-index: 2;
    }

    .chart-content {
      flex-grow: 1;
      overflow-y: auto;
      background-color: #fff;
    }

    .chart-input {
      height: max-content;
      min-height: 120px;

      .el-textarea__inner {
        color: #fff;
      }
    }
  }
}
</style>
