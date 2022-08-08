<script setup lang="ts">
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
</script>

<template>
  <div class="pages" @contextmenu.prevent>
    <router-view />
  </div>
</template>

<style scoped>
</style>
