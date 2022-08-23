<template>
  <div class="container">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="单位列表" name="user">
        <Companies :selectItem="selectItem"></Companies>
      </el-tab-pane>
      <el-tab-pane label="职权树" name="identity">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import Companies from './companies.vue';

const activeName = ref('user')
let selectItem = ref<any>({})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

// 获取单位树点击的信息
const selectItemChange = (data: any) => {
  selectItem.value = data;
};
defineExpose({ selectItemChange });

</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 3px;
}
.tabs {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  padding: 18px;
}

</style>
