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
      <el-table :data="state.tableData" stripe style="width: 98%">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="code" label="统一社会信用代码" />
        <el-table-column prop="isMain" label="是否主单位" />
        <el-table-column prop="belongId" label="管理员" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="state" label="申请状态" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
    <div class="createdBottom">
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
import $services from '@/services'
const currentPage4 = 1
const pageSize4 = 5

onBeforeMount(() => {
  fetchRequest()
})
onMounted(() => {})
const state = reactive({ tableData: [] })

async function fetchRequest() {
  let token = sessionStorage.getItem('TOKEN')
  const { data, err } = await $services.company.getJoinedCompany({
    data: {
      offset: 0,
      limit: 10
    },
    headers: { Authorization: token }
  })
  if (!err) {
    const { result, total } = data
    state.tableData = result.map((item) => {
      return { ...item, remark: item.team.remark }
    })
    console.log(state.tableData[0].belongId)

    console.log('查询单位成功', data)
  }
}
const handleDelete = (id) => {
  let token = sessionStorage.getItem('TOKEN')
  $services.company
    .companyDelete({
      data: {
        id: id
      },
      headers: {
        Authorization: token
      }
    })
    .then((res) => {
      console.log('删除单位成功', res)
      fetchRequest()
    })
}

function handleSizeChange(pageSize) {
  //改变当前每页的个数
  this.pageSize4 = pageSize
  this.load()
}
function handleCurrentChange(pageNum) {
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
