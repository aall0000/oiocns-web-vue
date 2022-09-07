<template>
  <div class="cohort-wrap">
    <!-- 导航传送门 -->
    <!-- <teleport v-if="isShowMenu" to="#menu-teleport-target"> -->
    <el-aside class="custom-group-silder-menu" width="260px">
      <GroupSideBarVue v-model:active="activeInfo" :clearHistoryMsg="clearHistoryMsg" />
    </el-aside>
    <!-- </teleport> -->

    <!-- 右侧展示主体 -->
    <div class="chart-page">
      <!-- 头部 -->
      <GroupHeaderVue :info="selectInfo" v-if="activeInfo?.id" @viewDetail="handleViewDetail" />
      <!-- 聊天区域 -->
      <GroupContent class="chart-content" :myId="myId" ref="contentWrapRef" :list="showMsgList"
        :showName="activeInfo.typeName != '人员'" @viewMoreMsg="handleViewMoreHistory" @recallMsg="handleRecallMsg"
        @handleReWrite="" />
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
import { useAnyData } from '@/store/anydata'
import anyStore from '@/utils/anystore'
import {
  onMounted,
  reactive,
  ref,
  Ref,
  watch,
  computed,
  onBeforeUnmount,
  nextTick,
  provide
} from 'vue'
import GroupSideBarVue from './components/groupSideBar.vue'
import GroupHeaderVue from './components/groupHeader.vue'
import GroupInputBox from './components/groupInputBox.vue'
import GroupContent from './components/groupContent.vue'
import GroupDetail from './components/groupDetail.vue'
import { useRouter } from 'vue-router'
import orgChat from '@/hubs/orgchat'

interface infoType {
  detail: ImMsgChildType
  userList: userType[]
  total: number
  typeName: string
}
const { setUserNameMap, queryInfo } = useUserStore()
const { updateMessageNoread, setMessageNoRead } = useAnyData()
const router = useRouter()
provide('reWrite', ref(''))
// 是否展示导航
const isShowMenu = ref<boolean>(false)
const isShowDetail = ref<boolean>(false)
// 消息信息列表
const msgMap = ref(new Map())

// 记录历史记录上次搜索信息
const lastQueryParams = ref<any>({})

const showMsgList = computed(() => {
  const key = activeInfo.value.id + '_' + activeInfo.value.spaceId
  return msgMap.value.get(key) ?? []
})
//内容展示 dom节点
const contentWrapRef = ref(null)

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
let selectInfo = reactive<infoType>({
  detail: {} as ImMsgChildType,
  userList: [],
  total: 0,
  typeName: ''
})

onMounted(() => {
  isShowMenu.value = true
  // 订阅未读消息
  anyStore.subscribed(`chats`, (data) => {
    // console.log('noRead===', data)
    setMessageNoRead(data)
  })

  // 把自己加入 名称map
  setUserNameMap(queryInfo.id, queryInfo.name)
  orgChat.subscribed(handleReaciveMsg)
})

// 处理接受消息
const handleReaciveMsg = (data: any) => {
  let sessionId = data.toId
  if (data.fromId !== myId && data.toId === myId) {
    sessionId = data.fromId
  }
  // 当前展示信息列表
  const oldMsg = msgMap.value.get(sessionId + '_' + data.spaceId) ?? []
  // 删除信息成功
  if (data.msgType === 'recall') {
    const newarr = oldMsg.filter((item: ImMsgChildType) => {
      return (
        item.id !== data.id &&
        item.msgBody !== data.msgBody &&
        item.createTime !== data.createTime
      )
    })
    const msg = {
      ...data,
      createTime: new Date().getTime(),
      showTxt: '你撤回了一条消息'
    }
    msgMap.value.set(sessionId + '_' + data.spaceId, [...newarr, msg])
    console.log('撤回了一条消息后', [...newarr, msg])
    return
  }

  //接受消息 保存获取消息至 消息队列

  // msgMap.value.set(sessionId + '_' + data.spaceId, [...oldMsg, data])
  // 根据新信息更新导航信息
  handleNewMsgShow({ ...data })
  contentWrapRef.value.goPageEnd()
}

// 提交信息
const submit = async (value: string) => {

  let text = value.indexOf('span') > -1 ? value : value.replaceAll('&nbsp;', '')
  const params = {
    toId: activeInfo.value.id,
    spaceId: activeInfo.value.spaceId,
    msgType: 'text',
    msgBody: text
  }
  if (activeInfo.value.id && text?.length > 0) {
    await orgChat.sendMsg(params)
  }
}

// 消息撤回
const handleRecallMsg = (item: ImMsgChildType) => {
  if (item.fromId === myId) {
    orgChat.recallMsg([item.id]).then(() => {
      console.log('撤回成功')
    })
  }
}
onBeforeUnmount(() => {
  // 离开页面关闭链接
  orgChat.unSubscribed()
  anyStore.unSubscribed(myId)
})

// 监听所选聊天对象
watch(
  () => activeInfo.value,
  async (val) => {

    const { typeName, id, spaceId } = val
    selectInfo.typeName = typeName
    current.value = 0
    theHistoryMsgTotal = 0
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
    getHistoryMsg(id, spaceId, typeName, true)
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
  const { data, success } = await orgChat.getPersons(id, 10, offset)
  if (success === true) {
    selectInfo.total = data.total
    // 存储用户id=>名称 item.team.name 真实姓名

    data.result.forEach((item: userType) => {
      setUserNameMap(item.id, item.team.name)
    })
    if (offset === 0) {
      selectInfo.userList = data.result
    } else {
      selectInfo.userList = [...selectInfo.userList, ...data.result]
    }
  }
}

const handleNewMsgShow = (data: any) => {
  const silderList = orgChat.chats.value
  orgChat.chats.value = silderList.map((item: any) => {
    // 匹配会话空间
    if (item.id == myId) {
      let allSpaceIds = item.chats.map((c: ImMsgChildType) => {
        return c.id
      })
      if (allSpaceIds.indexOf(data.spaceId) > -1) {
        data.spaceId = myId
      }
    }
    if (item.id === data.spaceId) {
      const arr: any = []
      item.chats.forEach((val: any) => {
        let sessionId = data.toId
        if (val.typeName === '人员' && data.fromId !== myId && data.toId === myId) {
          sessionId = data.fromId
        }
        if (sessionId == val.id) {
          val.msgBody = data.msgBody
          val.msgTime = data.createTime
          val.msgType = data.msgType
          if (data.fromId !== data.toId && (val.id != activeInfo.value.id || item.id != activeInfo.value.spaceId)) {
            val.count = (val.count || 0) + 1
            updateMessageNoread({ groupid: data.spaceId, userid: sessionId, count: 1 })
          }
          arr.unshift(val)
          let key = val.id + '_' + item.id
          let oldMsg = msgMap.value.get(key)
          msgMap.value.set(key, [...oldMsg, data])
        } else {
          arr.push(val)
        }
      })
      item.chats = arr
    }
    return item
  })
}
// 记录当前会话历史消息总数
let theHistoryMsgTotal: number = 0
// 获取历史消息
const getHistoryMsg = async (id: string, spaceId: string, type: string, isGoEnd?: boolean) => {
  const url: string = type == '人员' ? 'QueryFriendMsg' : 'QueryCohortMsg'
  const { data = [], success } = await orgChat.getHistoryMsg(id, spaceId, type, limit.value, pageOffset.value)
  if (success) {
    const newHistoryMsgArr = (data.result && data.result?.reverse()) ?? []
    theHistoryMsgTotal = data.total
    const oldMsg = msgMap.value.get(id + '_' + spaceId) ?? []
    msgMap.value.set(id + '_' + spaceId, [...newHistoryMsgArr, ...oldMsg])
    if (isGoEnd) {
      contentWrapRef.value?.goPageEnd()
    } else {
      contentWrapRef.value?.keepScrollPos()
    }
  }
}

//清空历史记录
const clearHistoryMsg = () => {
  msgMap.value.clear()
}

// 获取更多历史消息
const handleViewMoreHistory = () => {
  // 当开始下下标 超过历史记录总数 停用请求
  if (theHistoryMsgTotal > 0 && theHistoryMsgTotal < pageOffset.value) {
    return
  }
  current.value++
  getHistoryMsg(activeInfo.value.id, activeInfo.value.spaceId, activeInfo.value.typeName)
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
      border-top: 1px solid var(--el-border-color); // #ccc;

      .el-textarea__inner {
        color: #fff;
      }
    }
  }
}
</style>
