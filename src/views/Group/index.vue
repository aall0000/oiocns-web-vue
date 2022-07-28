<template>
  <div class='group-wrap'>
    <!-- 导航传送门 -->
    <teleport v-if="isShow" to="#menu-teleport-target">
      <el-aside width="220px">
        <groupSideBarVue v-model:active="activeId" @addUser="handleAddUser" />
      </el-aside>
    </teleport>
    <!-- 右侧展示主体 -->
    <div class="page-right">
      <!-- 头部 -->
      <groupHeaderVue class="chart-header" />
      <!-- 聊天区域 -->
      <div class="chart-content">聊天区域1</div>
      <!-- 输入区域 -->
      <div class="chart-input">
        <groupInputBox @submitInfo="submit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="group">
import { onMounted, ref } from 'vue';
import groupSideBarVue from './components/groupSideBar.vue';
import groupHeaderVue from './components/groupHeader.vue';
import groupInputBox from './components/groupInputBox.vue'
// 是否展示导航
const isShow = ref<boolean>(false);
onMounted(() => {
  isShow.value = true
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

<style lang='scss' scoped>
.group-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #fff;

  .page-left {}

  .page-right {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    overflow: hidden;

    .chart-header {
      height: 80px;
      background-color: antiquewhite;
    }

    .chart-content {
      flex-grow: 1;
      overflow-y: auto;
      background-color: #fff;
    }

    .chart-input {
      height: 60px;
      background-color: #ccc;
    }
  }
}
</style>
