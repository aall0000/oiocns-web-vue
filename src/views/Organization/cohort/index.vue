<template>
  <div class="container">
    <!-- 组内成员信息 -->
    <div class="operate">
      <div class="operate-btns">
        <div class="edit">
          <el-button type="primary" @click="cohortDialog = true">添加群</el-button>
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
            <el-button @click="deleteCohort(scope.row.id)" type="primary">退出群</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="page-pagination">
      <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
    </div> -->
    <el-dialog v-model="cohortDialog" title='添加群' width="30%">
      <el-select v-model="value" filterable remote reserve-keyword
        :placeholder="'请输入要查找的群'" :remote-method="remoteMethod" :loading="loading">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cohortDialog = false">取消</el-button>
          <el-button type="primary" @click="applyJoinCohort">确认</el-button>
        </span>
      </template>
    </el-dialog>

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
  const res = await $services.cohort.getJoinedCohorts({ data: { offset: 0, limit: 1000 } })
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

const applyJoinCohort = () => {
  $services.cohort
    .applyJoin({
      data: {
        id: value.value
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '申请成功',
          type: 'warning'
        })
        cohortDialog.value = false
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
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
          message: '删除成功',
          type: 'warning'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
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
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
}
interface ListItem {
  value: string
  label: string
}
const options = ref<ListItem[]>([])
const value = ref('')
const loading = ref(false)

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    $services.cohort
      .searchCohorts({
        data: {
          text: query,
          offset: 0,
          limit: 10
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          let arr: { value: any; label: any }[] = []
          if (res.data.result != undefined) {
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
          } else {
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
