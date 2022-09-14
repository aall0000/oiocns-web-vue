<template>
  <el-container class="pages home-wrap">
    <el-header class="page-header">
      <CustomHeadr />
    </el-header>
    <el-container>
      <!-- 主导航 -->
      <el-aside class="main-menu-content">
        <MainAsideVue />
      </el-aside>

      <!-- <div id="menu-teleport-target" /> -->

      <!-- <Breadcrumb></Breadcrumb> -->
      <el-main class="main-wrap">
        <Suspense>
          <template #default>
            <router-view v-slot="{ Component }">
              <transition name="fade-transform">
                <keep-alive v-if="$route.meta.keepAlive">
                  <component :is="Component" />
                </keep-alive>
                <component v-else :is="Component" />
              </transition>
            </router-view>
          </template>

          <template #fallback>
            <LoadingVue />
          </template>
        </Suspense>
      </el-main>
      <!-- <el-footer>Copyright 2021 资产云开放协同创新中⼼ 主办单位：浙江省财政厅</el-footer> -->
      <!-- </el-container> -->
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import CustomHeadr from './components/customHeader.vue'
import MainAsideVue from './components/mainAside.vue'
// import Breadcrumb from './components/breadcrumb.vue'
import LoadingVue from './components/loading.vue'
import { useUserStore } from '@/store/user'
import orgChat from '@/hubs/orgchat'
import { onBeforeMount, onBeforeUnmount,onMounted } from 'vue'
const { userToken, queryInfo, workspaceData } = useUserStore()

const stopConnection = ()=>{
  orgChat.unSubscribed()
  orgChat.stop()
}
onBeforeMount(() => {
  orgChat.start(userToken, queryInfo.id, workspaceData.id)
})

onBeforeUnmount(()=>{
  stopConnection()
  window.removeEventListener('beforeunload', stopConnection)
})

// 页面刷新时 关闭握手
window.addEventListener('beforeunload', stopConnection)

</script>

<style lang="scss" scoped>
.el-header {
  --el-header-padding: 0 0 0 16px;
}

.el-footer {
  background: rgb(240, 242, 245);
  justify-content: center;
  display: flex;
  align-items: center;
}

// // fade-transform
// .fade-transform-leave-active,
// .fade-transform-enter-active {
//   transition: all .5s;
// }

// .fade-transform-enter {
//   opacity: 0;
//   transform: translateX(-30px);
// }

// .fade-transform-leave-to {
//   opacity: 0;
//   transform: translateX(30px);
// }

.home-wrap {
  .page-header {
    // height: 60px;
    box-shadow: 0px 2px 3px 1px var(--el-fill-color);
    background-color: var(--el-bg-color);
    // border-bottom: 1px solid #d7d7d7;
    z-index: calc(var(--el-index-normal) + 2);
  }

  .main-menu-content {
    width: max-content;
    box-shadow: 0px 2px 1px 2px var(--el-fill-color);
    background-color: var(--el-bg-color);
    z-index: 1;
  }

  .main-wrap {
    background: var(--el-bg-color-page);
    // width: 100%;
    // height: 100%;
    position: relative;
    padding: 0;
    // overflow-x: hidden;
  }
}
</style>
