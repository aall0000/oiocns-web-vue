<template>
  <div>
    <!--    主体-->
    <div style="display: flex; border-top: 6px solid #eff0f4">
      <!--      侧边栏-->
      <userAside />
      <!--      内容区域home-->
      <router-view style="flex: 1" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import userAside from './userAside.vue'
</script>

<style scoped></style>
