<template>
  <div class="container">
    <div class="tree">
      <Tree @groupNodeClick="nodeClick"/>
    </div>
    <card class="content">
      <div class="info">
        <Info :group="group" ref="info"/>
      </div>
      <div class="companies">
        <Companies/>
      </div>
    </card>
  </div>
</template>
<script lang="ts" setup>
  import Tree from './tree.vue'
  import Info from './info.vue'
  import Companies from './companies.vue'
  import { ref } from 'vue';

  let group = ref({})

  const info = ref(null);

  const nodeClick = (selectItem: any)=>{
    info.value.selectItemChange(selectItem);
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
    width: 25%;
  }
  .content{
    width: 75%;
    height: 100%;
    padding: 3px;
    .info {
      height: 26%;
    }
    .companies{
      height: 74%;
    }
  }
}
</style>
