<template>
  <div class="container">
    <div class="tree">
      <Tree @nodeClick="nodeClick"/>
    </div>
    <card class="content">
      <div class="info">
        <Info ref="info"/>
      </div>
      <div class="body">
        <Body ref="body"/>
      </div>
    </card>
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
  display: flex;

  .tree {
    width: 23%;
  }
  .content{
    width: 77%;
    height: 100%;
    padding: 3px;
    background: #f0f2f5;
    .info{
      padding: 3px;
    }
    .body{
      height: 75%;
    }
  }
}
</style>
