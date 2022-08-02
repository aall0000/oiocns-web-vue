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
      <el-menu-item index="userMsg" v-for="(item, index) in menu" :key="index">
        <span>{{ item }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
  import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
  import { onBeforeMount, onMounted, ref } from 'vue'
  import { useUserStore } from '@/store/user'
  const menu = ref([])
  let style = ref('display:none')
  let style2 = ref('display:block')
  const store = useUserStore()
  onMounted(() => {
    workspace()
  })
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  const workspace = () => {
    if (store.workspaceData.name === '个人空间') {
      menu.value = ['个人空间', '我的单位', '账号绑定', '安全设置']
    } else {
      menu.value = ['单位信息', '关联集团']
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
