<template>
  <ul class="group-content-wrap" ref="nodeRef" @scroll="scrollEvent">
    <!-- <li class="history-more" @click="getMoreHistory">查看更多</li> -->
    <template v-for="(item, index) in list">
      <li class="group-content-left con" v-if="item.fromId !== myId">
        <!-- <img class="con-img" src="@/assets/img/userIcon/ic_03.png" alt=""> -->
        <HeadImg :name="getUserName(item.fromId)" />
        <div class="con-content">
          <span v-if="showName" class="con-content-name">{{ getUserName(item.fromId) }}</span>
          <div class="con-content-link"></div>
          <div class="con-content-txt" v-html="item.msgBody"></div>
        </div>
      </li>
      <li class="group-content-right con" v-else>
        <div class="con-content">
          <span v-if="showName" class="con-content-name">{{ getUserName(item.fromId) }}</span>
          <div class="con-content-link"></div>
          <div class="con-content-txt" v-html="item.msgBody">
          </div>
          <!-- {{ item.msgBody }} -->

        </div>
        <!-- <img class="con-img" src="@/assets/img/userIcon/ic_06.png" alt=""> -->
        <HeadImg :name="getUserName(myId)" />
      </li>
    </template>
    <!-- 鼠标右键 -->
      <ul class="context-text-wrap" v-show="mousePosition.isShowContext"
        :style="{ left: `${mousePosition.left}px`, top: `${mousePosition.top}px` }">
        <li class="context-menu-item" v-for="item in menuList" :key="item.value" @click="handleContextChange(item)">{{
            item.label
        }}</li>
      </ul>
  </ul>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, onUnmounted, computed, watch, toRefs, reactive } from 'vue';
import { debounce } from '@/utils/tools'
import { useUserStore } from "@/store/user"
import HeadImg from './headImg.vue'

type Props = {
  list: any[],//消息列表
  myId: string,//使用者id
  showName: boolean,
}
const props = defineProps<Props>()
const { list, myId, showName } = toRefs(props)

const { getUserName, userNameMap } = useUserStore()

// const showList = computed(() => {
//   const arr: any[] = props.list?.map((item: any) => {
//     // console.log('item', item.msgBody);
//     // let word = item.msgBody.replace(/\[|\;/gi, '')

//     return item
//   })
//   return arr
// })
// dom节点
const nodeRef = ref(null)
// 事件viewMoreMsg--查看更多
const emit = defineEmits(['viewMoreMsg'])
// 保存当前滚动条距离底部长度
const scrollOfZeroToEnd = ref<number>(0)

// 查看更多事件
const getMoreHistory = () => {
  emit('viewMoreMsg')
}

// 实时滚动条高度
const scrollTop = debounce(() => {
  let scroll = nodeRef.value.scrollTop;
  if (scroll < 10) {
    emit('viewMoreMsg', true)
  }
  console.log('监听滚动', nodeRef.value.scrollHeight);
  // 记录当前滚动位置
  scrollOfZeroToEnd.value = nodeRef.value.scrollHeight - nodeRef.value.scrollTop
}, 200)


// 滚动设置到底部
const goPageEnd = () => {
  nextTick(() => {
    // console.log('滚动底部', nodeRef.value.scrollHeight);
    nodeRef.value.scrollTop = nodeRef.value.scrollHeight
  });
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
type MenuItemType = { value: number, label: string };
const menuList: MenuItemType[] = [
  { value: 1, label: '撤销' },
  { value: 2, label: '删除' },
  // { value: 3, label: '个人信息' },
  // { value: 4, label: '消息免打扰' },
]
// 鼠标右键事件
const mousePosition: { left: number, top: number, isShowContext: boolean, selectedItem: ImMsgChildType } = reactive({ left: 0, top: 0, isShowContext: false, selectedItem: {} as ImMsgChildType })
const handleContextClick = (e: MouseEvent, item: ImMsgChildType) => {
  if (!item) {
    return
  }
  mousePosition.left = e.pageX
  mousePosition.top = e.pageY
  mousePosition.isShowContext = true
  mousePosition.selectedItem = item
}
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
// 暴露子组件方法
defineExpose({
  goPageEnd,
  keepScrollPos
})
</script>

<style lang="scss" scoped>
.group-content-wrap {
  padding: 20px;
  background-color: #f0f2f5;
  transition: all .7s;

  .user-head-img-wrap {
    margin-right: 0;
  }


  .history-more {
    text-align: center;
    color: $mainColor;
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

  .group-content-left {
    .con-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      &-link {
        margin-left: 7px;
        background-color: white;
        box-shadow: -1px 1px 6px 2px rgb(229 229 229);
      }

      &-txt{
        box-shadow: 0 0 5px 5px #e5e5e580;
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
      }

      &-txt {
        text-align: left;
        background-color: #a2ddff;
        box-shadow: 0 0 3px 3px #e5e5e580;
      }
    }
  }

}
</style>
