<template>
  <el-card>
    <div class="market-top-card">
      <!-- 左侧 -->
      <div class="left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">应用市场</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/">{{ activeRouterName }}</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="right">
        <!-- 右侧 -->
        <slot name="right"> 按钮区域 </slot>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
  import { ref, watch, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { marketPathList } from '@/router/index'
  const router = useRouter()

  const activeRouter = ref<string>('')
  const activeRouterName = ref<string>('')
  watch(
    () => router.currentRoute.value.path,
    (newValue, oldValue) => {
      activeRouter.value = newValue
      marketPathList.forEach((el: { path: string; name: string }) => {
        if (el.path === newValue) {
          activeRouterName.value = el.name
          console.log(true)
        }
      })
      console.log(router.currentRoute.value.meta.title)
    },
    { immediate: true }
  )
</script>
<style lang="scss" scoped>
  :deep(.el-card__body) {
    padding: 0;
  }
  .market-top-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 20px;
    .left {
      display: flex;
      justify-content: flex-start;
    }
    .right {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
