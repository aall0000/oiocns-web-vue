<template>
  <div class="userUnit">
    <div class="pageHeader">
      <el-breadcrumb separator="/" class="header">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/unitMsg">信息设置</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/affiliatedGroups">关联集团</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
          <div class="body">
            <GroupsAdd types="全部" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="创建的" name="second">
          <div class="body">
            <GroupsAdd types="创建的" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="已加入" name="third">
          <div class="body">
            <GroupsAdd types="已加入" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottom">
      <span class="content">Copyright @2021 资产云开放协同创新中心 主办单位：浙江省财政厅</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  import GroupsAdd from '../components/groups.vue'

  const activeName = ref<string>('first')

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>
<style lang="scss" scoped>
  .userUnit {
    .pageHeader {
      width: 100%;
      height: 40px;
      background-color: #fff;
      .header {
        margin-top: 20px;
        margin-left: 30px;
      }
    }
    .title {
      :deep(.el-tabs__item) {
        font-size: 20px !important;
        font-weight: 600;
        margin-left: 30px;

        border-color: #1a5773;
      }
      :deep(.el-tabs__header) {
        margin: 0;
      }
      .body {
        height: 600px;
        width: 100%;
        border-left: 10px solid #eff0f4;
        border-top: 16px solid #eff0f4;
        border-right: 16px solid #eff0f4;
        display: flex;
      }
    }
    .bottom {
      height: calc(100vh - 770px);
      background-color: #eff0f4;
      display: flex;
      .content {
        margin: auto;
        color: #aaa;
      }
    }
  }
</style>
