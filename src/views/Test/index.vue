<template>
  <div id="test-wrap">
    加好友
    <el-select v-model="apiType" class="m-2" placeholder="Select">
      <el-option v-for="item in typeOption" :key="item" :label="item" :value="item" />
    </el-select>
    <el-input placeholder="输入名称" v-model="inp"></el-input>
    <el-button @click="clickFun">请求</el-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue'

  // 写法一 :引入api文件
  // import API from '@/services'
  // 写法二 :提取注入的全局方法  getCurrentInstance,
  const app = getCurrentInstance()
  const API = app.appContext.config.globalProperties.$API
  const inp = ref<string>('')
  const apiType = ref<string>('person')

  const typeOption: string[] = ['person', 'cohort', 'company']

  const clickFun = async () => {
    await API[apiType.value]
      [inp.value]({
        data: {
          account: 'realVeer',
          password: '1E!2w@3q#'
        }
      })
      .then((res: ResultType) => {
        console.log(API[apiType.value], '---------->', res)
      })
  }
</script>

<style lang="scss"></style>
