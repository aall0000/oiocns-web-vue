<template>
  <div class="login">
    <h1>登录页{{ aa }}</h1>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const aa = ref(9)
</script>

<style lang='scss'>
.login {}
</style>
