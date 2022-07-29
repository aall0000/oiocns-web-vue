<template>
  <div class="organization-wrap">
    <div class="organization-head">
      <div class="organization-type">群 / 消息 / 组织架构</div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="成员" name="first">成员</el-tab-pane>
      <el-tab-pane label="单位" name="second">单位</el-tab-pane>
      <el-tab-pane label="集团" name="third">集团</el-tab-pane>
    </el-tabs>
    <div class="content">
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
import type { TabsPaneContext } from 'element-plus'

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

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.organization-wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.organization-head {
  padding: 20px;
  background: #fff;

  .organization-type {
    font-size: 16px;
    color: #8d8d8d;
    margin-bottom: 15px;
  }

  .organization-mian {
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
