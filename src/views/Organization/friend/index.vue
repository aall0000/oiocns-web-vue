<template>
  <div class="container">
    <!-- 组内成员信息 -->
    <div class="operate">
      <div class="operate-btns">
        <div class="edit">
          <el-button type="primary" @click="friendDialog = true">添加好友</el-button>
        </div>
      </div>
    </div>
    <div class="tab-list">
      <el-table :data="state.friendList" stripe
        @select="handleSelect">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="code" label="账号" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="trueName" label="姓名" />
        <el-table-column prop="teamCode" label="手机号" />
        <el-table-column prop="remark" label="座右铭" width="280" />
        <el-table-column prop="name" label="操作">
          <template #default="scope">
            <el-button @click="deleteFriend(scope.row.id)" type="primary">删除好友</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="friendDialog" title='添加好友' width="30%">
      <el-select v-model="value" filterable remote reserve-keyword
        placeholder='请输入要查找的好友名' :remote-method="remoteMethod" :loading="loading">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="friendDialog = false">取消</el-button>
          <el-button type="primary" @click="addFriends">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

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
})

const state = reactive({ qunList: [], friendList: [] })
const getFriendList = async () => {
  await $services.person
    .getFriends({ data: { offset: 0, limit: 10 } })
    .then((res: ResultType) => {
      const { result = [] } = res.data
      state.friendList = result?.map(
          (item: { team: { remark: any; code: any; name: any } }) => {
            return {
              ...item,
              remark: item.team.remark,
              teamCode: item.team.code,
              trueName: item.team.name
            }
          }
        )
    })
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
          message: '删除成功',
          type: 'warning'
        })
        getFriendList()
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
          console.log(res.data.result != undefined, res.data.result)
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
.container {
  width: 100%;
  height: 100%;
  background: #f0f2f5;
  padding: 5px;
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
