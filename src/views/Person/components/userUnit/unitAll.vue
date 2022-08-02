<template>
  <div class="created">
    <div class="createdTop">
      <div class="topLeft">
        <el-input class="search" placeholder="搜索单位名" :suffix-icon="Search" />
      </div>
      <div class="topRight">
        <el-button type="primary"> 批量导入/导出</el-button>
        <el-button>查看申请记录</el-button>
      </div>
    </div>
    <div class="createdBody">
      <el-table :data="tableData" stripe style="width: 98%">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="code" label="统一社会信用代码" />
        <el-table-column prop="isMain" label="是否主单位" />
        <el-table-column prop="admin" label="管理员" />
        <el-table-column prop="time" label="创建时间" />
        <el-table-column prop="state" label="申请状态" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-button size="small">设为主单位</el-button>
            <el-button size="small" type="danger">退出组织</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="createdBottom">
      <el-pagination
        v-model:currentPage="currentPage4"
        v-model:page-size="pageSize4"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="3"
        :pager-count="10"
        layout="prev, pager, next"
        :total="1000"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { onBeforeMount } from 'vue'
import { interRes } from '@/utils/interface'
import $services from '@/services'
const currentPage4 = 1
const pageSize4 = 5

onBeforeMount(() => {
  fetchRequest()
})
onMounted(() => {})
let tableData = [
  {
    name: '华为技术有限公司',
    code: '914403001922038216',
    isMain: '是',
    admin: '338792423297781760',
    time: '2022-07-29 11:39:06',
    state: '是'
  }
]

async function fetchRequest() {
  let token = sessionStorage.getItem('TOKEN')
  await $services
    .getJoined({
      data: {
        offset: 0,
        limit: 1
      },
      headers: { Authorization: token }
    })
    .then((res: interRes) => {
      console.log('查询加入的公司', res)
      for (let i = 0; i < res.data.result.length; i++) {
        tableData[i].name = res.data.result[i].name
        tableData[i].code = res.data.result[i].code
        tableData[i].admin = res.data.result[i].belongId
        tableData[i].time = res.data.result[i].createTime
        if (res.data.result[i].status) {
          tableData[i].state = '是'
          tableData[i].isMain = '是'
        }
      }
    })
}

function handleSizeChange(pageSize: number) {
  //改变当前每页的个数
  this.pageSize4 = pageSize
  this.load()
}
function handleCurrentChange(pageNum: number) {
  //改变当前页码
  this.currentPage4 = pageNum
  this.load()
}
</script>
<style lang="scss">
.created {
  width: 100%;
  height: 100vh;

  .createdTop {
    width: 95%;
    margin: 30px;
    display: flex;
    justify-content: space-between;
    .topLeft {
      .search {
      }
    }
  }
  .createdBody {
    margin: 30px;
  }
  .createdBottom {
    position: absolute;
    right: 30px;
    bottom: 30px;
  }
}
</style>
