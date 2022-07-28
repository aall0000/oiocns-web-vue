<template>
  <div class="organization-wrap">
    <div class="thing-head">
      <div class="thing-type">群 / 消息 / 组织架构</div>
    </div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">成员</el-menu-item>
      <el-menu-item index="2">单位</el-menu-item>
      <el-menu-item index="3">集团</el-menu-item>
    </el-menu>
    <div class="content">
      <div class="search">
        <el-input class="input" v-model="input" placeholder="Please input" />
        <div class="edit">
          <el-button type="primary">新建代办</el-button>
          <el-button>删除代办</el-button>
          <el-button>完成代办</el-button>
        </div>
      </div>
      <div class="tab-list">
        <el-table :data="tableData" stripe style="width: 100%" @select="select">
          <el-table-column prop="date" type="selection" width="180" />
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" :filters="[
            { text: '2016-05-01', value: '2016-05-01' },
            { text: '2016-05-02', value: '2016-05-02' },
            { text: '2016-05-03', value: '2016-05-03' },
            { text: '2016-05-04', value: '2016-05-04' }
          ]" />
          <el-table-column prop="address" label="Address" :filter-method="filterHandler" />
        </el-table>
      </div>
      <div class="page">
        <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
var tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
const activeIndex = ref('1')
const input = ref(1)
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
var filterHandler = () => { }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.organization-wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.thing-head {
  padding: 20px;
  background: #fff;

  .thing-type {
    font-size: 16px;
    color: #8d8d8d;
    margin-bottom: 15px;
  }

  .thing-mian {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    display: flex;
    justify-content: space-between;
  }
}

.content {
  background: #f0f2f5;
  padding: 20px;

  .search {
    background: #fff;
    padding: 20px;
    display: flex;
    justify-content: space-between;

    .input {
      width: 200px;
    }

    .edit {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page {
    background: #fff;
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 20px;
  }
}
</style>
