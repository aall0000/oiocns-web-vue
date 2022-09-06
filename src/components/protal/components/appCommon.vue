<template>
  <el-card class="appCommon" body-style="padding:0">
    <template #header>
      <div class="appCommon-title">常用应用推荐</div>
    </template>

    <div class="appCommon-content">
      <div class="appCommon-content-box" v-for="(item, index) in dataList" :key="index" @click="joinFriends(item)">
        <el-icon class="appCommon-content-icon" :size="22" :color="item.iconcolor">
          <component :is="item?.icon"></component>
        </el-icon>
        <!-- <img src="@/assets/img/whatsapp.png" alt="" /> -->
        <div class="textBox">
          <div class="textBox-top">{{ item.name }}</div>
          <div class="textBox-btm">{{ item.introduce }}</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const emit = defineEmits(['joinFriend'])
const dataList = reactive([
  {
    name: '添加好友',
    introduce: '添加好友',
    metohd: 'friend',
    icon: 'Notification',
    iconcolor: '#30bf78'
  },
  {
    name: '资产监管资产监管',
    introduce: '简单、⾼效、开放的监管⼯具',
    icon: 'Coin',
    iconcolor: '#6596f6'
  },
  {
    name: '资产监管资产监管',
    introduce: '简单、⾼效、开放的监管⼯具',
    icon: 'Notification',
    iconcolor: '#f4c237'
  },
  {
    name: '资产监管资产监管',
    introduce: '简单、⾼效、开放的监管⼯具',
    icon: 'Notification',
    iconcolor: '#737fb9'
  },
  {
    name: '资产监管资产监管',
    introduce: '简单、⾼效、开放的监管⼯具',
    icon: 'Notification',
    iconcolor: '#30bf78'
  },
  {
    name: '资产监管资产监管',
    introduce: '简单、⾼效、开放的监管⼯具',
    icon: 'Notification',
    iconcolor: '#4d5766'
  }
])
const joinFriends = (item: any) => {
  if (item.metohd == 'friend') {
    emit('joinFriend')
  }
}
</script>

<style lang="scss" scoped>
.appCommon {
  width: 100%;
  height: 100%;
  background: var(--el-bg-color-overlay);
  // display: flex;
  // flex-direction: column;
  overflow: hidden;

  &-title {
    font-size: 16px;
    // border-bottom: 1px solid rgb(232, 232, 232);
    // font-weight: 600;
    // padding: 20px;
    // margin-bottom: 10px;
  }

  &-content {
    // display: flex;
    // width: 100%;
    // height: 100%;
    // flex: 1;
    // flex-wrap: wrap;
    // justify-content: space-around;
    display: grid;
    width: 100%;
    // grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(3, 1fr);
    grid-auto-flow: row;

    &-box {
      cursor: pointer;
      // width: 30%;
      // height: 40%;
      border-bottom: 1px solid var(--el-card-border-color);
      border-left: 1px solid var(--el-card-border-color);
      display: flex;
      align-items: center;
      padding: 37px 24px;
      transition: all var(--el-transition-duration);

      &:hover {
        background-color: var(--el-border-color-extra-light);
        color: var(--brand-color-light);
        box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%);

      }

      // img {
      //   width: 60px;
      //   height: 60px;
      // }
    }

    &-icon {
      background-color: #e9ebf5;
      border-radius: 50%;
      width: 56px;
      height: 56px;
    }
  }
}

.textBox {
  margin-left: 20px;

  &-top {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    // color: var(--el-text-color-regular);
  }

  &-btm {
    font-size: 14px;
    color: var(--el-color-info);
  }
}
</style>
