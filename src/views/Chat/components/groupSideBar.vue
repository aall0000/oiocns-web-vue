<template>
  <div class="chart-side-wrap" @contextmenu.stop>
    <div class="group-side-bar-search">
      <el-input placeholder="搜索" v-model="searchValue" prefix-icon="Search" />
    </div>
    <div class="group-side-bar-wrap" @contextmenu.prevent="mousePosition.isShowContext = false">
      <ul class="group-con" v-for="item in showList" :key="item.id">
        <li class="group-con-item">
          <!-- 分组标题 -->
          <div class="con-title flex justify-between" :class="[openIdArr.includes(item.id) ? 'active' : '']"
            @click="handleOpenSpace(item.id)">
            <span>{{ item.name }}({{ item?.chats?.length ?? 0 }}) </span>
          </div>
          <!-- 展开的分组下的人员 -->
          <div v-show="openIdArr?.includes(item.id)">
            <div :class="[
              'con-body',
              orgChat.curChat.value?.spaceId === item.id && orgChat.curChat.value?.id === child.id ? 'active' : ''
            ]" v-for="child in item.chats" :key="child.id"
              @contextmenu.prevent.stop="(e: MouseEvent) => handleContextClick(e, child)">
              <HeadImg :name="child.name" :label="child.label" />
              <div class="group-con-dot" v-if="child.noRead > 0">
                <span>{{ child.noRead }}</span>
              </div>
              <div class="group-con-show" @click="openChanged(child)">
                <el-tooltip class="box-item" :disabled="child.name.length < 7" :content="child.name"
                  placement="right-start">
                  <p class="group-con-show-name">
                    <span class="group-con-show-name-label">{{ child.name }}</span>
                    <span class="group-con-show-name-time">{{ handleFormatDate(child.msgTime) }}
                    </span>
                  </p>
                </el-tooltip>
                <p class="group-con-show-msg">{{ child.showTxt }}</p>
              </div>
            </div>
          </div>
          <!-- 如果该分组没有被打开 但是有未读消息 则把未读消息会话显示出来 -->
          <div :class="[
            'con-body',
            orgChat.curChat.value?.spaceId === item.id && orgChat.curChat.value?.id === child.id ? 'active' : ''
          ]" v-for="child in item.chats.filter(
            (v) => v.noRead > 0
          )" :key="child.id + child.name" v-show="!openIdArr?.includes(item.id)"
            @contextmenu.prevent.stop="(e: MouseEvent) => handleContextClick(e, child)">
            <HeadImg :name="child.name" :label="child.label" />
            <div class="group-con-dot" v-if="child.noRead > 0">
              <span>{{ child.noRead }}</span>
            </div>
            <div class="group-con-show" @click="openChanged(child)">
              <el-tooltip class="box-item" :disabled="child.name.length < 7" :content="child.name"
                placement="right-start">
                <p class="group-con-show-name">
                  <span class="group-con-show-name-label">{{child.name }}</span>
                  <span class="group-con-show-name-time">{{ handleFormatDate(child.msgTime) }}
                  </span>
                </p>
              </el-tooltip>
              <p class="group-con-show-msg">{{ child.showTxt }}</p>
            </div>
          </div>
        </li>
      </ul>
      <!-- 鼠标右键 -->
      <ul class="context-text-wrap" v-show="mousePosition.isShowContext"
        :style="{ left: `${mousePosition.left}px`, top: `${mousePosition.top}px` }">
        <li class="context-menu-item" v-for="item in menuList" :key="item.value" @click="handleContextChange(item)">{{
        item.label }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup name="groupSideBar">
import { computed, onBeforeUnmount, onMounted, reactive, ref, Ref, watch } from 'vue'
import { formatDate } from '@/utils/index'
import HeadImg from '@/components/headImg.vue'
import orgChat from '@/hubs/orgchat'

const emit = defineEmits(['openChanged'])
// 会话列表搜索关键字
const searchValue = ref<string>('')

// 是否已加载--判断是否需要默认打开
const isMounted = ref<boolean>(false)

const openChanged = (async (child: ImMsgChildType) => {
  await orgChat.setCurrent(child)
  emit("openChanged", child)
})

//根据搜索条件-输出展示列表
const showList = computed((): ImMsgType[] => {
  let showInfoArr = orgChat.chats.value

  // 数据过滤 搜索关键词是否 在 列表名称 或 显示信息里
  if (searchValue.value) {
    showInfoArr = showInfoArr.map((child: ImMsgType) => {
      const { id, name } = child
      return {
        id,
        name,
        chats: child?.chats?.filter((item: ImMsgChildType) => {
          return item.name.includes(searchValue.value) || item.msgBody?.includes(searchValue.value)
        })
      }
    })
  }

  // 首次进入页面默认打开第一个分组
  if (!isMounted.value && openIdArr.value.length === 0 && showInfoArr.length > 0) {
    openIdArr.value.push(showInfoArr[0].id)
    isMounted.value = true
  }

  return showInfoArr
})

// 时间处理
const handleFormatDate = (timeStr: string) => {
  const nowTime = new Date().getTime()
  const showTime = new Date(timeStr).getTime()

  // 超过一天 展示 月/日
  if (nowTime - showTime > 3600 * 24 * 1000) {
    return formatDate(timeStr, 'M月d日')
  }
  // 超过一天 展示 时/分
  return formatDate(timeStr, 'H:mm')
}

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
  mousePosition.left = e.pageX
  mousePosition.top = e.pageY
  mousePosition.isShowContext = true
  mousePosition.selectedItem = item
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

type MenuItemType = { value: number; label: string }
const menuList: MenuItemType[] = [
  { value: 1, label: '置顶会话' },
  { value: 2, label: '清空信息' }
  // { value: 3, label: '个人信息' },
  // { value: 4, label: '消息免打扰' },
]

const openIdArr = ref<string[]>([])
const handleOpenSpace = (selectedID: string) => {
  const isOpen = openIdArr.value.includes(selectedID)
  if (isOpen) {
    openIdArr.value = openIdArr.value.filter((item: string) => item !== selectedID)
  } else {
    openIdArr.value = [...openIdArr.value, selectedID]
  }
}
// 右键菜单点击
const handleContextChange = (item: MenuItemType) => {
  console.log('右键菜单点击', item, mousePosition.selectedItem)
  switch (item.value) {
    case 1:
      break
    case 2:
      // props.clearHistoryMsg()
      break

    default:
      break
  }
}
</script>

<style lang="scss">
.chart-side-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--el-border-color); // #d8d8d8;
  background-color: var(--el-bg-color);
}

.group-side-bar-search {
  padding: 10px;
}

.group-side-bar-wrap {
  width: 100%;
  height: calc(100vh - 112px);
  padding: 0 10px 10px;
  overflow-y: auto;

  // position: relative;
  &:hover ::-webkit-scrollbar {
    overflow: visible;
    width: 6px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    min-height: 10px;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  &::-webkit-scrollbar-track-piece {
    // margin: 10px 0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    background: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d8d8d8;
  }

  &::-webkit-scrollbar-thumb:vertical:hover {
    background-color: #e1e1e1;
  }

  &::-webkit-scrollbar-thumb:vertical:active {
    background-color: var(--el-primary-color-light-5);
  }

  .group-con {
    // // 头像
    // &-img {
    //   width: 35px;
    //   height: 35px;
    //   margin-right: 10px;
    // }

    &-item {
      cursor: pointer;

      .con-title {
        font-size: 16px;
        font-weight: bold;
        padding: 10px 0;
        color: var(--el-text-color);

        &.active {
          color: var(--el-color-primary);
          border-bottom: none;
        }
      }

      .con-body {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 5px;

        // background-color: var(--el-menu-bg-color);
        &:hover,
        &.active {
          // border-radius: 6px;
          color: var(--el-menu-active-color);
          background-color: var(--el-menu-hover-bg-color);
        }

        border-bottom: 1px solid var(--el-border-color);
      }

      .con-body+.con-body {
        // margin-top: 10px;
      }
    }

    .group-con-show {
      width: 100%;

      &-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;

        &-label {
          font-size: 14px;
          font-weight: bold;
          max-width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        &-time {
          color: #a8a8a8;
          font-size: 12px;
        }
      }

      &-msg {
        max-width: 140px;
        text-overflow: ellipsis;
        max-height: 24px;
        overflow: hidden;
        white-space: nowrap;
        font-size: 10px;
        padding-top: 5px;
        color: #787878;
      }
    }

    &-dot {
      position: absolute;
      left: 35px;
      top: -5px;
      min-width: 18px;
      width: max-content;
      height: 20px;
      background-color: #fa2222;
      border-radius: 50%;
      font-size: 10px;
      color: #ffffff;
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(80%);
    }
  }

  .context-text-wrap {
    position: absolute;
    background-color: #fff;
    width: 110px;
    height: max-content;
    padding: 10px;
    border: 1px solid #e6e6e6;
    box-shadow: 0 0 2px 2px #e6e6e6;
    z-index: 999;

    .context-menu-item {
      padding: 5px;
      cursor: pointer;

      &:hover {
        background-color: #e3e3e3;
      }
    }
  }
}
</style>
