<template>
  <div id='index-wrap'>
    村上春树{{ aa }}
    <svg-icon icon-name="dog"></svg-icon>
    <el-button @click="fetchRequest">请求</el-button>
  </div>
</template>

<script lang="ts" setup>
// 写法一 :引入api文件
import $services from '@/services'
// 写法二 :提取注入的全局方法文件 getCurrentInstance,onMounted;需要特别注意的是ctx代替this只适用于开发阶段，如果将项目打包放到生产服务器上运行，就会出错，ctx无法获取路由和全局挂载对象的
import { ref, getCurrentInstance, onMounted } from 'vue';

const aa = ref(9)
const { proxy } = getCurrentInstance()
onMounted(() => {
  console.log('proxy', proxy.$services);
})
const fetchRequest = () => {
  $services.person.login({
    "data": {
      "account": "realVeer",
      "password": "1E!2w@3q#"
    }
  }).then(res => {
    console.log('登录', res);
  })
}
</script>

<style lang='scss'>
#index-wrap {}
</style>
