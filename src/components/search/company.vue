<template>

  <el-dialog v-model="dialogVisible" append-to-body	:before-close="closeDialog" title="搜索单位" width="60%">
    <el-input v-model="value" @input="remoteMethod" placeholder="请输入" />
    <diytab
      ref="diyTable"
      :hasTableHead="true"
      :tableData="list"
      :options="options"
      @handleUpdate="handleUpdate"
      @selectionChange="selectionChange"
      :tableHead="tableHead"
    >
     <template #remark="scope">
      <div class="remark-box"> {{ scope.row.remark }}</div>
    </template>
    </diytab>
    <div class="foot">
        <el-button type="primary" @click="checkFriend">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import diytab from '@components/diyTable/index.vue'
  import $services from '@/services'
  import { ref, reactive ,onMounted ,nextTick} from 'vue'
  import { ElMessage } from 'element-plus'


  const dialogVisible = ref<boolean>(true)
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  
  const emit = defineEmits([
    'checkFriend',
    'closeDialog'
  ])

  interface ListItem {
    code: string
    name: string
    trueName: string
    teamCode: string
    remark: string
  }

  const list = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)
  onMounted(() => {
    remoteMethod()
  })
  const remoteMethod = () => {
    
    if (value.value) {
      // loading.value = true
      $services.company
        .searchCompany({
          data: {
            filter: value.value,
            offset: (pageStore.currentPage - 1) * pageStore.pageSize,
            limit: pageStore.pageSize
          }
        })
        .then((res: ResultType) => {
          let arr: any = []

          if (res.code == 200) {
            if (res.data.result != undefined) {
              let states = res.data.result
              if(states){
                states.forEach((el: any) => {
                  let obj = {
                      id:el.id,
                      code: el.code,
                      name: el.name,
                      trueName: el.team.name,
                      teamCode: el.team.code,
                      remark: el.team.remark
                  }
                  arr.push(obj)
                })
                pageStore.total = res.data.total;
                diyTable.value.state.page.total = pageStore.total
              }else{
                
              }
              
            }
            list.value = arr
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
          // diyTable.value.state.loading = false
        })
    } else {
      list.value = []
      nextTick(()=>{
        console.log(diyTable.value)
        // diyTable.value.state.loading = false    
      })
    }
  }

  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    remoteMethod()
  }
  const checkList = reactive<any>([])
  const selectionChange = (val:any)=>{
    checkList.value = val
  }
  const checkFriend = () =>{
    emit('checkFriend',checkList)
  }

  const closeDialog = ()=>{
    emit('closeDialog',false)
  }
  const tableHead = ref([
    {
      prop: 'name',
      label: '单位名称',
      width: '200',
      name: 'name'
    },

    {
      prop: 'code',
      label: '统一社会信用代码',
      width: '200',
      name: 'code'
    },
    {
      type: 'slot',
      prop: 'remark',
      label: '单位简介',
      name: 'remark'
    },
  ])
  const options = ref<any>({
    checkBox: true,
    order: true,
    selectLimit:1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
})
</script>
<style>
  ::v-deep .el-checkbox{
    display: none !important;
  }
</style>
<style lang="scss" scoped>
  .foot{
    display: flex;
    width: 100%;
    margin-top: 30px;
    justify-content: center;
  }
  .remark-box{
    overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2;
  }
</style>
