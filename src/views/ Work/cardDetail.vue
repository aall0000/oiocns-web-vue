<template>
  <div class="thing">
    <div class="thing-head">
      <div class="thing-type">事 / 任务卡片 / 查看详情</div>
      <div class="thing-mian">
        <div class="thing-setting">工作台</div>
      </div>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      style="height: 45px; padding-left: 20px"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">申请</el-menu-item>
      <!--  <el-menu-item index="1">待办</el-menu-item>
      <el-menu-item index="2">已办</el-menu-item>
      <el-menu-item index="3">已完成</el-menu-item>
      <el-menu-item index="4">我发起的</el-menu-item>
      <el-menu-item index="5">已逾期</el-menu-item> -->
    </el-menu>
    <div class="content">
      <div class="search">
        <!-- <el-input class="input" v-model="input" placeholder="Please input" /> -->
        <div class="edit">
          <!-- <el-button type="primary" color="#153ec9">新建代办</el-button>
          <el-button>拒绝代办</el-button>
          <el-button>完成代办</el-button> -->
        </div>
      </div>
      <div class="tab-list">
        <el-table :data="tableData" stripe style="width: 100%" @select="select" :locale="zhCn">
          <el-table-column prop="date" label="序号" type="selection" width="180" />
          <el-table-column
            prop="target.name"
            label="全部"
            width="180"
            column-key="date"
            :filters="[
              { text: '全部', value: '全部' },
              { text: '审批', value: '审批' },
              { text: '群公告', value: '群公告' }
            ]"
            :filter-method="changeSelect"
          />
          <el-table-column prop="target.typeName" label="内容" />
          <!-- <el-table-column prop="date" label="链接" /> -->
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <div v-if="scope.row.status === 200">已拒绝</div>
              <div v-else>待批</div>
            </template>
          </el-table-column>
          <el-table-column prop="target.updateTime" sortable label="发送时间" width="180" />
          <el-table-column prop="date" label="操作" width="180">
            <template #default="scope">
              <div v-if="scope.row.status === 200"></div>
              <div v-else>
                <span style="margin-right: 10px" @click="joinSuccess(scope.row)">完成</span>
                <span @click="joinRefse(scope.row)">拒绝</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, onMounted } from 'vue'
  import zhCn from 'element-plus/lib/locale/lang/zh-cn'
  import { ElMessage } from 'element-plus'
  var tableData = ref<any>([])
  const activeIndex = ref<string>('1')
  var getList = () => {
    $services.person
      .approval({
        data: {
          offset: 0,
          limit: 10
        }
      })
      .then((res: ResultType) => {
        tableData.value = res.data.result
      })
  }
  var select = () => {
    console.log('select')
  }
  var joinRefse = (item: { id: '' }) => {
    $services.person
      .joinRefuse({
        data: {
          id: item.id
        }
      })
      .then((res: ResultType) => {
        ElMessage({
          message: '拒绝成功',
          type: 'success'
        })
      })
  }
  var joinSuccess = (item: { id: '' }) => {
    $services.person
      .joinSuccess({
        data: {
          id: item.id
        }
      })
      .then((res: ResultType) => {
        ElMessage({
          message: '添加成功',
          type: 'success'
        })
      })
  }
  var changeSelect = () => {
    console.log()
  }
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  onMounted(() => {
    getList()
  })

  var filterHandler = () => {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .thing {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
  .thing-head {
    padding: 30px;
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
    .tab-list {
      span {
        cursor: pointer;
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
