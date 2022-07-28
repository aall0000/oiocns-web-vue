<template>
  <div class="tac">
      <el-menu
        router
        style="width: 200px; height:calc(100vh - 70px)"
        default-active="userMsg"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="userMsg">
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="userUnit" >
          <span>我的单位</span>
        </el-menu-item>
        <el-menu-item index="UnitMsg">
          <span>单位信息</span>
        </el-menu-item>
        <el-menu-item index="AffiliatedGroups">
          <span>关联集团</span>
        </el-menu-item>
        <el-menu-item index="userAccountBind">
          <span>账号绑定</span>
        </el-menu-item>
        <el-menu-item index="userSaveSet">
          <span>安全设置</span>
        </el-menu-item>
      </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
<style scoped>
.tac{
  border-right: 6px solid #eff0f4 ;
}
.el-menu-vertical-demo{
  font-weight: 600;

}
</style>
