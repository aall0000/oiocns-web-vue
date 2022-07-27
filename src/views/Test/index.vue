<template>
  <div id='test-wrap'>
    村上春树
    <el-button @click="requestInfo">请求</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue';

// 写法一 :引入api文件
// import API from '@/services'
// 写法二 :提取注入的全局方法  getCurrentInstance,
const app = getCurrentInstance()
const API = app.appContext.config.globalProperties.$API

const requestInfo = () => {
  API.person.login({
    "data": {
      "account": "realVeer",
      "password": "1E!2w@3q#"
    }
  }).then(res => {
    console.log('登录成功', res);
  })
}
</script>

<style lang='scss'>
</style>
