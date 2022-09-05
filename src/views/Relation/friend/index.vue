<template>

  <el-card style="border:0;" shadow="never" class="container">
    <!-- 组内成员信息 -->

      <div class="card-header">
        <span>我的好友</span>
        <el-button type="primary" @click="friendShow">添加好友</el-button>
      </div>

    <div class="tab-list">
      <el-table :data="state.friendList" stripe @select="handleSelect" :header-cell-style="{'background':'var(--el-color-primary-light-9)'}" >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="code" label="账号" width="180" />
        <el-table-column prop="name" label="昵称" width="180"  />
        <el-table-column prop="trueName" label="姓名" width="180"  />
        <el-table-column prop="teamCode" label="手机号" width="180"  />
        <el-table-column prop="remark" label="座右铭"  min-width="150" />
        <el-table-column prop="name" label="操作" width="150" >
          <template #default="scope">
            <el-button type="danger" link @click="deleteFriend(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <searchFriend v-if="searchDialog" @closeDialog="closeDialog" :serachType="1" @checksSearch='checksSearch' />
  </el-card>
</template>
<script lang="ts" setup>
import $services from '@/services'
import searchFriend from '@/components/searchs/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchDialog = ref<boolean>(false)

type arrList = {
  id: string
}

// 添加好友
const addFriends = (arr: Array<arrList>) => {
  $services.person
    .applyJoin({
      data: {
        id: arr.join(',')
      }
    })
    .then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '申请成功',
          type: 'success'
        })
        searchDialog.value = false
        getFriendList()
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
}
const handleSelect = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
onMounted(() => {
  getFriendList()
})

const state = reactive({ qunList: [], friendList: [] })
const getFriendList = async () => {
  await $services.person
    .getFriends({ data: { offset: 0, limit: 20 } })
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
const deleteFriend = (user: any) => {
  ElMessageBox.confirm(
    `确定删除好友 ${user.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    $services.person
    .remove({
      data: {
        id: user.id,
        targetIds: [user.id]
      }
    })
    .then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        getFriendList()
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
  })
}

const checksSearch = (val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    });
    addFriends(arr)
  } else {
    searchDialog.value = false;
  }
}
const closeDialog = () => {
  searchDialog.value = false;
}
const friendShow = () => {
  searchDialog.value = true;
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  // height: 100%;
  margin: 10px;
  // background: #f0f2f5;
  // padding: 5px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    // padding: 10px;
    // background: #fff;
    .edit {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
