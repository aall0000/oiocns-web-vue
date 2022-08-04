<template>
  <div class="test">
    <el-input class="input" type="text" name="" id="" placeholder="请输入搜索内容" v-model="msg" />
    <el-button class="btn" @click="searchMsg(msg)">搜索</el-button>
    <ul class="result" v-for="(item, index) in tableData" :key="index">
      <li class="line">
        <span>{{ item.name }}</span>
        <el-button @click="add(item.id)">加入单位</el-button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import $services from '@/services'
  import { onMounted, reactive } from 'vue'
  import { ref } from 'vue'
  import { useUserStore } from '@/store/user'
  import { da } from 'element-plus/es/locale/index.js'
  const store = useUserStore()
  const tableData = ref([])
  console.log('test')
  const msg = ref<string>()

  const add = (id: any) => {
    let token = sessionStorage.getItem('TOKEN')
    $services.person
      .applyJoin({
        data: {
          id: id
        },
        headers: { Authorization: token }
      })
      .then((res: ResultType) => {
        console.log('申请加入单位成功', res)
      })
  }

  async function searchMsg(msg: string) {
    let token = sessionStorage.getItem('TOKEN')
    // console.log(offset, pageSize)

    const { data, success } = await $services.company.searchCompany({
      data: {
        text: msg,
        offset: 0,
        limit: 10
      },
      headers: { Authorization: token }
    })
    if (success === true) {
      const { result = [], total = 0 } = data
      tableData.value = result
      console.log('taleData', tableData)
      console.log('查询单位成功', data)
    }
  }
</script>
<style lang="scss" scoped>
  .test {
    width: 100%;
    height: 100vh;
    background-color: antiquewhite;
    .input {
      width: 500px;
      height: 50px;
      border-bottom: 1px solid #ccc;
    }
    .btn {
      width: 50px;
      height: 50px;
    }
    .result {
      .line {
        width: 500px;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
      }
    }
  }
</style>
