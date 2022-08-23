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
    <searchFriend  v-if="friendDialog" @checkFriend='checkFriend'/>
  </div>
</template>
<script lang="ts" setup>
import $services from '@/services'
import searchFriend from '@/components/search/friend.vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const friendDialog = ref<boolean>(false)

type arrList = {
  id:string
}

const addFriends = (arr:Array<arrList>) => {
  console.log('arrr',arr)
  $services.person
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
        friendDialog.value = false
        getFriendList()
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
const checkFriend=(val:any)=>{
  if(val.value.length>0){
    let arr:Array<arrList> =[]
    val.value.forEach((element:any) => {
      arr.push(element.id)
    });
    addFriends(arr)
  }else{
    friendDialog.value = false;
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
