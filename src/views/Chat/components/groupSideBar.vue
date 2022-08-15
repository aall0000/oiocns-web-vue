<template>
  <div class="chart-side-wrap" @contextmenu.stop>
    <div class="group-side-bar-search">
      <el-input placeholder="搜索" v-model="searchValue" prefix-icon="Search" />
    </div>
    <ul class="group-side-bar-wrap" @contextmenu.prevent="mousePosition.isShowContext = false">
      <!-- <li v-for="o in 20" :class="{ 'group-con': true }">群{{o}}</li> -->
      <li :class="['group-con', props.active.id == item.id ? 'active' : '']" v-for="item in showList" :key="item.id"
        @click="changeInfo(item)" @contextmenu.stop
        @contextmenu.prevent="(e: MouseEvent) => handleContextClick(e, item)">
        <div class="group-con-dot" v-show="props.redDotInfo.get(item.id)?.isShowDot">
          <span>{{ props.redDotInfo.get(item.id)?.count ?? 8 }}</span>
        </div>

        <!-- <img class="group-con-img" src="@/assets/img/userIcon/ic_02.png" alt="头像" /> -->
        <HeadImg :name="item.name" />
        <div class="group-con-show">
          <el-tooltip class="box-item" :disabled="item.name.length < 7" :content="item.name" placement="right-start">
            <p class="group-con-show-name">
              <span class="group-con-show-name-label">{{ props.myId === item.id ? `我 (${item.name})` : item.name }}</span>
              <span class="group-con-show-name-time">{{ handleFormatDate(item.createTime) }} </span>
            </p>
          </el-tooltip>
          <p class="group-con-show-msg" v-html="item?.message?.msgBody"></p>
        </div>
      </li>
      <!-- 鼠标右键 -->
      <ul class="context-text-wrap" v-show="mousePosition.isShowContext"
        :style="{ left: `${mousePosition.left}px`, top: `${mousePosition.top}px` }">
        <li class="context-menu-item" v-for="item in menuList" :key="item.value" @click="handleContextChange(item)">{{
            item.label
        }}</li>
      </ul>
    </ul>
  </div>

</template>

<script lang="ts" setup name="groupSideBar">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { formatDate } from '@/utils/index'
import HeadImg from './headImg.vue'

type propType = {
  active: userType,//当前激活聊天对象信息
  redDotInfo: any,//需要红点提示的标志Map类型 {isShowDot:boolean;count:number} isShowDot是否展示红点,count未读信息数量
  sessionList: userType[],//当前会话列表
  clearHistoryMsg: Function,//清空记录
  myId: string
}
const props = defineProps<propType>()
// 会话列表搜索关键字
const searchValue = ref<string>('')

//根据搜索条件-输出展示列表
const showList = computed((): userType[] => {
  let showInfoArr = props.sessionList
  // console.log('展示顺序',props.sessionList.map(item=>item.name));
  // 数据过滤 搜索关键词是否 在 列表名称 或 显示信息里
  if (searchValue.value) {
    showInfoArr = showInfoArr.filter((item: userType) => {
      return item.name.includes(searchValue.value) || item.message?.msgBody.includes(searchValue.value)
    })
  }
  return showInfoArr
})


const emit = defineEmits(['update:active'])
const changeInfo = (item: userType) => {
  // 触发父组件值更新
  emit('update:active', item)
}

// 时间处理
const handleFormatDate = (timeStr: string) => {
  const nowTime = new Date().getTime()
  const showTime = new Date(timeStr).getTime()

  // 超过一天 展示 月/日
  if (nowTime - showTime > 3600 * 24 * 1000) {
    return formatDate(timeStr, 'MM/dd')
  }
  // 超过一天 展示 时/分
  return formatDate(timeStr, 'H:mm')
}

// 鼠标右键事件
const mousePosition: { left: number, top: number, isShowContext: boolean, selectedItem: userType } = reactive({ left: 0, top: 0, isShowContext: false, selectedItem: {} as userType })
const handleContextClick = (e: MouseEvent, item: userType) => {
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
  window.addEventListener('click', () => { mousePosition.isShowContext = false });
  window.addEventListener('contextmenu', () => { mousePosition.isShowContext = false });
})

// 页面卸载前给他删了
onBeforeUnmount(() => {
  window.removeEventListener('click', () => { })
  window.removeEventListener('contextmenu', () => { mousePosition.isShowContext = false });
})

type MenuItemType = { value: number, label: string };
const menuList: MenuItemType[] = [
  { value: 1, label: '置顶会话' },
  { value: 2, label: '清空信息' },
  // { value: 3, label: '个人信息' },
  // { value: 4, label: '消息免打扰' },
]
// 右键菜单点击
const handleContextChange = (item: MenuItemType) => {
  console.log('右键菜单点击', item, mousePosition.selectedItem);
  switch (item.value) {
    case 1:

      break;
    case 2:
      // props.clearHistoryMsg()
      break;
    case 3:

      break;
    case 4:

      break;

    default:
      break;
  }
}

</script>

<style lang="scss" scoped>
.chart-side-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #ccc;

}

.group-side-bar-search {
  padding: 10px 15px;
}

.group-side-bar-wrap {
  width: 100%;
  height: calc(100vh - 112px);
  overflow-y: auto;
  // position: relative;

  .group-con {
    position: relative;
    padding: 10px 15px 5px;
    display: flex;
    align-items: center;

    &.active {
      color: #0f39d1;
      background-color: #e7ecfb;
    }

    &:hover {
      color: #0f39d1;
    }

    // 头像

    &-img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    &-show {
      width: 100%;

      &-name {

        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;

        &-label {
          font-size: 16px;
          font-weight: bold;
          max-width: 120px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        &-time {
          font-size: 13px;
        }
      }

      &-msg {
        max-width: 140px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 10px;
        padding-top: 5px;
      }
    }



    &-dot {
      position: absolute;
      left: 40px;
      top: 8px;
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

      &:hover {
        background-color: #e3e3e3;
      }
    }
  }
}
</style>
