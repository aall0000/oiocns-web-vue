<template>
  <div class="header">
    <div class="header-left">
      <img class="header-left-img" src="@/assets/img/头像.png" alt="" />
      <!-- <div class="header-left__avater">俞</div> -->
      <div class="header-left-box">
        <div class="header-left-box__top">早安，⽤户13858017756</div>
        <div class="header-left-box__btm">管理⼈员 | 本次登录 2022-02-19 14:03:18</div>
      </div>
    </div>
    <div class="header-right">
      <div class="header-right-box">
        <div class="header-right-top">项目数</div>
        <div class="header-right-btm">0</div>
      </div>
      <div class="divide"></div>
      <div class="header-right-box">
        <div class="header-right-top">团队内排名</div>
        <div class="header-right-btm">
          <div class="header-right-btm__btmText">/24</div>
          <div>0</div>
        </div>
      </div>
      <div class="divide"></div>
      <div class="header-right-box">
        <div class="header-right-top">项目访问</div>
        <div class="header-right-btm">0</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<style lang='scss' scoped>
.divide {
  width: 1px;
  height: 60px;
  background: rgb(233, 233, 233);
}
.header {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  &-left {
    display: flex;
    align-items: center;
    &-img {
      margin-left: 20px;
      margin-right: 20px;
    }
    &__avater {
      margin-left: 20px;
      text-align: center;
      line-height: 60px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgb(35, 72, 211);
      color: #fff;
      font-size: 26px;
      margin-right: 20px;
    }
    &-box {
      margin-top: 10px;
      &__top {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 10px;
      }
      &__btm {
        font-weight: 600;
        font-size: 12px;
        margin-bottom: 10px;
        color: rgb(192, 192, 192);
      }
    }
  }
  &-right {
    display: flex;
    align-items: center;
    &-box {
      margin-right: 20px;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-top {
      margin-bottom: 5px;
    }
    &-btm {
      display: flex;
      font-size: 20px;
      font-weight: 600;
      flex-direction: row-reverse;
      &__btmText {
        font-size: 14px;
        color: rgb(143, 143, 143);
        line-height: 28px;
      }
    }
  }
}
</style>