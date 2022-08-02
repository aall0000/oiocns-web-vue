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
      />
      <!-- 聊天区域 -->
      <GroupContent
        class="chart-content"
        :myId="myId"
        ref="contentWrapRef"
        :list="showMsgList"
        :isShowMoreBtn="isShowMoreBtn"
        @viewMoreMsg="handleViewMoreHistory"
      />
      <!-- 输入区域 -->
      <GroupInputBox class="chart-input" @submitInfo="submit" />
    </div>
    <GroupDetail :id="activeInfo.id" :info="selectInfo" v-if="isShowDetail" />
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
  interface infoType {
    detail: teamType
    userList: userType[]
    total: number
  }
  const { setUserNameMap, userToken } = useUserStore()
  // 是否展示导航
  const isShowMenu = ref<boolean>(false)
  const isShowDetail = ref<boolean>(false)
  // 消息信息列表
  const msgMap = ref(new Map())
  // 是否展示红点
  const msgDotMap = ref(new Map())

  // 记录历史记录上次搜索信息
  const lastQueryParams = ref<any>({})

  const showMsgList = computed(() => {
    return msgMap.value.get(activeInfo.value.id) ?? []
  })
  const contentWrapRef = ref(null)
  const isShowMoreBtn = ref<boolean>(false)

  //获取 登录人id-用于区分信息源
  const myId = useUserStore().queryInfo.id
  const current = ref<number>(0) //当前页码
  const limit = ref<number>(20) //数量限制 limit
  const pageOffset = computed(() => {
    return current.value * limit.value
  })

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
      let res = await connection.invoke('TokenAuth', userToken)
      console.log('链接成功', res)
    })
  })

  // 监听所选聊天对象
  watch(
    () => activeInfo.value,
    (val) => {
      const { typeName, id, team = {} } = val
      current.value = 0
      // 取消红点提示
      msgDotMap.value.set(id, false)
      if (typeName === '人员') {
        selectInfo.detail = val
        selectInfo.total = 0
        selectInfo.userList = []
      } else if (typeName === '群组') {
        selectInfo.detail = team
        getQunPerson(id)
      }

      //获取历史记录
      const canQueryHistory = msgMap.value.get(id)?.length ?? 0
      if (canQueryHistory === 0) {
        getHistoryMsg(id, typeName)
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
      result.forEach((item: userType) => {
        setUserNameMap(item.id, item.name)
      })
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
      contentWrapRef.value?.goPageEnd()
    }
  }

  // 获取历史消息
  const getHistoryMsg = async (id: string, type: string) => {
    const url: string = type == '人员' ? 'getFriendMsg' : type == '群组' ? 'getCohortMsg' : ''
    if (!url) {
      return console.log('该聊天对象-非人员/群组')
    }

    const params = {
      [type == '人员' ? 'friendId' : 'cohortId']: id,
      offset: pageOffset.value,
      limit: limit.value
    }
    const { data, success } = await API.history[url]({
      data: params
    })
    if (success === true) {
      const { total = 0, result = [] } = data
      const newHistoryMsgArr = result.reverse()
      const oldMsg = msgMap.value.get(id) ?? []
      msgMap.value.set(id, [...newHistoryMsgArr, ...oldMsg])
      // 记录查询成功的数据
      lastQueryParams.value = params
      contentWrapRef.value.keepScrollPos()
      isShowMoreBtn.value = total > msgMap.value.get(id).size ?? false
    }
  }

  // 获取更多历史消息
  const handleViewMoreHistory = () => {
    current.value++
    getHistoryMsg(activeInfo.value.id, activeInfo.value.typeName)
  }

  //添加成员/群
  const handleAddFun = () => {
    console.log('添加成员/群')
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
        min-height: 70px;
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
