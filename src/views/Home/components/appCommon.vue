<template>
  <div class="appCommon">
    <div class="appCommon-title">常用应用推荐</div>
    <div class="appCommon-content">
      <div class="appCommon-content-box" v-for="(item, index) in dataList" :key="index">
        <img src="@/assets/img/app_icon.png" alt="" />
        <div class="textBox">
          <div class="textBox-top">{{ item.name }}</div>
          <div class="textBox-btm">{{ item.introduce }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  setup() {
    const data = reactive({
      dataList: [
        {
          name: '资产监管资产监管',
          introduce: '简单、⾼效、开放的监管⼯具'
        },
        {
          name: '资产监管资产监管',
          introduce: '简单、⾼效、开放的监管⼯具'
        },
        {
          name: '资产监管资产监管',
          introduce: '简单、⾼效、开放的监管⼯具'
        },
        {
          name: '资产监管资产监管',
          introduce: '简单、⾼效、开放的监管⼯具'
        },
        {
          name: '资产监管资产监管',
          introduce: '简单、⾼效、开放的监管⼯具'
        },
        {
          name: '资产监管资产监管',
          introduce: '简单、⾼效、开放的监管⼯具'
        }
      ]
    })
    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>
.appCommon {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  &-title {
    font-size: 18px;
    border-bottom: 1px solid rgb(232, 232, 232);
    font-weight: 600;
    padding: 20px;
    margin-bottom: 10px;
  }
  &-content {
    display: flex;
    width: 100%;
    flex: 1;
    flex-wrap: wrap;
    justify-content: space-around;
    &-box {
      cursor: pointer;
      width: 30%;
      height: 45%;
      border: 1px solid rgb(233, 233, 233);
      display: flex;
      align-items: center;
      padding: 0 10px 0 20px;
      img {
        width: 60px;
        height: 60px;
      }
    }
  }
}
.textBox {
  margin-left: 20px;
  &-top {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  &-btm {
    font-size: 14px;
  }
}
</style>