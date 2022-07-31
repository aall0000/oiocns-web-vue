<template>
  <div>
    <!--    头部-->
    <Header />
    <!--    主体-->
    <div style="display: flex">
      <!--      侧边栏-->
      <Aside />
      <!--      内容区域home-->
      <router-view style="flex: 1"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import Header from "./header.vue";
import Aside from "./aside.vue";

</script>

<style scoped>

</style>
