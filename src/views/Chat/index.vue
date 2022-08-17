<template>
  <div class="cohort-wrap">
    <!-- 导航传送门 -->
    <teleport v-if="isShowMenu" to="#menu-teleport-target">
      <el-aside class="custom-group-silder-menu" width="260px">
        <GroupSideBarVue v-model:active="activeInfo" :myId="myId" :sessionList="sessionList" :redDotInfo="msgDotMap"
          :clearHistoryMsg="clearHistoryMsg" />
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
    <!-- 详情 -->
    <GroupDetail :info="selectInfo" v-if="isShowDetail" @updateUserList="getQunPerson"
      :clearHistoryMsg="clearHistoryMsg" />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import API from "@/services"
import * as signalR from '@microsoft/signalr'
import { onMounted, reactive, ref, Ref, watch, computed, onBeforeUnmount, nextTick } from 'vue'
import GroupSideBarVue from './components/groupSideBar.vue'
import GroupHeaderVue from './components/groupHeader.vue'
import GroupInputBox from './components/groupInputBox.vue'
import GroupContent from './components/groupContent.vue'
import GroupDetail from './components/groupDetail.vue'
interface infoType {
  detail: ImMsgChildType
  userList: userType[]
  total: number
  typeName: string
}
const { setUserNameMap, userToken, queryInfo } = useUserStore()
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
  const key = activeInfo.value.id
  return msgMap.value.get(key) ?? []
})
//内容展示 dom节点
const contentWrapRef = ref(null)

// 会话列表
const sessionList = ref<ImMsgType[]>([])

//获取 登录人id-用于区分信息源
const myId = queryInfo.id
const current = ref<number>(0) //当前页码
const limit = ref<number>(15) //数量限制 limit
const pageOffset = computed(() => {
  return current.value * limit.value
})

// 记录所选聊天对象---群或者人
const activeInfo = ref<ImMsgChildType>({} as ImMsgChildType)
// 所选聊天对象的基本信息
let selectInfo = reactive<infoType>({ detail: {} as ImMsgChildType, userList: [], total: 0, typeName: '' })
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
      const { groups = [] } = data
      console.log('链接成功', data)
      sessionList.value = [...groups]

      setUserNameMap(queryInfo.id, queryInfo.name)
      // 存储用户id=>名称
      groups.forEach((item: ImMsgType) => {
        if (item?.chats?.length > 0) {
          item?.chats?.forEach((child: ImMsgChildType) => {
            setUserNameMap(child.id, child.name)
          })
        }
      })
    }
  });

  // 接受信息--处理信息
  connection.on('RecvMsg', (res: any, error: any) => {
    const { data } = res
    // console.log('接受消息', data, error);
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
    handleNewMsgShow(data)
  });
  // 监听链接断开
  connection.onclose(() => {
    console.log('链接关闭了');
    msgMap.value.clear()
  });
})



// 提交信息
const submit = async (value: string) => {
  let text = value.indexOf('span') > -1 ? value : value.replaceAll('&nbsp;', '')

  text = text.trim()

  const params = {
    toId: activeInfo.value.id,
    spaceId: activeInfo.value.groupId,
    msgType: 'text',
    msgBody: text
  }
  // API.msg.sendMsg({ data: params })
  if (activeInfo.value.id && text?.length > 0) {
    await connection.send('SendMsg', params)
  }
}


onBeforeUnmount(() => {
  // 离开页面关闭链接
  connection.stop()
})

// 监听所选聊天对象
watch(
  () => activeInfo.value,
  async (val) => {
    const { typeName, id } = val
    selectInfo.typeName = typeName
    current.value = 0
    // 取消红点提示
    msgDotMap.value.set(id, { isShowDot: false, count: 0 })
    selectInfo.detail = val
    if (typeName === '人员') {
      selectInfo.total = 0
      selectInfo.userList = []
    } else {
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
    cohortId: String(id),
    limit: 10,
    offset: offset
  });
  // const { data, success } = await API.cohort.getPersons({
  //   data: {
  //     cohortId: id,
  //     limit: 10,
  //     offset: offset
  //   }
  // });
  //

  if (success === true) {
    selectInfo.total = data.total
    // 存储用户id=>名称
    data.result.forEach((item: userType) => {
      setUserNameMap(item.id, item.name)
    })
    if (offset === 0) {
      selectInfo.userList = data.result
    } else {
      selectInfo.userList = [...selectInfo.userList, ...data.result]
    }

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
const handleNewMsgShow = (data: any) => {
  const silderList = sessionList.value
  // 是否匹配到空间
  let canSearchSpace = false

  sessionList.value = silderList.map((item: any) => {
    // 匹配会话空间
    if (item.id === data.spaceId) {
      canSearchSpace = true
      let sessionId = data.toId
      if (item.typeName === "人员"
        && data.fromId !== myId
        && data.toId === myId) {
        sessionId = data.fromId
      }
      const arr: any = []
      item.chats.forEach((val: any) => {
        if (sessionId == val.id) {
          val.msgBody = data.msgBody
          val.msgTime = data.msgTime
          val.msgType = data.msgType
          arr.unshift(val)
        } else {
          arr.push(val)
        }

      })
      console.log('arr', arr);

      item.chats = arr
    }

    return item
  })
  // 未匹配到空间 默认我的会话
  if (!canSearchSpace) {
    const obj: any = silderList.find(val => val.name === '我的会话')
    const arr: any = []
    let sessionId = data.toId
    if (data.fromId !== myId
      && data.toId === myId) {
      sessionId = data.fromId
    }
    obj.chats.forEach((val: any) => {
      if (sessionId == val.id) {
        val.msgBody = data.msgBody
        val.msgTime = data.msgTime
        val.msgType = data.msgType
        arr.unshift(val)
      } else {
        arr.push(val)
      }

    })
    obj.chats = arr
  }

}
// 获取历史消息
const getHistoryMsg = async (id: string, type: string, isGoEnd?: boolean) => {
  // const url: string = type == '人员' ? 'QueryFriendMsg' : 'QueryCohortMsg';
  // const { data = [], success } = await connection.invoke(url, {
  //   [type == '人员' ? 'friendId' : 'cohortId']: id,
  //   offset: pageOffset.value,
  //   limit: limit.value,
  //   spaceId: activeInfo.value.groupId,
  // })

  const url: string = type == '人员' ? 'getFriendMsg' : 'getCohortMsg';
  let params = {
    [type == '人员' ? 'friendId' : 'cohortId']: id,
    offset: pageOffset.value,
    limit: limit.value,
  }
  if (type == '人员') {
    params.spaceId = activeInfo.value.groupId
  }
  const { data = [], success } = await API.history[url]({
    data: params
  })
  if (success) {
    const newHistoryMsgArr = (data.result && data.result?.reverse()) ?? []
    const oldMsg = msgMap.value.get(id) ?? []
    msgMap.value.set(id, [...newHistoryMsgArr, ...oldMsg])
  }
  // console.log('消息msgMap', msgMap.value);
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
@import './components/qqface.scss';

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
      min-height: 180px;
      border-top: 1px solid #ccc;

      .el-textarea__inner {
        color: #fff;
      }
    }
  }
}
</style>
