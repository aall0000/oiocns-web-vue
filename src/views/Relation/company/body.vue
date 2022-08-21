<template>
    <div class="card">
      <div class="header">
        <div class="title">人员列表</div>
        <div class="box-btns">
          <el-button small link type="primary" @click="dialogVisible = true">添加成员</el-button>
          <el-button small link type="primary" @click="handleGoback">查看申请(5)</el-button>
          <el-button small link type="primary" @click="dialogVisible = true">操作离职</el-button>
          <el-button small link type="primary" @click="dialogVisible = true">分配人员</el-button>
          <el-button small link type="primary" @click="dialogVisible = true">移除人员</el-button>
        </div>
      </div>

      <el-table
        :data="pageStore.tableData"
        stripe
        :border="true"
        style="width: 100%; margin: 0 auto"
        height="390"
        :cell-style="{ 'text-align': 'center' }"
        @select="handleSelect"
      >
        <el-table-column type="selection" />
        <el-table-column prop="code" label="账号" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="trueName" label="姓名" />
        <el-table-column prop="teamCode" label="手机号" />
        <el-table-column prop="remark" label="座右铭" />
        <el-table-column label="操作" width="100" />
      </el-table>

      <el-pagination class="page-pagination" @size-change="(e: any) => handlePaginationChange(e, 'limit')"
        @current-change="(e: any) => handlePaginationChange(e, 'current')" background
        :page-sizes="[10, 20, 50, 100]" v-model:currentPage="pagination.current" v-model:page-size="pagination.limit"
        layout="total,prev, pager, next," :total="pageStore.total" />
    </div>



  <el-dialog v-model="dialogVisible" title="请输入单位名称" width="30%">
    <el-form-item label="单位名称">
      <el-input v-model="fromData.departmentName" placeholder="请输入单位名称" clearable />
    </el-form-item>
    <el-form-item label="单位编号">
      <el-input v-model="fromData.departmentTeamCode" placeholder="请输入单位编号" clearable />
    </el-form-item>
    <el-form-item label="单位简介">
      <el-input v-model="fromData.departmentTeamRemark" placeholder="请输入单位简介" type="textarea" clearable />
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCompanyToGroup">确认</el-button>
      </span>
    </template>
  </el-dialog>


</template>
<script lang='ts' setup>
import API from "@/services"
import { onMounted, reactive, toRefs, ref } from 'vue';
import { useUserStore } from '@/store/user'
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';

const store = useUserStore()
const router = useRouter()
const { workspaceData } = storeToRefs(store)
// 表格分页数据
const pagination: { current: number, limit: number } = reactive({ current: 1, limit: 10 })
// 表格数据加载状态
const loading = ref<boolean>(false)
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})
let groupId = ref<any>();

// 获取表格数据
const getTableList = async () => {
  if(groupId.value){
    loading.value = true
    // Todo 判断 getSubgroupCompanies
    const { data, success } = await API.company.getGroupCompanies({
      data: {
        id: groupId.value,
        offset: (pagination.current - 1) * pagination.limit,
        limit: pagination.limit
      }
    })
    loading.value = false
    if (success) {
      const { result = [], total = 0 } = data
      pageStore.tableData = result
      pageStore.total = total
    }
  }
}

// 删除表格信息
const handleDelItem = async (row: any) => {
  console.log("row=====", row);                // Todo
  const { success } = await API.company.removeFromGroup({
    data: {
      id: row.id,
    }
  })
  if (success) {
    getTableList()
  }
}

// 处理表格分页操作
const handlePaginationChange = (newVal: number, type: "current" | 'limit') => {
  pagination[type] = newVal
  getTableList()
}
//弹窗信息
const fromData = reactive({
  departmentName: "",
  departmentTeamName: "",
  departmentTeamCode: "",
  departmentTeamRemark: ""
})
// 弹窗显示
const dialogVisible = ref<boolean>(false)

onMounted(() => {
  groupId.value= router.currentRoute.value.query.id;
  getTableList()
})

//选中人员
let selectArr = reactive<Array<any>>([])
const handleSelect = (key: Array<any>) => {
  selectArr = key
  console.log('selectArr', selectArr)
}


// 提交弹窗表单
const addCompanyToGroup = () => {
  API.company
    .createDepartment({
      data: {
        id: workspaceData.value.id,
        code: fromData.departmentTeamCode,
        name: fromData.departmentName,
        parentId: 0,
        teamName: fromData.departmentTeamName,
        teamRemark: fromData.departmentTeamRemark
      }
    })
    .then(() => {
      getTableList()
      dialogVisible.value = false
    })
}


// 返回上一页
const handleGoback = () => {
  router.go(-1)
}
</script>

<style lang='scss' scoped>

.card {
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 10px;

  .header {
    display: flex;

    .title {
      text-align: left;
      font-size: 16px;
      width: 30%;
      font-weight: bold;
    }
    .box-btns {
      text-align: right;
      padding-right: 14px;
      padding-bottom: 10px;
      width: 70%;
    }
  }

  .page-pagination {
    padding: 10px;
    display: flex;
    justify-content: end;
  }
}
</style>
