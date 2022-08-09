<template>
  <div class="menu-tab" v-if="showMenu == true">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      mode="vertical"
      router="true"
      @select="handleSelect"
    >
      <el-menu-item index="/organization" >单位维护</el-menu-item>
      <el-menu-item index="/organization">集团维护</el-menu-item>
      <el-menu-item index="3">单位群组</el-menu-item>
      <el-menu-item index="4">我的好友</el-menu-item>
    </el-menu>
  </div>
  <div class="menu-tab" v-if="showMenu == false">
    <el-menu
      :default-active="index"
      @select="personChange"
      class="el-menu-vertical-demo"
      mode="vertical"
    >
      <el-menu-item index="1">我的好友</el-menu-item>
      <el-menu-item index="2">我的群组</el-menu-item>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  defineProps<{
    showMenu: any
    personType: any
  }>()
  const emit = defineEmits(['personTypeChange','menuCheck'])

  const activeIndex = ref<string>('1')
  const index = ref<string>('1')
  const handleSelect = (key: string, keyPath: string[]) => {
    // emit('menuCheck',key)
  }
  const personChange = (index:string) => {
    emit('personTypeChange', index)
  }
</script>
<style lang="scss" scoped>
  .menu-tab {
    width: 100px;
    height: calc(100% - 15px);
    background: #fff;
  }
</style>
