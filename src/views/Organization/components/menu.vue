<template>
  <div class="menu-tab" v-if="showMenu == true">
    <el-menu router :default-active="ActiveUrl" class="el-menu-vertical-demo" mode="vertical">
      <el-menu-item index="/organization/company">单位维护</el-menu-item>
      <el-menu-item index="/organization/group">集团维护</el-menu-item>
      <el-menu-item index="/organization/cohort">单位群组</el-menu-item>
      <el-menu-item index="/organization/friend">我的好友</el-menu-item>
    </el-menu>
  </div>
  <div class="menu-tab" v-if="showMenu == false">
    <el-menu router default-active="/organization/friend" class="el-menu-vertical-demo" mode="vertical">
      <el-menu-item index="/organization/friend">我的好友</el-menu-item>
      <el-menu-item index="/organization/cohort">我的群组</el-menu-item>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
import { ref ,onMounted} from 'vue'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
defineProps<{
  showMenu: any
  personType: any
}>()
const store = useUserStore()
const { workspaceData } = storeToRefs(store)
const ActiveUrl = ref<string>('/organization/company')
const index = ref<string>('1')
onMounted(() => {

})
</script>
<style lang="scss" scoped>
.menu-tab {
  width: 200px;
  height: calc(100% - 15px);
  background: #fff;
}
</style>
