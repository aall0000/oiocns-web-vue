<template>
  <div>
    <!--    头部-->
    <Header />
    <!--    主体-->
    <div style="display: flex; border-top: 6px solid #eff0f4">
      <!--      侧边栏-->
      <mainAside style="height: 100vh" />
      <userAside />
      <!--      内容区域home-->
      <router-view style="flex: 1" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Header from '../components/customHeader.vue'
  import mainAside from '../components/mainAside.vue'
  import userAside from './userAside.vue'
</script>

<style scoped></style>
