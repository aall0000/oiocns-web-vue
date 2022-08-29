<template>
  <div class="card" ref="cardHeight">
    <div class="header">
      <div class="title">{{props.selectItem.label}}</div>
      <div class="box-btns">
        <div v-if="props.selectItem?.data?.typeName == '集团'">
          <el-button small link type="primary" @click="pullCompanysDialog = true">添加单位</el-button>
          <el-button small link type="primary" @click="viewApplication">查看申请</el-button>
        </div>
        <div v-if="props.selectItem?.data?.typeName == '子集团' || props.selectItem?.data?.typeName == '工作组'">
          <el-button small link type="primary" @click="showAssignDialog">分配单位</el-button>
        </div>
      </div>
    </div>

    <div :style="{height:tabHeight-30+'px'}">
      <div style="width: 100%; height: 100%">
        <DiyTable
          ref="diyTable"
          :hasTableHead="true"
          :tableData="companies"
          @handleUpdate="handleUpdate"
          :tableHead="tableHead"
        >
          <template #operate="scope" >
            <el-button link type="danger" size="small" :disabled="scope.row.id == selectItem.data?.belongId" @click="removeFrom(scope.row)">移除单位</el-button>
          </template>
        </DiyTable>
      </div>
    </div>
  </div>
  <searchCompany  v-if="pullCompanysDialog" :selectLimit='0' :serachType="3" @closeDialog="closeDialog"  @checksSearch='checksSearch'/>

  <el-dialog v-model="assignDialog" @close="hideAssignDialog" :title="'分配单位 => ' + selectItem.label" width="50%">
    <el-input v-model="assignSearch" class="search" placeholder="搜索单位" @input="assignSearchChange">
      <template #prefix>
        <el-icon class="el-input__icon"><Search /></el-icon>
      </template>
    </el-input>
    <DiyTable
      ref="assignTable"
      :hasTableHead="true"
      :tableData="groupCompanies"
      :options="{
        expandAll: false,
        checkBox: true,
        order: true,
        noPage: false,
        selectLimit: 20
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
import { onMounted, reactive, ref, watch ,nextTick} from 'vue';
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';
import searchCompany from '@/components/searchs/index.vue'

const props = defineProps<{
  selectItem: any,     // 节点数据
}>()
const rootGroup = ref<any>({})
// 表格用户数据
let companies = ref<any>([])

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

const tableHead = ref([
  {
    prop: 'name',
    label: '名称',
    name:'name',
  },
  {
    prop: 'code',
    label: '编码',
  },
  {
    prop: 'team.code',
    label: '简介',
    name:'teamCode',
  },
  {
    type: 'slot',
    label: '操作',
    fixed: 'right',
    align: 'center',
    name: 'operate'
  }
])

const columns = ref([
    {
    prop: 'name',
    label: '名称',
    width: '240',
    name:'name',
  },
  {
    prop: 'code',
    label: '编码',
    width: '180',
  },
  {
    prop: 'team.code',
    label: '简介',
    width: '330',
    name:'teamCode',
  }
])
let groupCompanies = ref<any>([])

const handleUpdate = (page: any)=>{
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  getCompanies()
}

// 加载单位
const getCompanies = ()=>{
  const data = props.selectItem?.data
  if(data){
    let url = '';
    if(data.typeName == '集团'){
      url = 'getGroupCompanies'
      rootGroup.value = JSON.parse(JSON.stringify(data))
    } else if(data.typeName == '子集团'){
      url = 'getSubgroupCompanies'
    }
    $services.company[url]({
      data: {
        id: props.selectItem.id,
        offset: (pageStore.currentPage-1)*pageStore.pageSize,
        limit: pageStore.pageSize
      }
    }).then((res: ResultType) => {
      if (res.code == 200 && res.success) {
        companies.value = res.data.result;
        pageStore.total = res.data.total;
        diyTable.value.state.loading = false
        diyTable.value.state.page.total = pageStore.total;
      }
    })
  }
}
const pullCompanysDialog = ref<boolean>(false)
const closeDialog = ()=>{
   pullCompanysDialog.value = false;
}
type arrList = {
  id:string
}
const checksSearch=(val:any)=>{
  if(val.value.length>0){
    let arr:Array<arrList> =[]
    val.value.forEach((element:any) => {
      arr.push(element.id)
    });
    pullCompanys(arr)
  }else{
    pullCompanysDialog.value = false;
  }
}
interface ListItem {
  value: string
  label: string
}

//拉单位进集团
const pullCompanys = (arr:any) => {
  $services.company
    .pullCompanys({
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
        getCompanies()
      }
      pullCompanysDialog.value = false
    })
}

//查看申请
const viewApplication = (row: any) => {
  router.push('/cardDetail')
}

// 移除
const removeFrom = (row: any) =>{
  let url: string;
  let title: string;
  if(props.selectItem?.data?.typeName == '集团'){
    url = 'removeFromGroup'
    title = `确定把 ${row.name} 从集团移除吗？`
  } else if(props.selectItem?.data?.typeName == '子集团'){
    url = 'removeFromSubgroup'
    title = `确定把 ${row.name} 从子集团移除吗？`
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
      getCompanies()
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

// 加载根集团所有单位
const getGroupCompanies = (filter?: string)=>{
  let data = {
    id: rootGroup.value.id,
    offset: (pageStore.currentPage-1)*pageStore.pageSize,
    limit: pageStore.pageSize
  }
  if(filter && filter.trim() != ''){
    data = {...data, ...{filter}}
  }
  if(rootGroup.value){
    $services.company.getGroupCompanies({
      data,
    }).then((res: ResultType) => {
      if (res.code == 200 && res.success) {
        // 去除已分配到当前部门或者工作组的用户
        let us = res.data.result || []
        let companyIds =  []
        console.log('companies.value', companies.value)
        if(companies.value){
          companyIds = companies.value.map((c: any) => c.id);
        }
        const set: Set<string> = new Set(companyIds)
        groupCompanies.value = us.filter((u: any) => !set.has(u.id))
        pageStore.total = res.data.total - companyIds.length
        assignTable.value.state.loading = false
        assignTable.value.state.page.total = pageStore.total;
      }
    })
  }
}

const assignDialog = ref<boolean>(false)
const hideAssignDialog = ()=>{
  assignDialog.value = false
  getGroupCompanies()
}

const showAssignDialog = ()=>{
  assignDialog.value = true
  getGroupCompanies()
}

// 过滤数据
const assignSearch = ref('')
const assignTableChange = (page: any)=>{
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  getGroupCompanies()
}

// 分配页面搜索用户变化
const assignSearchChange = (e: string)=>{
  console.log('eeeeeeeeeeeee', e)
  getGroupCompanies(e)
}


// 分配单位到子集团
const assign = () => {
  const companyIds = assignTable?.value?.state?.multipleSelection.map((u: any) => u.id);
  const data = { id: props.selectItem.id, targetIds: companyIds }
  $services.company
    .assignSubgroup({ data })
    .then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '分配成功',
          type: 'success'
        })
        hideAssignDialog()
      }
      getCompanies()
    })
}

const cardHeight = ref(null)
const tabHeight = ref<number>(100)
onMounted(() => {
  getCompanies()
  nextTick(()=>{
    let headerHeight = cardHeight.value?.clientHeight
    console.log('let headerHeight = cardHeight.value?.clientHeight',headerHeight)
    tabHeight.value = headerHeight
  })
})


watch(props, () => {
  getCompanies()
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
