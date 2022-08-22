<template>
    <div class="card">
      <div class="header">
        <div class="title">{{props.selectItem.label}}</div>
        <div class="box-btns">
          <div v-if="props.selectItem?.data?.typeName == '公司'">
            <el-button small link type="primary" @click="pullPersonDialog = true">添加成员</el-button>
            <el-button small link type="primary" @click="viewApplication">查看申请</el-button>
          </div>
          <div v-if="props.selectItem?.data?.typeName == '部门' || props.selectItem?.data?.typeName == '工作组'">
            <el-button small link type="primary" @click="assignDialog = true">分配人员</el-button>
          </div>
        </div>
      </div>

      <el-table
        :data="users"
        stripe
        :border="true"
        style="width: 100%; margin: 0 auto"
        height="280px"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="selection" />
        <el-table-column prop="code" label="账号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="team.code" label="手机号" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <div v-if="props.selectItem?.data?.typeName == '公司'">
              <el-popconfirm
                title="确认删除?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="removeFrom(row)"
              >
                <template #reference>
                  <el-button link type="danger" size="small">操作离职</el-button>
                </template>
              </el-popconfirm>
            </div>

            <div v-if="props.selectItem?.data?.typeName == '部门' || props.selectItem?.data?.typeName == '工作组'">
              <el-button link type="danger" size="small">分配人员</el-button>
              <el-popconfirm
                title="确认删除?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="removeFrom(row)"
              >
                <template #reference>
                  <el-button link type="danger" size="small">移除成员</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="page-pagination" @size-change="(e: any) => handlePaginationChange(e, 'limit')"
        @current-change="(e: any) => handlePaginationChange(e, 'current')" background
        :page-sizes="[10, 20, 50, 100]" v-model:currentPage="pagination.current" v-model:page-size="pagination.limit"
        layout="total,prev, pager, next," :total="pageStore.total" />
    </div>


  <el-dialog v-model="pullPersonDialog" @close="hidePullPreson" title="添加人员到单位" width="30%">
    <el-select
      v-model="inviter"
      filterable
      remote
      reserve-keyword
      placeholder="请输入要查的人或者手机号"
      :remote-method="searchPersons"
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
        <el-button type="primary" @click="pullPerson">确认</el-button>
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
let users = ref<any>([])

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
    if(data.typeName == '公司'){
      url = 'getPersons'
    } else if(data.typeName == '部门'){
      url = 'getDepartments'
    } else if(data.typeName == '工作组'){
      url = 'getJobPersons'
    }
    $services.company[url]({
      data: {
        id: props.selectItem.id,
        offset: 0,
        limit: 100
      }
    }).then((res: ResultType) => {
      if (res.code == 200 && res.success) {
        users.value = res.data.result;
      }
    })
  }
}
// 搜索人
const searchPersons = (query: string) => {
  inviterOptions.value = []
  if(!query){
    return
  }
  loading.value = true
  $services.person
    .searchPersons({data: { filter: query, offset: 0, limit: 10 }})
    .then((res: ResultType) => {
      loading.value = false
      if (res.success && res.data.result) {
        const users = res.data.result
        inviterOptions.value = users.map((u: any) => {
          return {value: u.id, label: u.name}
        })
      } else {
        ElMessage({
          message: '未找到用户!',
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
const pullPersonDialog = ref<boolean>(false)
const hidePullPreson = () => {
  inviter.value = ''
  pullPersonDialog.value = false
}
//邀请加入单位
const pullPerson = () => {
  $services.company
    .pullPerson({
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
      pullPersonDialog.value = false
    })
}

//查看申请
const viewApplication = (row: any) => {
  router.push('/cardDetail')
}

// 移除
const removeFrom = (row: any) =>{
  let url;
  if(props.selectItem?.data?.typeName == '公司'){
    url = 'removeFromCompany'
  } else if(props.selectItem?.data?.typeName == '部门'){
    url = 'removeFromDepartment'
  } else if(props.selectItem?.data?.typeName == '工作组'){
    url = 'removeFromJob'
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


// 分配人员
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
