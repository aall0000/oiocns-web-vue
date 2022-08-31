<template>
  <div class="container">
    <!-- 组内成员信息 -->
    <div class="operate">
      <div class="operate-btns">
        <div class="edit">
          <el-button type="primary" @click="friendShow">添加群</el-button>
          <el-button type="primary" @click="addQun = true">创建群</el-button>
        </div>
      </div>
    </div>
    <div class="tab-list">
      <el-table :data="state.qunList" stripe style="width: 100%; height: 100%"
        @select="handleSelect">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="群名称" />
        <el-table-column prop="code" label="群编号" />
        <el-table-column prop="remark" label="群简介" />
        <el-table-column prop="name" label="操作">
          <template #default="scope">
            <el-button v-if="myId != scope.row.belongId" @click="exitCohort(scope.row.id)" type="primary">退出群</el-button>
            <el-button v-if="myId == scope.row.belongId" @click="deleteCohort(scope.row.id)" type="primary">解散群</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="page-pagination">
      <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
    </div> -->
    <searchCohort  v-if="searchDialog" :serachType="2" @closeDialog="closeDialog"  @checksSearch='checksSearch'/>
    <el-dialog v-model="addQun" title="创建群" width="30%">
      <el-form-item label="群名称">
        <el-input v-model="qunName" placeholder="请输入群名称" clearable />
      </el-form-item>
      <el-form-item label="群编号">
        <el-input v-model="qunCode" placeholder="请输入群编号" clearable />
      </el-form-item>
      <el-form-item label="群简介">
        <el-input v-model="qunTeamRemark" placeholder="请输入群简介" type="textarea" clearable :rows="4" />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="createCohort">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import searchCohort from '@/components/searchs/index.vue'

const { queryInfo } = useUserStore()
const myId = queryInfo.id

let selectId = ref<string>()
const cohortDialog = ref<boolean>(false)

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
onMounted(() => {
  getQunList()
})

const state = reactive({ qunList: []})

// 获取我加入的群列表
const getQunList = async () => {
  const res = await $services.cohort.getJoinedCohorts({ data: { offset: 0, limit: 10000 } })
  const { data, err } = res
  if (!err) {
    const { result = [] } = data
    state.qunList = result?.map(
      (item: { team: { remark: any; code: any; name: any } }) => {
        return {
          ...item,
          remark: item.team.remark
        }
      }
    )
  }
}
const searchDialog = ref<boolean>(false)
const closeDialog = ()=>{
  searchDialog.value = false;
}
const friendShow = ()=>{
  searchDialog.value = true;
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
    applyJoinCohort(arr)
  }else{
    searchDialog.value = false;
  }
}
const applyJoinCohort = (arr:Array<arrList>) => {
  $services.cohort
    .applyJoin({
      data: {
        id: arr.join(',')
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '申请成功',
          type: 'warning'
        })
        searchDialog.value = false
        getQunList()
      }
    })
}
//退出群
const exitCohort = (id: string) =>{
  $services.cohort
    .exit({
      data: {
        id: id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '退出成功',
          type: 'warning'
        })
        getQunList()
      }
    })
}

//删除群
const deleteCohort = (id: string) => {
  $services.cohort
    .delete({
      data: {
        id: id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '解散成功',
          type: 'warning'
        })
        getQunList()
      }
    })
}
const addQun = ref<boolean>(false)
let qunName = ref<string>('')
let qunCode = ref<string>('')
let qunTeamRemark = ref<string>('')

const createCohort = () => {
  $services.cohort
    .create({
      data: {
        id: selectId.value,
        name: qunName.value,
        code: qunCode.value,
        teamRemark: qunTeamRemark.value
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '创建成功',
          type: 'success'
        })
        addQun.value = false
        getQunList()
      }
    })
}
</script>
<style lang="scss" scoped>
.container{
  background: #f0f2f5;
  padding: 5px;
  width: 100%;
  height: 100%;
  .operate-btns {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #fff;
    .edit {
      font-size: 14px;
      font-weight: bold;
    }
  }
}

</style>
