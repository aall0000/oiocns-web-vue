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
        <el-carousel-item name="first">
          <Login @register="register" @userLogin="userLogin"></Login>
        </el-carousel-item>
        <el-carousel-item name="second">
          <UserInfo @gotoPrev="gotoPrev" @gotoNext="gotoNext"></UserInfo>
        </el-carousel-item>
        <el-carousel-item name="third">
          <Register @gotoPrev="gotoPrev" @registerUser="registerUser"></Register>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="baseLayout_btmText">
      Copyright 2021 资产云开放协同创新中⼼ 主办单位：浙江省财政厅
    </div>
  </div>
</template>

<script lang="ts" setup >
import Login from './components/login.vue'
import Register from './components/register.vue'
import UserInfo from './components/userInfo.vue'
import { ElMessage, ElLoading } from 'element-plus'
import $services from '@/services'
import { reactive, ref } from 'vue'
import { log } from 'console'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const carousel = ref<any>()
const store = useUserStore()
const router = useRouter()

let registerData = reactive<Object>({})
const register = () => {
  carousel.value?.setActiveItem('second')
}
const gotoNext = (data) => {
  registerData = data
  carousel.value?.setActiveItem('third')
  console.log(registerData)
}
const gotoPrev = () => {
  carousel.value?.setActiveItem('first')
}
const userLogin = (data) => {
  console.log(data)
  let params = data
  $services.person
    .login({
      data: {
        account: params.username,
        password: params.password
      }
    })
    .then((res) => {
      if (res.code == 200) {
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        localStorage.setItem('ZCY_LOGIN_DATA', res.data)
        store.updateUserInfo(res.data)
        router.push({ path: 'home' })
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
}
const registerUser = (data) => {
  registerData = { ...registerData, ...data }
  $services.person
    .register({
      data: registerData
    })
    .then((res) => {
      console.log('测试接口', res)
      if (res.code == 200) {
        ElMessage({
          message: '注册成功',
          type: 'success'
        })
        carousel.value?.setActiveItem('first')
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
}
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