<template>
  <div class="department-info">
    <!-- 组内成员信息 -->
    <div class="deptment-info">
      <div class="deptment-info-btns">
        <div class="edit" v-if="personType == '1'">
          <el-button type="primary" @click="friendDialog = true">添加好友</el-button>
        </div>
        <div class="edit" v-else>
          <el-button type="primary" @click="friendDialog = true">添加群</el-button>
          <el-button type="primary" @click="addQun = true">创建群</el-button>
        </div>
      </div>
    </div>
    <div class="tab-list">
      <el-table
        :data="personType == '1' ? state.friendList : state.qunList"
        stripe
        style="width: 100%"
        height="390"
        @select="handleSelect"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="typeName" label="类型" />
        <el-table-column prop="code" label="成员编码" />
        <el-table-column prop="name" label="成员角色" />
        <el-table-column prop="name" label="操作">
          <template #default="scope">
            <el-button v-if="personType == '1'" @click="deleteFriend(scope.row.id)" type="primary"
              >删除好友</el-button
            >
            <el-button v-if="personType == '2'" @click="deletequn(scope.row.id)" type="primary"
              >退出群</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-pagination">
      <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
    </div>
    <el-dialog
      v-model="friendDialog"
      :title="personType == '1' ? '添加好友' : '添加群'"
      width="30%"
    >
      <el-select
        v-model="value"
        filterable
        remote
        reserve-keyword
        :placeholder="personType == '1' ? '请输入要查找的好友名' : '请输入要查找的群'"
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
          <el-button @click="friendDialog = false">取消</el-button>
          <el-button type="primary" v-if="personType == '1'" @click="addFriends">确认</el-button>
          <el-button type="primary" v-else @click="addCohort">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="addQun" title="创建群" width="30%">
      <el-form-item label="群名称">
        <el-input v-model="qunName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="群编号">
        <el-input v-model="qunCode" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="群简介">
        <el-input v-model="qunTeamRemark" placeholder="Please input" clearable />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addQunFun">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, onMounted, watch } from 'vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  import { ElMessage } from 'element-plus'
  const store = useUserStore()
  const { queryInfo } = storeToRefs(store)
  const { workspaceData } = storeToRefs(store)
  let showMenu = ref<boolean>(true)
  if (workspaceData.value.name != '个人空间') {
    showMenu.value = true
  } else {
    showMenu.value = false
  }

  type selectType = {
    name: string
    id: string
  }
  const props = defineProps<{
    personType: any
  }>()
  watch(
    () => props.personType,
    (news) => {

    }
  )

  let selectId = ref<string>()
  const friendDialog = ref<boolean>(false)
  const addFriends = () => {
    $services.person
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
          friendDialog.value = false
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  onMounted(() => {
    getFriendList()
    getQunList()
  })

  const state = reactive({ qunList: [], friendList: [] })
  const getFriendList = async () => {
    await $services.person
      .getFriends({ data: { offset: 0, limit: 10 } })
      .then((res: ResultType) => {
        const { result = [] } = res.data
        state.friendList = result
      })
  }
  // 获取我加入的群列表
  const getQunList = async () => {
    const res = await $services.cohort.getJoinedCohorts({ data: { offset: 0, limit: 10 } })
    const { data, err } = res
    if (!err) {
      const { result = [] } = data
      state.qunList = result
    }
  }
  //删除好友
  const deleteFriend = (id: string) => {
    $services.person
      .remove({
        data: {
          id: id,
          targetIds: [id]
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '申请成功',
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
  const addCohort = () => {
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
          friendDialog.value = false
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }

  //删除群
  const deletequn = (id: string) => {
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
  const addQunFun = () => {
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
      if (props.personType.value == '1') {
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
              let states = res.data.result
              let arr: { value: any; label: any }[] = []
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
              ElMessage({
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
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
              let states = res.data.result
              let arr: { value: any; label: any }[] = []
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
              ElMessage({
                message: res.msg,
                type: 'warning'
              })
            }
          })
      }
    } else {
      options.value = []
    }
  }
</script>
<style lang="scss" scoped>
  .deptment-info {
    background: #fff;
    padding: 20px;
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
</style>
