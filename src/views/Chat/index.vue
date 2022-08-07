<template>
  <div class="cohort-wrap">
    <!-- 导航传送门 -->
    <teleport v-if="isShowMenu" to="#menu-teleport-target">
      <el-aside class="custom-group-silder-menu" width="260px">
        <GroupSideBarVue v-model:active="activeInfo" :sessionList="sessionList" :redDotInfo="msgDotMap" :clearHistoryMsg="clearHistoryMsg" />
      </el-aside>
    </teleport>
    <!-- 右侧展示主体 -->
    <div class="chart-page">
      <!-- 头部 -->
      <GroupHeaderVue :info="selectInfo" v-if="activeInfo?.id" @viewDetail="handleViewDetail" />
      <!-- 聊天区域 -->
      <GroupContent class="chart-content" :myId="myId" ref="contentWrapRef" :list="showMsgList"
        @viewMoreMsg="handleViewMoreHistory" />
      <!-- 输入区域 -->
      <GroupInputBox class="chart-input" v-show="activeInfo?.id" @submitInfo="submit" />
    </div>
    <GroupDetail :info="selectInfo" v-if="isShowDetail" @updateUserList="getQunPerson" :clearHistoryMsg="clearHistoryMsg" />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import * as signalR from '@microsoft/signalr'
import { onMounted, reactive, ref, Ref, watch, computed, onBeforeUnmount, nextTick } from 'vue'
import GroupSideBarVue from './components/groupSideBar.vue'
import GroupHeaderVue from './components/groupHeader.vue'
import GroupInputBox from './components/groupInputBox.vue'
import GroupContent from './components/groupContent.vue'
import GroupDetail from './components/groupDetail.vue'
interface infoType {
  detail: teamType
  userList: userType[]
  total: number
  isCohort: boolean
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
//内容展示 dom节点
const contentWrapRef = ref(null)

// 会话列表
const sessionList = ref<userType[]>([])

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
let selectInfo = reactive<infoType>({ detail: {} as teamType, userList: [], total: 0, isCohort: false })
// 消息服务
const connection = new signalR.HubConnectionBuilder()
  .withUrl('/orginone/orgchat/msghub')
  .withAutomaticReconnect()
  .build()

onMounted(() => {
  isShowMenu.value = true
  // 开始链接
  connection.start().then(async () => {
    await connection.invoke('TokenAuth', userToken)
    const { data, success } = await connection.invoke('GetChats')
    if (success) {
      const { result = [] } = data
      console.log('链接成功')
      sessionList.value = [...result]
    }
  })
  // 监听链接断开
  connection.onclose(() => {
    console.log('链接关闭了');
  })
})

// 提交信息
const submit = async (value: Ref<string>) => {
  let text = value.value.trim()
  if (activeInfo.value.id > 0 && text.length > 0) {
    await connection.send('SendMsg', {
      toId: activeInfo.value.id,
      msgType: 'text',
      msgBody: text
    })
  }
}
// 接受信息--处理信息
connection.on('RecvMsg', (res) => {
  const { data } = res
  // console.log('接受消息', '当前选择id', activeInfo.value.id, "-----", '来源', data.fromId, '-----', '我的', myId);
  // console.log('处理信息', data);
  // 根据新信息更新导航信息
  let sessionId = handleUpdateSideList(data)
  if (sessionId !== myId) {
    let num = (msgDotMap.value.get(sessionId)?.count ?? 0) + 1
    // 信息来源是正在聊天的人 -则不展示红点
    msgDotMap.value.set(sessionId, { isShowDot: activeInfo.value.id !== sessionId, count: num })
  }
  const oldMsg = msgMap.value.get(sessionId) ?? []
  msgMap.value.set(sessionId, [...oldMsg, data])
  contentWrapRef.value.goPageEnd()
})

onBeforeUnmount(() => {
  // 离开页面关闭链接
  connection.stop()
})

// 监听所选聊天对象
watch(
  () => activeInfo.value,
  async (val) => {
    const { typeName, id, team = {} } = val
    selectInfo.isCohort = (typeName === "群组")
    current.value = 0
    // 取消红点提示
    msgDotMap.value.set(id, { isShowDot: false, count: 0 })
    if (typeName === '人员') {
      selectInfo.detail = val
      selectInfo.total = 0
      selectInfo.userList = []
    } else {
      selectInfo.detail = team
      await getQunPerson(id, 0)
    }
    // 切换人员-清空已存信息
    msgMap.value.clear()
    //获取新的聊天对象历史信息
    getHistoryMsg(id, typeName, true)

    //关闭详情页面
    isShowDetail.value = false
  }
)

// 展示详情页
const handleViewDetail = () => {
  isShowDetail.value = !isShowDetail.value
}

// 获取群成员
const getQunPerson = async (id: string, offset: number) => {
  const { data, success } = await connection.invoke("GetPersons", {
    cohortId: id,
    limit: 10,
    Offset: offset
  });
  if (success === true) {
    selectInfo.total = data.total
    if (offset === 0) {
      selectInfo.userList = data.result
    } else {
      selectInfo.userList = [...selectInfo.userList, ...data.result]
    }
    // 存储用户id=>名称
    data.result.forEach((item: userType) => {
      setUserNameMap(item.id, item.name)
    })
  }
}

// 根据新信息更新导航信息
const handleUpdateSideList = (data: any) => {
  const newArr: any[] = []
  let resId = data.toId
  sessionList.value.forEach((item: any) => {
    let sessionId = data.toId
    if (item.typeName === "人员"
      && data.fromId !== myId
      && data.toId === myId) {
      sessionId = data.fromId
    }
    if (sessionId == item.id) {
      item.message = data
      item.createTime = data.createTime
      newArr.unshift(item)
      resId = sessionId
    } else {
      newArr.push(item)
    }
  })
  sessionList.value = newArr
  return resId
}

// 获取历史消息
const getHistoryMsg = async (id: string, type: string, isGoEnd?: boolean) => {
  const url: string = type == '人员' ? 'QueryFriendMsg' : 'QueryCohortMsg';
  const { data = [], success } = await connection.invoke(url, {
    [type == '人员' ? 'friendId' : 'cohortId']: id,
    offset: pageOffset.value,
    limit: limit.value
  })
  if (success) {
    const newHistoryMsgArr = (data.result && data.result?.reverse()) ?? []
    const oldMsg = msgMap.value.get(id) ?? []
    msgMap.value.set(id, [...newHistoryMsgArr, ...oldMsg])
  }
}

//清空历史记录
const clearHistoryMsg = () => {
  msgMap.value.clear()
}

// 获取更多历史消息
const handleViewMoreHistory = () => {
  current.value++
  getHistoryMsg(activeInfo.value.id, activeInfo.value.typeName)
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

    .chart-content {
      flex-grow: 1;
      overflow-y: auto;
    }

    .chart-input {
      height: max-content;
      min-height: 200px;
      border-top: 1px solid #ccc;

      .el-textarea__inner {
        color: #fff;
      }
    }
  }
}
</style>
