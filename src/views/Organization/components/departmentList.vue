<template>
  <!-- 组内成员信息 -->
  <div class="deptment-info">
    <div class="deptment-info-btns">
      <div class="left-name">
        <el-icon :size="20">
          <img class="group-icon" src="@/assets/img/group-user.png" alt="" /> </el-icon
        >组内成员
      </div>
      <div class="edit">
        <!-- <el-button type="primary" @click="addPresonDiong = true">创建职权</el-button> -->
        <el-button type="primary" @click="addPresonDialog = true">邀请成员</el-button>
        <!-- <el-button>批量导入/导出</el-button> -->
        <el-button @click="showChange">变更部门</el-button>
        <!-- <el-button>调整排序</el-button> -->
        <el-button type="danger">操作离职</el-button>
      </div>
    </div>
  </div>
  <div class="tab-list">
    <el-table :data="tableData.list" stripe style="width: 100%" height="390" @select="handleSelect">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="姓名"  />
      <el-table-column prop="code" label="成员编码" />
      <el-table-column prop="typeName" label="成员角色" />
    </el-table>
  </div>
  <div class="page-pagination">
    <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
  </div>
  <el-dialog v-model="addPresonDialog" title="邀请加入单位" width="30%">
       <el-select
        v-model="value"
        filterable
        remote
        reserve-keyword
        :placeholder="'请输入要查的人'"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addPresonDialog = false">取消</el-button>
          <el-button type="primary" @click="addPreson">确认</el-button>
        </span>
      </template>
  </el-dialog>
  <el-dialog v-model="changeDialog" title="分配部门" width="30%">
    <ul class="con tree-dept">
      <el-tree
        :props="defaultProps"
        node-key='id'
        ref="tree"
        lazy
        highlight-current
        show-checkbox
        :load="loadNode"
        @check=addDepartment
      />
    </ul>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changeDialog = false">取消</el-button>
          <el-button type="primary" @click="changePreson">确认</el-button>
        </span>
      </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  let filterHandler = () => {}
  type listType = {
    list?: Array<Object>
  }
  type selectItem = {
    name: string;
    id: string;
    $treeNodeId?:number
  }
  let tableData = reactive<listType>({})
  const props = defineProps<{
    selectItem: selectItem,
    envType:number
  }>()
  watch(
    () => props.selectItem,
    (newValue: selectItem) => {
      if (newValue.id !== '') {
        if(props.selectItem.$treeNodeId === 1){
          getList(newValue.id)
        }else{
          getDepartmentList(newValue.id)
        }
      }
    }
  )
  //获取部门员工
  const getList = (id: string) => {
    $services.company
      .getPersons({
        data: {
          id: props.selectItem.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        tableData.list = res.data.result
      })
  }
  const getDepartmentList = (id:string) =>{
    $services.company
      .getDepartmentPersons({
        data: {
          id: props.selectItem.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if(res.data){
          tableData.list = res.data.result
        }else{
          tableData.list = []
        }
      })
  }
  const authName = ref<string>('');
  const authCode = ref<string>('');
  const authRemark = ref<string>('');
  const addAuthDiong = ref<boolean>(false)


  interface ListItem {
    value: string
    label: string
  }
  const options = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)

  //搜索人
  const remoteMethod = (query: string) => {
    if (query) {
      loading.value = true
      $services.person
        .searchPersons({
          data: {
            text: query,
            offset: 0,
            limit: 10
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            let arr: { value: any; label: any }[] = []
            console.log(res.data.result != undefined,res.data.result )
            if(res.data.result != undefined){
              let states = res.data.result
              states.forEach((el: any) => {
                let obj = {
                  value: el.id,
                  label: el.name
                }
                arr.push(obj)
              })
              options.value = arr
              loading.value = false
            }else{
              options.value = arr
              loading.value = false
            }
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    } else {
      options.value = []
    }
  }
  const presonName = ref<string>('');
  const presonCode = ref<string>('');
  const presonRemark = ref<string>('');
  const addPresonDialog = ref<boolean>(false)
  //添加员工
  const addPreson = ()=>{
     $services.company
      .pullPerson({
        data: {
          id:props.selectItem.id,
          targetIds:[value.value]
        }
      })
      .then((res: ResultType) => {
        console.log(res)
        if(res.code ===500){
          ElMessage({
            message: res.msg,
            type: 'error'
          })
        }else{
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
        }
         
        addPresonDialog.value = false
      })
  }
   //选中人员
  let selectArr = reactive<Array<selectItem>>([])
  const handleSelect = (key: Array<selectItem>) => {
    selectArr = key
    console.log('selectArr',selectArr)
  }
  const showChange = ()=>{
   if( selectArr.length>0){
      changeDialog.value = true;
   }else{
    ElMessage({
      message: '请先选中人员',
      type: 'warning'
    })
   }
  }
  
  //变更部门
  const assignId = ref<string>('') //tree选中的部门
  const addDepartment = (nodeObj:any)=>{
    assignId.value = nodeObj.id
  }
  const changeDialog = ref<boolean>(false)
  const changePreson = ()=>{
    $services.company
      .assignDepartment({
        data: {
          id:assignId.value,
          targetIds:[selectArr[0].id]
        }
      })
      .then((res: ResultType) => {
        console.log(res)
        if(res.code ===500){
          ElMessage({
            message: res.msg,
            type: 'error'
          })
        }else{
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
        }
        if(props.selectItem.$treeNodeId === 1){
          getList(props.selectItem.id)
        }else{
          getDepartmentList(props.selectItem.id)
        }
        changeDialog.value = false
      })
  }
  const defaultProps = {
    children: 'children',
    label: 'label'
  }
  const loadNode = (node: any, resolve: (data: any) => void) => {
    if (node.level === 0) {
      getQueryInfo(resolve)
    }
    if (node.level >= 1) {
      getDepartmentsList(node,resolve)
    }
  }
  //根节点数据
  async function getQueryInfo(resolve: any) {
    await $services.company.queryInfo({}).then((res: ResultType) => {
      let obj = [
        {
          children: [] as string[],
          label: res.data.name,
          id: res.data.id
        }
      ]
      return resolve(obj)
    })
  }
  async function getDepartmentsList(node:any,resolve: any) {
    let arr:any = [];
    await $services.company
      .getDepartments({
        data: { id: node.data.id, offset: 0, limit: 100 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
        let resData = JSON.parse(JSON.stringify(res.data.result))
    
        resData.forEach((element: any) => {
          var obj = {
            id: element.id,
            label: element.name,
            code:element.code,
            children:[] as []
          }

          arr.push(JSON.parse(JSON.stringify(obj)))
        })
        }
        return resolve(arr)
      })
  }
</script>
<style lang="scss" scoped>
  .deptment-info {
    background: #fff;
    padding: 20px;
    .group-icon {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }

    .deptment-info-btns {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;

      .left-name {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
      }

      .edit {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .page-pagination {
    background: #fff;
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 20px;
  }
</style>
