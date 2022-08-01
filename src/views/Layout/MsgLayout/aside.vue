<template>
  <div class="tac">
    <el-menu
      router
      style="width: 200px; height: calc(100vh - 70px)"
      default-active="userMsg"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="userMsg" :style="style2">
        <span>个人信息</span>
      </el-menu-item>
      <el-menu-item index="userUnit" :style="style2">
        <span>我的单位</span>
      </el-menu-item>
      <el-menu-item index="UnitMsg" :style="style">
        <span>单位信息</span>
      </el-menu-item>
      <el-menu-item index="AffiliatedGroups" :style="style">
        <span>关联集团</span>
      </el-menu-item>
      <el-menu-item index="userAccountBind" :style="style2">
        <span>账号绑定</span>
      </el-menu-item>
      <el-menu-item index="userSaveSet" :style="style2">
        <span>安全设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
  import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
  import { onBeforeMount, ref } from 'vue'
  onBeforeMount(() => {
    workspace()
  })
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  let style = ref('display:none')
  let style2 = ref('display:block')
  const workspace = () => {
    if (sessionStorage.getItem('workspaceName') === '个人空间') {
      style.value = 'display:none'
      style2.value = 'display:block'
    } else {
      style2.value = 'display:block'
      style2.value = 'display:none'
    }
  }
</script>
<style scoped>
  .tac {
    border-right: 6px solid #eff0f4;
  }
  .el-menu-vertical-demo {
    font-weight: 600;
  }
</style>
