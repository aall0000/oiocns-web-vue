<template>
  <div id='index-wrap'>
    村上春树{{ aa }}
    <svg-icon icon-name="dog"></svg-icon>
    <el-button @click="fetchRequest">请求</el-button>
  </div>
</template>

<script lang="ts" setup>
import $services from '@/services'
import { ref } from 'vue';

const aa = ref(9)
const fetchRequest = () => {
  $services.test({
    "id": 0,
    "offset": 0,
    "limit": 0
  }).then(res => {
    console.log('测试接口', res);

  })
}
</script>

<style lang='scss'>
#index-wrap {}
</style>
