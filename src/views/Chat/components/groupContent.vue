<template>
  <div class="group-content-wrap" ref="nodeRef" @scroll="scrollEvent">
    <template  v-for="(item, index) in list" :key="item.fromId">
        <!-- 聊天间隔时间3分钟则 显示时间 -->
        <div class="chats-space-Time"
          v-if="index == 0 || moment(item?.updateTime).diff(list[index - 1].updateTime, 'minute') > 3">
          <span>
            {{  showChatTime(item?.updateTime)  }}
          </span>
        </div>
        <!-- 左侧聊天内容显示 -->
        <div class="group-content-left con recall" v-if="item.msgType === 'recall'">
          {{  item.showTxt  }}
        </div>

        <div class="group-content-left con" v-else-if="item.fromId !== myId" >
          <HeadImg :name="orgChat.getName(item.fromId)" :label="''" />
          <div class="con-content">
            <span v-if="showName" class="con-content-name">{{  orgChat.getName(item.fromId)  }}</span>
            <div class="con-content-link"></div>
            <div class="con-content-txt" v-html="item.msgBody"></div>
          </div>
        </div>
        <!-- 右侧内容显示 -->
        <div class="group-content-right con" v-else>
          <div class="con-content" @contextmenu.prevent.stop="(e: MouseEvent) => handleContextClick(e, item)">
            <div class="con-content-link"></div>
            <div class="con-content-txt" v-html="item.msgBody"></div>
          </div>
          <HeadImg :name="orgChat.getName(myId)" />
        </div>
    </template>
    <!-- 鼠标右键 -->
    <ul class="context-text-wrap" v-show="mousePosition.isShowContext"
      :style="{ left: `${mousePosition.left}px`, top: `${mousePosition.top}px` }">
      <li class="context-menu-item" v-for="item in menuList" :key="item.value" @click="handleContextChange(item)">{{
         item.label  }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
  nextTick,
  toRefs,
  reactive,
  onBeforeUnmount,
  inject
} from 'vue'
import { debounce } from '@/utils/tools'
import HeadImg from '@/components/headImg.vue'
import moment from 'moment'
import orgChat from '@/hubs/orgchat'

type Props = {
  list: any[] //消息列表
  myId: string //使用者id
  showName: boolean
}
const props = defineProps<Props>()
const { list, myId, showName } = toRefs(props)


// dom节点
const nodeRef = ref(null)
// 事件viewMoreMsg--查看更多 recallMsg--撤销消息
const emit = defineEmits(['viewMoreMsg', 'recallMsg', 'handleReWrite'])
// 保存当前滚动条距离底部长度
const scrollOfZeroToEnd = ref<number>(0)

// 查看更多事件
const getMoreHistory = () => {
  emit('viewMoreMsg')
}
const info = inject('reWrite', ref(''))
// 重新编辑功能
const handleReWrite = (txt: string) => {
  info.value = txt
  emit('handleReWrite', txt)
}

// 显示聊天间隔时间
const showChatTime = (chatDate: moment.MomentInput) => {
  const formatTime = moment(chatDate).format('MM月DD日 a hh:mm')
  const formatTimeArr = formatTime.split(' ')
  const showText = { am: '上午 ', pm: '下午 ' }[formatTimeArr[1]] + formatTimeArr[2]
  if (!moment(chatDate).isBefore(moment(), 'day')) { // 今天
    return showText
  }
  return formatTimeArr[0] + ' ' + showText // 今天之前
}

// 实时滚动条高度
const scrollTop = debounce(() => {
  let scroll = nodeRef.value.scrollTop
  if (scroll < 10) {
    emit('viewMoreMsg', true)
  }
  console.log('监听滚动', nodeRef.value.scrollHeight)
  // 记录当前滚动位置
  scrollOfZeroToEnd.value = nodeRef.value.scrollHeight - nodeRef.value.scrollTop
}, 200)

// 滚动设置到底部
const goPageEnd = () => {
  nextTick(() => {
    nodeRef.value.scrollTop = nodeRef.value.scrollHeight
  })
}
// 加载更多时,滚动位置固定
const keepScrollPos = () => {
  nextTick(() => {
    nodeRef.value.scrollTop = nodeRef.value.scrollHeight - scrollOfZeroToEnd.value
  })
}

const scrollEvent = () => {
  scrollTop(nodeRef.value.scrollTop)
}
type MenuItemType = { value: number; label: string }
const menuList: MenuItemType[] = [
  { value: 1, label: '撤销' }
  // { value: 2, label: '删除' },
  // { value: 3, label: '个人信息' },
  // { value: 4, label: '消息免打扰' },
]
// 鼠标右键事件
const mousePosition: {
  left: number
  top: number
  isShowContext: boolean
  selectedItem: ImMsgChildType
} = reactive({ left: 0, top: 0, isShowContext: false, selectedItem: {} as ImMsgChildType })
const handleContextClick = (e: MouseEvent, item: ImMsgChildType) => {

  if (!item) {
    return
  }
  mousePosition.left = e.pageX - 60 - 260
  mousePosition.top = e.pageY - 60
  mousePosition.isShowContext = true
  mousePosition.selectedItem = item
}
// 右键菜单点击
const handleContextChange = (item: MenuItemType) => {
  switch (item.value) {
    case 1:
      emit('recallMsg', mousePosition.selectedItem)
      break
    case 2:
      // props.clearHistoryMsg()
      break

    default:
      break
  }
}
// 页面加载完毕，点击其他位置则隐藏菜单
onMounted(() => {
  window.addEventListener('click', () => {
    mousePosition.isShowContext = false
  })
  window.addEventListener('contextmenu', () => {
    mousePosition.isShowContext = false
  })
})

// 页面卸载前给他删了
onBeforeUnmount(() => {
  window.removeEventListener('click', () => { })
  window.removeEventListener('contextmenu', () => {
    mousePosition.isShowContext = false
  })
})
// 暴露子组件方法
defineExpose({
  goPageEnd,
  keepScrollPos
})
</script>
<style>
 .con-content-txt img {
    max-width: 400px;
    max-height: 400px;
  }

</style>
<style lang="scss" scoped>
 
.group-content-wrap {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  transition: all 0.7s;

  .chats-space-Time {
    margin: 0 auto;
    text-align: center;

    span {
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
      border-radius: 4px;
      font-size: 12px;
      padding: 2px 8px;
      color: var(--el-text-color-placeholder);
    }
  }

  .user-head-img-wrap {
    margin-right: 0;
  }

  .history-more {
    text-align: center;
    color: var(--el-color-primary);
  }

  .con {
    display: flex;
    // align-items: center;
    margin: 10px 0;

    &-img {
      height: 35px;
      width: 35px;
    }

    &-content {
      max-width: 50%;

      &-name {
        margin: 0 10px;
        font-size: 10px;
      }

      &-txt {
        min-height: 30px;
        padding: 10px;
        margin: 0 10px;
        color: black;
        background-color: white;
        border-radius: 5px;
        z-index: 1;
        margin-top: -10px;
        font-size: small;
      }

      &-link {
        width: 15px;
        height: 15px;
        display: inline-block;
        border-color: transparent;
        border-style: solid;
        border-width: 2px;
        position: relative;
        top: 15px;
        -moz-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        z-index: 0;
      }
    }
  }

  .recall {
    font-size: 12px;
    justify-content: center;

    .reWrite {
      margin-left: 4px;
      cursor: pointer;
      color: var(--el-color-primary);
    }
  }

  .group-content-left {
    .con-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      &-link {
        margin-left: 7px;
        background-color: var(--el-bg-color-overlay);// white;
        box-shadow: var(--el-box-shadow-lighter);// -1px 1px 6px 2px rgb(229 229 229);
      }

      &-txt {
        color: var(--el-text-color);
        background-color: var(--el-bg-color-overlay) ;
        box-shadow: var(--el-box-shadow-lighter);// 0 0 5px 5px #e5e5e580;
      }
    }
  }

  .group-content-right {
    justify-content: flex-end;

    .con-content {
      max-width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;

      &-link {
        margin-right: 7px;
        background-color: #a2ddff;
        box-shadow: var(--el-box-shadow-lighter);
      }

      &-txt {
        text-align: left;
        background-color: #a2ddff;
        box-shadow: var(--el-box-shadow-lighter);// 0 0 3px 3px #e5e5e580;
      }
    }
  }

  .context-text-wrap {
    position: absolute;
    background-color: #fff;
    width: 80px;
    height: max-content;
    border: 1px solid #e6e6e6;
    box-shadow: 0 0 2px 2px #e6e6e6;
    z-index: 999;

    .context-menu-item {
      padding: 4px 6px;
      cursor: pointer;
      text-align: center;

      &:hover {
        background-color: #efefef;
      }
    }
  }
}
</style>
