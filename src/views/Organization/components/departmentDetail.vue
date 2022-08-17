<template>
  <div class="department-info">
    <div class="deptment-info">
      <p class="deptment-info-name">
        <!-- <span>{{ treeObj.name }}</span> -->
        <!-- <span class="info-num">20人</span> -->
        <!-- <el-button size="small" style="margin-left: 15px">编辑</el-button> -->
      </p>
      <div class="deptment-info-btns">
        <div class="left-name">部门信息</div>
        <div class="edit">
          <!-- <el-button type="primary">创建工作组</el-button> -->
          <div style="color:#154ad8" v-show="selectItem.id !== rootElement.id" @click="showDialog">分配人员</div>
          <!-- <el-button>调整排序</el-button> -->
        </div>
      </div>
    </div>
    <div class="tab-list">
      <ul class="next-dept">
        <table class="table-mytable">
          <tr>
            <td class="left">名称</td>
            <td class="column">{{selectItem.name || selectItem.label}}</td>
            <td class="left">人数</td>
            <td class="column">{{listNum}}</td>
          </tr>
          <tr>
            <td class="left">备注</td>
            <td class="column">{{selectItem.remark}}</td>
          </tr>
        </table>
      </ul>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="分配人员"
        width="450px"
        center
      >
        <el-select-v2
          v-model="checkList.list"
          style="width: 350px;margin-left: calc(50% - 175px);"
          multiple
          filterable
          remote
          reserve-keyword
          :remote-method="remoteMethod"
          :options="options"
          :loading="loading"
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFriends">确认</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  type selectItem = {
    name: string
    id: string
    label:string,
    remark:string,
    leaf:boolean
  }
   type rootType = {
    id:string,
    name:string,
  }
  const props = defineProps<{
    selectItem: selectItem,
    envType:number,
    rootElement:rootType
  }>()
  const submitFriends = () => {
    if (checkList.list.length > 0) {
      if(props.selectItem.leaf == true){
        changeJobPreson(props.selectItem.id) //工作组
      }else{
        changePreson(props.selectItem.id) //子单位
      }
    }
  }
   //分配部门or变更
  const changePreson = (id: string) => {

    $services.company
    .assignDepartment({
      data: {
        id: id,
        targetIds: checkList.list
      }
    })
    .then((res: ResultType) => {
      if (res.code === 500) {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      } else {
        ElMessage({
          message: '分配成功',
          type: 'success'
        })
        dialogVisible.value = false;
      }
    })
  }
  //分配工作组or变更
  const changeJobPreson = (id:string) =>{
    $services.company
    .assignJob({
      data: {
        id: id,
        targetIds: checkList.list
      }
    })
    .then((res: ResultType) => {
      if (res.code === 500) {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      } else {
        ElMessage({
          message: '分配成功',
          type: 'success'
        })
        dialogVisible.value = false;
      }
    })
  }
  watch(
    () => props.selectItem,
    (newValue: selectItem) => {
      if (newValue.id !== '') {
        if(props.selectItem && props.rootElement){
          if(props.selectItem.id  === props.rootElement.id){
            getList(newValue.id)
          }else{
            getDepartmentList(newValue.id)
          }
        }

      }
    }
  )
  const listNum = ref<number>(0);
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
        if(res.data.result){
          listNum.value =res.data.total
        }else{
          listNum.value =0
        }
      })
  }
  //获取单位员工
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
        if(res.data){
          listNum.value =res.data.total
        }else{
          listNum.value =0
        }
      })
  }
  let dialogVisible = ref<boolean>(false)
  //打开分派员工
  const showDialog = ()=>{
    dialogVisible.value = true
    getPersons()
    if(props.selectItem.leaf ==true){
    }else{
      getDepartmentPersons()
    }
  }
  //获取单位人员
  const getPersons = () => {
    $services.company
    .getPersons({
      data: {
        id: props.selectItem.id,
        offset: 0,
        limit: 100
      }
    })
    .then((res: ResultType) => {
      let arr:any = []
      if(res.data.result){
        res.data.result.forEach((element:any) => {
          let obj = {
            value:element.id,
            key:element.id,
            label:element.name,
          }
          arr.push(obj)
        });
      }
      options.value = arr;
    })
  }
  //获取工作组员工
  const getJobList = () => {
    $services.company
    .getJobPersons({
      data: {
        id: props.selectItem.id,
        offset: 0,
        limit: 100
      }
    })
    .then((res: ResultType) => {
        let arr:any = []
        if(res.data){
          res.data.result.forEach((element:any) => {
            arr.push(element.id)
          });
        }
        checkList.list = arr
    })
  }
  //获取子单位员工
  const getDepartmentPersons = () => {
  $services.company
    .getDepartmentPersons({
      data: {
        id: props.selectItem.id,
        offset: 0,
        limit: 100
      }
    })
    .then((res: ResultType) => {
      let arr:any = []
    if(res.data){
      res.data.result.forEach((element:any) => {
        arr.push(element.id)
      });
    }
    checkList.list = arr
  })
  }
  //分配员工参数
  interface ListItem {
    value: string
    label: string
  }
  const options = ref<ListItem[]>([])
  const loading = ref(false)
  //分配员工选择
  const remoteMethod = (query: string) => {
    if (query !== '') {
      loading.value = true
      var arr = options.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
      options.value = arr;
    } else {
      getPersons();
    }
     loading.value = false
  }
  const checkList = reactive({list:[]})
</script>

<style lang="scss" scoped>
 .main-dialog {
    display: flex;
    padding: 0 30px;
    flex: 1;
    justify-content: space-between;
    flex-wrap: wrap;
    .main-item :nth-child(2n) {
      padding-left: 5px;
    }
  }
  .main-title {
    margin-left: 30px;
    font-weight: bold;
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
  }
  .main-transfer {
    margin: 0 auto;
    display: flex;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 20px;
    margin: 0 30px;
    .main-title {
      width: 100%;
    }
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .department-info{
    box-sizing: border-box;
    padding: 15px 20px;
    background: #fff;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  .deptment-info {
    background: #fff;
    margin-bottom: 15px;
    .deptment-info-name {
      font-size: 18px;
      font-weight: bold;
      .info-num {
        font-size: 14px;
        font-weight: normal;
        padding: 0 10px;
      }
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
  .next-dept{
    tr{
      border: 1px solid #eff2f7;
      color: #666;
      height: 45px;
      text-align: center;
    }
    .left{
      background: #f5f6fc;
      width: 10.4%;
      min-width: 110px;
    }
    .column{
      width: 39.6%;
      text-align: left;
      padding: 0 20px;
      background: #fff;
    }
  }
</style>
