<template>
  <div class="tac">
    <el-menu
      router
      style="width: 200px; height: calc(100vh - 60px)"
      default-active="userMsg"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item :index="item.label" v-for="(item, index) in menu" :key="index">
        {{ item.value }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
  import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
  import { onBeforeMount, onMounted, ref } from 'vue'
  import { useUserStore } from '@/store/user'
  import { useRouter } from 'vue-router'
  const menu = ref([])
  const store = useUserStore()
  const router = useRouter()
  onBeforeMount(() => {
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
      menu.value = [
        {
          value: '个人信息',
          label: '/user/userMsg'
        },
        {
          value: '我的单位',
          label: '/user/userUnit'
        },
        {
          value: '账号绑定',
          label: '/user/userAccountBind'
        },
        {
          value: '安全设置',
          label: '/user/userSaveSet'
        },
        // {
        //   value: '测试',
        //   label: 'test'
        // }
      ]
    } else {
      menu.value = [
        {
          value: '单位信息',
          label: '/company/unitMsg'
        },
        {
          value: '关联集团',
          label: '/company/affiliatedGroups'
        }
      ]
    }
  }
</script>
<style scoped>
  /* .tac {
    border-right: 6px solid #eff0f4;
  } */
  .el-menu-vertical-demo {
    font-weight: 600;
  }
</style>
