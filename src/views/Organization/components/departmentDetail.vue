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
          <div style="color:#154ad8" @click="dialogVisible = true">分配人员</div>
          <!-- <el-button>调整排序</el-button> -->
        </div>
      </div>
    </div>
    <div class="tab-list">
      <ul class="next-dept">
        <!-- 内容 
        v-for="(item,index) in DepartmentsList.list" :key="index"
        -->
        <table class="table-mytable">
          <tr>
            <td class="left">名称</td>
            <td class="column">{{selectItem.name}}</td>
            <td class="left">人数</td>
            <td class="column">{{listNum}}</td>
          </tr>
        </table>
      </ul>
    </div>

    <el-dialog v-model="dialogVisible" title="请输入部门名称" width="30%">
      <el-form-item label="部门名称">
        <el-input v-model="departmentName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input v-model="departmentTeamCode" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门简介">
        <el-input v-model="departmentTeamRemark" placeholder="Please input" clearable />
      </el-form-item>
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
  let dialogVisible = ref<boolean>(false)
  let selectId = ref<string>()
  let departmentName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
  const submitFriends = () => {
    $services.company
      .createDepartment({
        data: {
          id: selectId.value,
          name: departmentName.value,
          parentId: props.selectItem.id,
          code: departmentTeamCode.value,
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        if(res.code ==200){
          dialogVisible.value = false
          getList(props.selectItem.id)
           ElMessage({
            message: '添加成功',
            type: 'success'
          })
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
        if(res.data.result){
          listNum.value =res.data.total
        }else{
          listNum.value =0
        }
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
        if(res.data.result){
          listNum.value =res.data.total
        }else{
          listNum.value =0
        }
      })
  }
</script>

<style lang="scss" scoped>
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
