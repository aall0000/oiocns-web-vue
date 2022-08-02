<template>
  <el-scrollbar class="Menu-wrap">
    <el-menu default-active="/home" router @select="handleMenySelect">
      <template v-for="(items, index) in menuList">
        <!-- 有子菜单 -->
        <!-- <MenuItem v-if="items.children && items.children.length !== 0" :menuList="items" :key="items.name">
        </MenuItem> -->
        <el-sub-menu :index="items.index" v-if="items.children && items.children.length !== 0">
          <template #title>
            <el-icon>
              <message />
            </el-icon>{{ items.name }}
          </template>
          <el-menu-item-group>
            <template v-for="(child, index) in items.children">
              <el-menu-item :index="child.index">{{ child.name }}</el-menu-item>
            </template>
          </el-menu-item-group>
        </el-sub-menu>
        <!-- 无子菜单 -->
        <el-menu-item v-else :index="items.index" :name="items?.id">
          <i class="iconfont" :class="items?.icon"></i>
          {{ items.name }}
        </el-menu-item>
      </template>

    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { menuList } from '@/router/index';
const handleMenySelect = (index:number, indexPath:string, item: any, router: any) => {
  // console.log('跳转参数', index, indexPath, item, router);
}
</script>

<style lang='scss' scoped>
.Menu-wrap {

  .el-menu,
  .el-scrollbar__view {
    height: 100%;
  }
}
</style>
