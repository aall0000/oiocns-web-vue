<template>
  <!--    主体-->
  <div style="display: flex; border-top: 6px solid #eff0f4">
    <!--      侧边栏-->
    <teleport v-if="isShowMenu" to="#menu-teleport-target">
      <div class="subMenu">
        <subMenu :showMenu="showMenu" :personType="personType"></subMenu>
      </div>
    </teleport>

    <!--      内容区域home-->
    <router-view style="flex: 1" />
  </div>
</template>

<script setup lang="ts">
import subMenu from './menu.vue'
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
onMounted(() => {
  isShowMenu.value = true
})
let showMenu = ref<boolean>(true)
let personType = ref<string>('1')
const store = useUserStore()
const { workspaceData } = storeToRefs(store)
if (workspaceData.value.name != '个人空间') {
  showMenu.value = true
} else {
  showMenu.value = false
}
const isShowMenu = ref<boolean>(false)
</script>

<style scoped>
</style>
