<template>
  <div class="invitateLayout">
    <img class="invitateLayout-img" src="@/assets/img/rw.png" alt="" />
    <div class="invitateLayout-box">
      <div class="invitateLayout-box__topText">邀请更多成员</div>
      <div class="invitateLayout-box__btmText">邀请更多成员加⼊团队吧！</div>
    </div>
    <el-icon><ArrowRight /></el-icon>
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

<style lang="scss" scoped>
.el-icon {
  cursor: pointer;
  position: absolute;
  right: 10%;
}
.invitateLayout {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  &-img {
    margin-left: 15%;
  }
  &-box {
    margin-left: 40px;
    &__topText {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 40px;
    }
    &__btmText {
      color: rgb(108, 108, 108);
      font-size: 16px;
    }
  }
}
</style>