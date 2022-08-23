<template>
  <div class="container">
    <div class="tree">
      <Tree @nodeClick="nodeClick"/>
    </div>
    <div class="content" style="overflow: hidden;">
      <div class="info">
        <Info ref="info"/>
      </div>
      <div class="body">
        <Body ref="body"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Tree from './tree.vue'
  import Info from './info.vue'
  import Body from './body.vue'
  import { ref } from 'vue';

  const info = ref(null);
  const body = ref(null);

  const nodeClick = (selectItem: any)=>{
    info.value.selectItemChange(selectItem);
    body.value.selectItemChange(selectItem);
  }

</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: #f0f2f5;
  padding: 3px;
  box-sizing: border-box;
  display: flex;

  .tree {
    width: 23%;
  }
  .content{
    width: 77%;
    height: 100%;
    padding:0 3px;
    box-sizing: border-box;
    background: #f0f2f5;
    .info{
      padding: 3px;
      box-sizing: border-box;
      height: 25%;
    }
    .body{
      height: 73%;
    }
  }
}
</style>
