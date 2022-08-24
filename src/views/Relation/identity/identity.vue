<template>
  <div class="container">
      <el-menu router :default-active="currentRouter" class="menus" mode="vertical">
        <div class="search-wrap">
          <el-input class="search" v-model="filterText" placeholder="搜索身份">
            <template #suffix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
          <li class="con tree-btns">
            <el-icon color="#154ad8" :size="20" @click="createGroupDialogVisible = true">
              <CirclePlus />
            </el-icon>
          </li>
        </div>
        <el-menu-item>身份1</el-menu-item>
        <el-menu-item>身份2</el-menu-item>
        <el-menu-item>身份3</el-menu-item>
        <el-menu-item>身份4</el-menu-item>
      </el-menu>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import { ref, onMounted } from 'vue'
  const emit = defineEmits(['itemClick'])

  const router = useRouter()

  const itemClick = (val: any) => {
    emit('itemClick', val)
  }

  onMounted(() => {


  })


</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  width: 100%;
  background: #fff;
}
.menu-container{
  width: 100%;
}
.menus{
  width: 100%;
  height: 100%;
}
.search-wrap{
  width: 100%;
}
.search {
  font-size: 12px;
  .el-input__inner {
    font-size: 12px;
  }
}

.custom-tree-node {
  overflow: hidden;
  text-overflow: ellipsis;
  word-spacing: nowrap;
  display: flex;
  cursor: pointer;
}

</style>
