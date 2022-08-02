<template>
  <div class="cohort-wrap">
    <!-- 导航传送门 -->
    <teleport v-if="isShowMenu" to="#menu-teleport-target">
      <el-aside class="custom-group-silder-menu" width="220px">
        <GroupSideBarVue v-model:active="activeInfo" :redDotInfo="msgDotMap" />
      </el-aside>
    </teleport>
    <!-- 右侧展示主体 -->
    <div class="chart-page">
      <!-- 头部 -->
      <GroupHeaderVue
        :info="selectInfo"
        v-show="activeInfo?.id"
        @viewDetail="handleViewDetail"
        @addUserOrCohort="handleAddFun"
        class="chart-header"
        @addFriends="addFriends"
        @pullPerson="pullPerson"
      />

      <!-- 聊天区域 -->
      <GroupContent class="chart-content" :myId="myId" :list="showMsgList" />
      <!-- 输入区域 -->
      <GroupInputBox class="chart-input" @submitInfo="submit" />
    </div>
    <GroupDetail :id="activeInfo.id" :info="selectInfo" v-if="isShowDetail" />
    <template v-for="item in dialogState.dialogShow" :key="item.key">
      <AddFriendsDialog v-if="item.key == 'addFriends'" :dialogShow="item"></AddFriendsDialog>
      <PullPersonDialog v-if="item.key == 'pullPerson'" :dialogShow="item"></PullPersonDialog>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/user'
  import * as signalR from '@microsoft/signalr'
  import API from '@/services'
  import { onMounted, reactive, ref, Ref, watch, computed } from 'vue'
  import GroupSideBarVue from './components/groupSideBar.vue'
  import GroupHeaderVue from './components/groupHeader.vue'
  import GroupInputBox from './components/groupInputBox.vue'
  import GroupContent from './components/groupContent.vue'
  import GroupDetail from './components/groupDeatil.vue'
  import AddFriendsDialog from './components/addFriendsDialog.vue'
  import PullPersonDialog from './components/pullPersonDialog.vue'
  interface infoType {
    detail: teamType
    userList: userType[]
    total: number
  }
  // 是否展示导航
  const isShowMenu = ref<boolean>(false)
  const isShowDetail = ref<boolean>(false)
  // 消息信息列表
  const msgMap = ref(new Map())
  // 是否展示红点
  const msgDotMap = ref(new Map())

  const showMsgList = computed(() => {
    console.log('计算属性', msgMap.value.get(activeInfo.value.id) ?? [])

    return msgMap.value.get(activeInfo.value.id) ?? []
  })

  //获取 登录人id-用于区分信息源
  const myId = useUserStore().queryInfo.id

  // 记录所选聊天对象---群或者人
  const activeInfo = ref<any>({})
  // 所选聊天对象的基本信息
  let selectInfo = reactive<infoType>({ detail: {} as teamType, userList: [], total: 0 })
  // 消息服务
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/orginone/orgchat/msghub')
    .withAutomaticReconnect()
    .build()

  // 接受信息--处理信息
  connection.on('RecvMsg', (res) => {
    const { data } = res
    let fromId = data.fromId
    if (data.toId != myId) {
      fromId = data.toId
    }
    const oldMsg = msgMap.value.get(fromId) ?? []
    msgMap.value.set(fromId, [...oldMsg, data])
    // 信息来源是正在聊天的人 -则不展示红点
    msgDotMap.value.set(fromId, activeInfo.value.id === fromId)
  })

  onMounted(() => {
    isShowMenu.value = true

    connection.start().then(async () => {
      let res = await connection.invoke('TokenAuth', useUserStore().userToken)
      console.log('链接成功', res)
    })
  })

  // 监听所选聊天对象
  watch(
    () => activeInfo.value,
    (val) => {
      const { typeName, id, team = {} } = val

      msgDotMap.value.set(id, false)
      if (typeName === '人员') {
        selectInfo.detail = val
        selectInfo.total = 0
        selectInfo.userList = []
      } else if (typeName === '群组') {
        selectInfo.detail = team
        getQunPerson(id)
      }
    }
  )

  // 展示详情页
  const handleViewDetail = () => {
    isShowDetail.value = !isShowDetail.value
  }

  // 获取群成员
  const getQunPerson = async (id: string) => {
    const { data, success } = await API.cohort.getPersons({
      data: {
        id,
        offset: 0,
        limit: 12
      }
    })
    if (success === true) {
      const { total = 0, result = [] } = data
      selectInfo.total = total
      selectInfo.userList = result
    }
  }
  // 提交信息
  const submit = async (value: Ref<string>) => {
    let toId = activeInfo.value.id
    if (toId > 0) {
      let res = await connection.invoke('SendMsg', {
        toId: activeInfo.value.id,
        msgType: 'text',
        msgBody: value.value
      })
      if (res.success === true) {
        const oldMsg = msgMap.value.get(toId) ?? []
        msgMap.value.set(toId, [...oldMsg, res.data])
      }
    }
  }

  //添加成员/群
  const handleAddFun = () => {
    console.log('添加成员/群')
  }

  //dialog参数
  let dialogState = reactive({
    dialogShow: [
      {
        key: 'addFriends',
        value: false
      },
      {
        key: 'pullPerson',
        value: false
      }
    ]
  })

  //添加好友
  const addFriends = () => {
    dialogState.dialogShow.map((el: { key: string; value: boolean }) => {
      if (el.key == 'addFriends') {
        el.value = true
      }
    })
  }

  //拉人进群组
  const pullPerson = () => {
    dialogState.dialogShow.map((el: { key: string; value: boolean }) => {
      if (el.key == 'pullPerson') {
        el.value = true
      }
    })
  }
</script>

<style lang="scss">
  .custom-group-silder-menu.el-aside {
    height: 100%;
  }
</style>
<style lang="scss" scoped>
  .cohort-wrap {
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    justify-content: space-between;
    background-color: #fff;

    .chart-page {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      overflow: hidden;

      .chart-header {
        height: 70px;
        box-shadow: 0 1px 2px 1px #e5e5e5;
        z-index: 2;
      }

      .chart-content {
        flex-grow: 1;
        overflow-y: auto;
      }

      .chart-input {
        height: max-content;
        min-height: 120px;

        .el-textarea__inner {
          color: #fff;
        }
      }
    }
  }
</style>
