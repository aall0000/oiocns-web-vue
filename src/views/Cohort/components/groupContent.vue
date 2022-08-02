<template>
  <ul class="group-content-wrap" ref="nodeRef">
    <li class="history-more" @click="getMoreHistory">查看更多</li>
    <template v-for="item in list">
      <li class="group-content-left con" v-if="item.fromId !== myId">
        <img class="con-img" src="@/assets/img/avatar.jpg" alt="">
        <div class="con-content">
          <span class="con-content-name">{{ item.id }}</span>
          <p class="con-content-txt">
            <span>{{ item.msgBody }}</span>
          </p>
        </div>

      </li>
      <li class="group-content-right con" v-else>
        <div class="con-content">
          <span class="con-content-name">{{ item.id }}</span>
          <p class="con-content-txt">
            <span>{{ item.msgBody }}</span>
          </p>
        </div>
        <img class="con-img" src="@/assets/img/avatar.jpg" alt="">
      </li>
    </template>
    <!-- <li class="group-content-left con">
      <img class="con-img" src="@/assets/img/avatar.jpg" alt="">
      <span class="con-txt">三生三世</span>
    </li>
    <li class="group-content-right con">
      <span class="con-txt">我我我我</span>
      <img class="con-img" src="@/assets/img/avatar.jpg" alt="">
    </li> -->
  </ul>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import { debounce } from '@/utils/tools'

type Props = {
  list: any[],//消息列表
  myId: string,//使用者id
}
const { list, myId } = defineProps<Props>()

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
  if (scroll === 0) {
    emit('viewMoreMsg')
  }
  scrollOfZeroToEnd.value = nodeRef.value.scrollHeight - nodeRef.value.scrollTop
}, 300)

onMounted(() => {
  // 添加监听滚动条位置
  window.addEventListener('scroll', scrollTop, true)
})
//移除事件
onUnmounted(() => {
  window.removeEventListener('scroll', scrollTop, true)
})

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
// 暴露子组件方法
defineExpose({
  goPageEnd,
  keepScrollPos
})
</script>

<style lang="scss" scoped>
.group-content-wrap {
  padding: 30px;
  background-color: #F5F5F5;

  .history-more {
    text-align: center;
    color: $mainColor;
  }

  .con {
    display: flex;
    // align-items: center;
    margin-top: 10px;

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
        padding: 5px;
        margin: 0 10px;
        color: #fff;
        background-color: #409eff;
        border-radius: 4px;
      }
    }

  }

  .group-content-left {}

  .group-content-right {
    justify-content: flex-end;
  }


}
</style>
