<template>
  <div class="header">返回区域</div>

  <div class='deptDetail-wrap'>
    <div class="detail-box box">
      <ul class="box-btns flex justify-between">
        <li class="box-btns-title">部门列表</li>
        <li class="box-btns-con ">
          <el-button small link type="primary" @click="handleGoback">返回</el-button>
          <!-- <el-button small link type="danger">删除</el-button> -->
          <el-button small link type="primary" @click="dialogVisible = true">新增</el-button>
        </li>
      </ul>
      <el-table class="box-table" v-loading="loading" :data="pageStore.tableData" stripe border
        header-row-class-name="table_header_class" @select="handleSelect">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="序号">
          <template #default="{ $index }">
            {{ pagination.limit * (pagination.current - 1) + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="thingId" label="部门编码" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-popconfirm title="确认删除?" @confirm="handleDelItem(row)" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-pagination" @size-change="(e: any) => handlePaginationChange(e, 'limit')"
        @current-change="(e: any) => handlePaginationChange(e, 'current')" small background
        :page-sizes="[10, 20, 50, 100]" v-model:currentPage="pagination.current" v-model:page-size="pagination.limit"
        layout="总数->, total,prev, pager, next," :total="pageStore.total" />
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="请输入部门名称" width="30%">
    <el-form-item label="部门名称">
      <el-input v-model="fromData.departmentName" placeholder="请输入部门名称" clearable />
    </el-form-item>
    <el-form-item label="部门编号">
      <el-input v-model="fromData.departmentTeamCode" placeholder="请输入部门编号" clearable />
    </el-form-item>
    <el-form-item label="部门简介">
      <el-input v-model="fromData.departmentTeamRemark" placeholder="请输入部门简介" clearable />
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFriends">确认</el-button>
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
import { nextTick } from "process";
const store = useUserStore()
const router = useRouter()
const { userUnitInfo, workspaceData } = storeToRefs(store)
// 表格分页数据
const pagination: { current: number, limit: number } = reactive({ current: 1, limit: 5 })
// 表格数据加载状态
const loading = ref<boolean>(false)
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})
// 获取表格数据
const getTableList = async () => {
  loading.value = true
  const { data, success } = await API.company.getDepartments({
    data: {
      id: userUnitInfo.value.id,
      offset: (pagination.current - 1) * pagination.limit,
      limit: pagination.limit
    }
  })

  if (success) {
    loading.value = false
    const { result = [], total = 0 } = data
    pageStore.tableData = result
    pageStore.total = total
  } else {
    loading.value = false
  }
}

// 删除表格信息
const handleDelItem = async (row: any) => {
  const { success } = await API.company.deleteDepartment({
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
  getTableList()
})

//选中人员
let selectArr = reactive<Array<any>>([])
const handleSelect = (key: Array<any>) => {
  selectArr = key
  console.log('selectArr', selectArr)
}


// 提交弹窗表单
const submitFriends = () => {
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
.header {
  padding: 0 14px;
  height: 40px;
  background-color: #fff;
  margin-bottom: 5px;
  line-height: 40px;
}

.deptDetail-wrap {
  flex-grow: 1;
  padding: 14px;
  background-color: #fff;

  .box-btns {
    padding-bottom: 10px;
  }

  .detail-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .box-table {
      flex-grow: 1;
    }

    .page-pagination {
      padding: 10px 0;
      display: flex;
      justify-content: end;
    }
  }
}
</style>
