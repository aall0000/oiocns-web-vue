<template>
  <!--    主体-->
  <div class="organization-layout-wrap" style="display: flex;height: 100%;">
    <!--      侧边栏-->
    <teleport v-if="isShowMenu" to="#menu-teleport-target">
      <div class="subMenu">
        <subMenu :showMenu="showMenu" :personType="personType"></subMenu>
      </div>
    </teleport>

    <!--      内容区域home-->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import subMenu from './menu.vue'
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => {
  isShowMenu.value = true
})
let showMenu = ref<boolean>(true)
let personType = ref<string>('1')
const store = useUserStore()
const { workspaceData } = storeToRefs(store)
if (workspaceData.value.name != '个人空间') {
  showMenu.value = true
  router.push('/organization/company')
} else {
  showMenu.value = false
  router.push('/organization/friend')
}
const isShowMenu = ref<boolean>(false)
</script>

<style scoped>
.organization-layout-wrap{
  display: flex;
  flex-direction: column;
}
</style>
