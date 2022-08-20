<template>
  <div class="container">
    <div class="tree">
      <Tree @groupNodeClick="groupNodeClick"/>
    </div>
    <card class="content">
      <div class="info">
        <Info :group="group"/>
      </div>
      <div class="companies">
        <Companies/>
      </div>
    </card>
  </div>
</template>
<script lang="ts" setup>
  import Tree from './Tree.vue'
  import Info from './Info.vue'
  import Companies from './Companies.vue'
  import { ref } from 'vue';

  let group = ref({})

  const groupNodeClick = (group: any)=>{
    console.log("group===", group);
    group.value = group
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
