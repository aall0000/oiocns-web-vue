<template>
  <div class="baseLayout">
    <img class="baseLayout-bg" src="@/assets/img/login.png" alt="" />
    <div class="baseLayout-loginBox">
      <el-carousel
        ref="carousel"
        style="height: 100%"
        :autoplay="false"
        indicator-position="none"
        arrow="never"
      >
        <el-carousel-item>
          <Login v-show="!show" @register="register"></Login>
          <Register v-show="show" @gotoPrev="gotoPrev"></Register>
        </el-carousel-item>
        <!-- <el-carousel-item name="second" v-show="show">
          <Register @gotoPrev="gotoPrev"></Register>
        </el-carousel-item> -->
      </el-carousel>
    </div>
    <div class="baseLayout_btmText">
      Copyright 2021 资产云开放协同创新中⼼ 主办单位：浙江省财政厅
    </div>
  </div>
</template>

<script lang="ts">
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import { defineComponent, nextTick, reactive, ref, toRaw, toRefs } from 'vue'
import type { FormInstance } from 'element-plus'
export default defineComponent({
  components: { Login, Register },
  setup() {
    let data = reactive({
      show: false
    })
    const carousel = ref<FormInstance>()
    const register = () => {
      data.show = true
    }
    const gotoPrev = () => {
      data.show = false
    }
    return {
      gotoPrev,
      carousel,
      register,
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-carousel__container) {
  height: 100%;
}
.baseLayout {
  width: 100%;
  height: 100%;
  &-bg {
    position: absolute;
    left: 40px;
    bottom: 0;
    width: 50%;
    height: 80%;
    background-size: 100% 100%;
  }
}
.baseLayout-loginBox {
  width: 25%;
  height: 65%;
  position: absolute;
  right: 10%;
  top: 30%;
}
.baseLayout_btmText {
  position: absolute;
  bottom: 20px;
  right: 10%;
}
</style>