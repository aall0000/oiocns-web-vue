<template>
    <div class="card">
      <div class="header">
        <div class="title">{{props.selectItem.label}}</div>
        <div class="box-btns">
          <div v-if="props.selectItem?.data?.typeName == '集团'">
            <el-button small link type="primary" @click="pullCompanysDialog = true">添加单位</el-button>
            <el-button small link type="primary" @click="viewApplication">查看申请</el-button>
          </div>
          <div v-if="props.selectItem?.data?.typeName == '子集团' || props.selectItem?.data?.typeName == '工作组'">
            <el-button small link type="primary" @click="assignDialog = true">分配单位</el-button>
          </div>
        </div>
      </div>

      <el-table
        :data="companies"
        stripe
        :border="true"
        style="width: 100%; margin: 0 auto"
        height="280px"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="selection" />
        <el-table-column prop="code" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="team.code" label="简介" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-popconfirm
              title="确认删除?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="removeFrom(row)"
            >
              <template #reference>
                <el-button link type="danger" size="small">移除单位</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="page-pagination" @size-change="(e: any) => handlePaginationChange(e, 'limit')"
        @current-change="(e: any) => handlePaginationChange(e, 'current')" background
        :page-sizes="[10, 20, 50, 100]" v-model:currentPage="pagination.current" v-model:page-size="pagination.limit"
        layout="total,prev, pager, next," :total="pageStore.total" />
    </div>


  <el-dialog v-model="pullCompanysDialog" @close="hidePullPreson" title="添加单位到集团" width="30%">
    <el-select
      v-model="inviter"
      filterable
      remote
      reserve-keyword
      placeholder="请输入要查找的单位"
      :remote-method="searchCompany"
      :loading="loading"
    >
      <el-option
        v-for="item in inviterOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="hidePullPreson">取消</el-button>
        <el-button type="primary" @click="pullCompanys">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="assignDialog" @close="hideAssignDialog" :title="'分配人员 => ' + selectItem.label" width="50%">
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="账号" prop="date" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="手机号" prop="name" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" placeholder="搜索" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="hideAssignDialog">取消</el-button>
        <el-button type="primary" @click="assign">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script lang='ts' setup>
import $services from '@/services'
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus';

const props = defineProps<{
  selectItem: any,     // 节点数据
}>()
// 表格用户数据
let companies = ref<any>([])

const router = useRouter()
// 表格分页数据
const pagination: { current: number, limit: number } = reactive({ current: 1, limit: 10 })
// 表格数据加载状态
const loading = ref<boolean>(false)
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})

// 处理表格分页操作
const handlePaginationChange = (newVal: number, type: "current" | 'limit') => {
  pagination[type] = newVal
  // 获取数据
}

// 加载用户
const getUsers = ()=>{
  const data = props.selectItem?.data
  if(data){
    let url = '';
    if(data.typeName == '集团'){
      url = 'getGroupCompanies'
    } else if(data.typeName == '子集团'){
      url = 'getSubgroupCompanies'
    }
    $services.company[url]({
      data: {
        id: props.selectItem.id,
        offset: 0,
        limit: 100
      }
    }).then((res: ResultType) => {
      if (res.code == 200 && res.success) {
        companies.value = res.data.result;
      }
    })
  } else {
    companies.value = []
  }
}
// 搜索单位
const searchCompany = (query: string) => {
  inviterOptions.value = []
  if(!query){
    return
  }
  loading.value = true
  $services.company
    .searchCompany({data: { filter: query, offset: 0, limit: 10 }})
    .then((res: ResultType) => {
      loading.value = false
      if (res.success && res.data.result) {
        const companies = res.data.result
        inviterOptions.value = companies.map((u: any) => {
          return {value: u.id, label: u.name}
        })
      } else {
        ElMessage({
          message: '未找到单位!',
          type: 'warning'
        })
      }
    })
}

interface ListItem {
  value: string
  label: string
}
const inviterOptions = ref<ListItem[]>([])
const inviter = ref('')
const pullCompanysDialog = ref<boolean>(false)
const hidePullPreson = () => {
  inviter.value = ''
  pullCompanysDialog.value = false
}
//拉单位进集团
const pullCompanys = () => {
  $services.company
    .pullCompanys({
      data: {
        id: props.selectItem.id,
        targetIds: [inviter.value]
      }
    })
    .then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '添加成功',
          type: 'success'
        })
        getUsers()
      }
      inviter.value = ''
      pullCompanysDialog.value = false
    })
}

//查看申请
const viewApplication = (row: any) => {
  router.push('/cardDetail')
}

// 移除
const removeFrom = (row: any) =>{
  let url;
  if(props.selectItem?.data?.typeName == '集团'){
    url = 'removeFromGroup'
  } else if(props.selectItem?.data?.typeName == '子集团'){
    url = 'removeFromSubgroup'
  }
  $services.company[url]({
    data: {
      id: props.selectItem.id,
      targetIds: [row.id]
    }
  }).then((res: ResultType) => {
    getUsers()
    if (res.success) {
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
    }
  })
}

const assignDialog = ref<boolean>(false)
const hideAssignDialog = ()=>{
  assignDialog.value = false
}

// 过滤数据
const search = ref('')
const filterTableData = computed(() => {
  return []
})


// 分配单位
const assign = () => {

}

//分配部门
const assignDepartment = (id: string, targetIds: string[]) => {
  $services.company
    .assignDepartment({
      data: { id, targetIds }
    })
    .then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '分配成功',
          type: 'success'
        })
        hideAssignDialog()
      }
    })
}
//分配工作组
const assignJob = (id: string, targetIds: string[]) => {
  $services.company
    .assignJob({
      data: { id, targetIds }
    })
    .then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '分配成功',
          type: 'success'
        })
        hideAssignDialog()
      }
    })
}


onMounted(() => {
  getUsers()
})

watch(props, () => {
  console.log('===================6666', props.selectItem)
  getUsers()
});

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
