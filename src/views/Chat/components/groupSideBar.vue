<template>
  <div class="chart-side-wrap">
    <div class="group-side-bar-search">
      <el-input placeholder="搜索" v-model="searchValue" prefix-icon="Search" />
    </div>
    <ul class="group-side-bar-wrap">
      <!-- <li v-for="o in 20" :class="{ 'group-con': true }">群{{o}}</li> -->
      <li :class="['group-con', props.active.id == item.id ? 'active' : '']" v-for="item in showList" :key="item.id"
        @click="changeInfo(item)">
        <div class="group-con-dot" v-show="props.redDotInfo.get(item.id)?.isShowDot">
          <span>{{ props.redDotInfo.get(item.id)?.count ?? 8 }}</span>
        </div>

        <img class="group-con-img" src="@/assets/img/userIcon/ic_02.png" alt="头像" />
        <div class="group-con-show">
          <el-tooltip class="box-item" :disabled="item.name.length < 7" :content="item.name" placement="right-start">
            <p class="group-con-show-name">
              <span class="group-con-show-name-label">{{ item.name }}</span>
              <span class="group-con-show-name-time">{{ handleFormatDate(item.createTime) }} </span>
            </p>
          </el-tooltip>
          <p class="group-con-show-msg">{{ item?.message?.msgBody }}</p>
        </div>
      </li>
    </ul>
  </div>

</template>

<script lang="ts" setup name="groupSideBar">
import { computed, ref, watch } from 'vue'
import { formatDate } from '@/utils/index'

type propType = {
  active: userType,//当前激活聊天对象信息
  redDotInfo: any,//需要红点提示的标志Map类型 {isShowDot:boolean;count:number} isShowDot是否展示红点,count未读信息数量
  sessionList: userType[],//当前会话列表
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

</script>

<style lang="scss" scoped>
.chart-side-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 60px);
  border-right: 1px solid #ccc;

}

.group-side-bar-search {
  padding: 10px 15px;
}

.group-side-bar-wrap {
  width: 100%;
  flex: 1 1 0;
  overflow-y: auto;

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
          max-width: 140px;
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
}
</style>
