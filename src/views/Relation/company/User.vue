<template>
    <div class="card">
      <div class="header">
        <div class="title">{{props.selectItem.label}}</div>
        <div class="box-btns">
          <div v-if="props.selectItem?.data?.typeName == '公司'">
            <el-button small link type="primary" @click="friendDialog = true">添加成员</el-button>
            <el-button small link type="primary" @click="viewApplication">查看申请</el-button>
          </div>
          <div v-if="props.selectItem?.data?.typeName == '部门' || props.selectItem?.data?.typeName == '工作组'">
            <el-button small link type="primary" @click="showAssignDialog">分配人员</el-button>
          </div>
        </div>
      </div>
      <div :style="{height:tabHeight-35+'px'}">
        <div style="width: 100%; height: 100%">
          <DiyTable
            ref="diyTable"
            :hasTableHead="true"
            :tableData="users"
            @handleUpdate="handleUpdate"
            :tableHead="tableHead"
          >
            <template #operate="scope" >
                <div v-if="props.selectItem?.data?.typeName == '公司'">
                  <el-button link type="danger" size="small" @click="removeFrom(scope.row)">操作离职</el-button>
                </div>
                <div v-if="props.selectItem?.data?.typeName == '部门' || props.selectItem?.data?.typeName == '工作组'">
                  <el-button link type="danger" size="small" @click="removeFrom(scope.row)" >移除成员</el-button>
                </div>
            </template>
          </DiyTable>
        </div>
      </div>
    </div>
  <searchFriend  v-if="friendDialog" :selectLimit='0' @closeDialog="closeDialog"  @checkFriend='checkFriend'/>

  <el-dialog v-model="assignDialog" @close="hideAssignDialog" :title="'分配人员 => ' + selectItem.label" width="50%">
    <el-input v-model="assignSearch" class="search" placeholder="搜索用户" @input="assignSearchChange">
      <template #prefix>
        <el-icon class="el-input__icon"><Search /></el-icon>
      </template>
    </el-input>
    <DiyTable
      ref="assignTable"
      :hasTableHead="true"
      :tableData="companyUsers"
      :options="{
        expandAll: false,
        checkBox: true,
        order: true,
        selectLimit:0,
        noPage: false
      }"
      @handleUpdate="assignTableChange"
      :tableHead="columns"
      :style="{height: '350px'}"
    >
    </DiyTable>
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
import DiyTable from '@/components/diyTable/index.vue'
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import searchFriend from '@/components/search/friend.vue'
const props = defineProps<{
  selectItem: any,     // 节点数据
  tabHeight:number,
}>()

const company = ref<any>({})

const tableHead = ref([
  {
    prop: 'code',
    label: '账号',
    width: '180',
  },
  {
    prop: 'name',
    label: '姓名',
    width: '240',
    name:'name',
  },
  {
    prop: 'team.code',
    label: '手机号',
    width: '330',
    name:'teamCode',
  },
  {
    prop: 'team.remark',
    label: '座右铭',
    width: '330',
    name:'teamRemark',
  },
  {
    type: 'slot',
    label: '操作',
    fixed: 'right',
    align: 'center',
    width: '150',
    name: 'operate'
  }
])
let users = ref<any>([])

const columns = ref([
  {
    prop: 'code',
    label: '账号',
    width: '180',
  },
  {
    prop: 'name',
    label: '姓名',
    width: '240',
    name:'name',
  },
  {
    prop: 'team.code',
    label: '手机号',
    width: '330',
    name:'teamCode',
  }
])
let companyUsers = ref<any>([])


const router = useRouter()
// 表格数据加载状态
const loading = ref<boolean>(false)
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const diyTable = ref(null)
const assignTable = ref(null)

// 加载用户
const getUsers = ()=>{
  const data = props.selectItem?.data
  if(data){
    let url = '';
    if(data.typeName == '公司'){
      url = 'getPersons'
      company.value = JSON.parse(JSON.stringify(data))
    } else if(data.typeName == '部门'){
      url = 'getDepartmentPersons'
    } else if(data.typeName == '工作组'){
      url = 'getJobPersons'
    }
    $services.company[url]({
      data: {
        id: props.selectItem.id,
        offset: (pageStore.currentPage-1)*pageStore.pageSize,
        limit: pageStore.pageSize
      }
    }).then((res: ResultType) => {
      if (res.code == 200 && res.success) {
        users.value = res.data.result;
        pageStore.total = res.data.total;
        diyTable.value.state.loading = false
        diyTable.value.state.page.total = pageStore.total;
      }
    })
  }
}

const friendDialog = ref<boolean>(false)
const closeDialog = ()=>{
   friendDialog.value = false;
}
type arrList = {
  id:string
}
const checkFriend=(val:any)=>{
  if(val.value.length>0){
    let arr:Array<arrList> =[]
    val.value.forEach((element:any) => {
      arr.push(element.id)
    });
    pullPerson(arr)
  }else{
    friendDialog.value = false;
  }
}
// 搜索人

const inviter = ref('')
const pullPersonDialog = ref<boolean>(false)
const hidePullPreson = () => {
  inviter.value = ''
  pullPersonDialog.value = false
}

//邀请加入单位
const pullPerson = (arr:any) => {
  $services.company
    .pullPerson({
      data: {
        id: props.selectItem.id,
        targetIds: arr
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
      friendDialog.value = false;
    })
}
const handleUpdate = (page: any)=>{
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  getUsers()
}

//查看申请
const viewApplication = (row: any) => {
  router.push('/cardDetail')
}

// 移除
const removeFrom = (row: any) =>{
  let url: string;
  let title: string;
  if(props.selectItem?.data?.typeName == '公司'){
    url = 'removeFromCompany'
    title = `操作离职，将删除 ${row.name} 在单位的信息，确定操作吗？`
  } else if(props.selectItem?.data?.typeName == '部门'){
    url = 'removeFromDepartment'
    title = `确定把 ${row.name} 从当前部门移除吗？`
  } else if(props.selectItem?.data?.typeName == '工作组'){
    url = 'removeFromJob'
    title = `确定把 ${row.name} 从当前部门移除吗？`
  }
  ElMessageBox.confirm(
    title,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
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
  })
  .catch(() => {
    console.log('移除成功!')
  })
}

// 加载公司所有用户
const getCompanyUsers = (filter?: string)=>{
  let data = {
    id: company.value.id,
    offset: (pageStore.currentPage-1)*pageStore.pageSize,
    limit: pageStore.pageSize
  }
  if(filter && filter.trim() != ''){
    data = {...data, ...{filter}}
  }
  if(company.value){
    $services.company.getPersons({
      data,
    }).then((res: ResultType) => {
      if (res.code == 200 && res.success) {
        // 去除已分配到当前部门或者工作组的用户
        let us = res.data.result || []
        let userIds =  []
        if(users.value){
          userIds = users.value.map((u: any) => u.id);
        }
        const set: Set<string> = new Set(userIds)
        companyUsers.value = us.filter((u: any) => !set.has(u.id))
        pageStore.total = res.data.total - userIds.length
        assignTable.value.state.loading = false
        assignTable.value.state.page.total = pageStore.total;
      }
    })
  }
}

const assignDialog = ref<boolean>(false)
const hideAssignDialog = ()=>{
  assignDialog.value = false
  getCompanyUsers()
}

const showAssignDialog = ()=>{
  assignDialog.value = true
  getCompanyUsers()
}

// 过滤数据
const assignSearch = ref('')
const assignTableChange = (page: any)=>{
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  getCompanyUsers()
}

// 分配页面搜索用户变化
const assignSearchChange = (e: string)=>{
  getCompanyUsers(e)
}


// 分配人员
const assign = () => {
  const userIds = assignTable?.value?.state?.multipleSelection.map((u: any) => u.id);
  if(props.selectItem?.data?.typeName == '部门'){
    assignDepartment(props.selectItem.id, userIds)
  } else if(props.selectItem?.data?.typeName == '工作组'){
    assignJob(props.selectItem.id, userIds)
  }
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
      getUsers()
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
      getUsers()
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

  .search {
    width: 50%;
  }
}
</style>
