<template>
  <ul class="setAppMenu-wrap" :class="className" v-for="(menuItem, index) in menus" :key="index">
    <!-- 子集导航样式 -->
    <template v-if="isChildren">
      <li class="menu-item flex">
        <el-input placeholder="请设置目录名称" v-model="menuItem.caption"></el-input>
        <el-button type="primary" text>
          <el-icon @click="addChild"><CirclePlusFilled />新增</el-icon>
        </el-button>
        <el-button type="primary" text>
          <el-icon><CirclePlusFilled />删除</el-icon>
        </el-button>
        <el-button type="primary" text>
          <el-icon><CirclePlusFilled />排序</el-icon>
        </el-button>
        <el-button type="primary" text>
          <el-icon><CirclePlusFilled />排序</el-icon>
        </el-button>
      </li>
    </template>
    <!-- 一级导航 -->
    <template v-else>
      <li class="menu-item flex">
        <!-- <div class="menu-label">名称1:</div> -->
        <el-input placeholder="请设置目录名称" v-model="menuItem.caption"></el-input>
        <el-icon class="add-btn" :size="20"><CirclePlus /></el-icon>
      </li>
    </template>
    <!-- 共有部分 -->
    <li class="menu-item flex">
      <div class="menu-label">URL地址:</div>
      <el-input placeholder="请设置" v-model="menuItem.link"></el-input>
    </li>
    <li class="menu-item flex">
      <div class="menu-label">菜单类型:</div>
      <el-input placeholder="请设置" v-model="menuItem.menuType"></el-input>
    </li>
    <li class="menu-item flex">
      <div class="menu-label">资源信息:</div>
      <el-input placeholder="请设置" v-model="menuItem.resource"></el-input>
    </li>
    <!-- <li class="more-btn">
      更多 <el-icon class="more"><DArrowLeft /> </el-icon>
    </li> -->
    <el-divider />
    <template v-if="menuItem?.menus?.length">
      <SetAppMenu
        className="child-comp"
        :isChildren="true"
        :menus="menuItem?.menus"
      />
    </template>
  </ul>
</template>
<script lang="ts" setup>
  import SetAppMenu from './setAppMenu.vue'
  type Props = {
    menus?: AppMenuType[]
    className?: string
    isChildren?: boolean
  }

  const { menus, className } = withDefaults(defineProps<Props>(), { isChildren: false })
  console.log('稻城亚丁', menus)
  const emit= defineEmits(['addNewMenu'])
  const addChild= ()=>{
    emit('addNewMenu','test')
  }
</script>

<style lang="scss" scoped>
  .setAppMenu-wrap {
    min-height: 100px;
    .menu-item {
      margin-bottom: 16px;
      display: flex;
      align-items: center;

      .menu-label {
        width: 80px;
        min-width: 80px;
        height: 34px;
        line-height: 34px;
        text-align: right;
        color: #666;
        padding-right: 10px;
        box-sizing: border-box;
      }
      .add-btn {
        cursor: pointer;
        margin: 0 10px;
      }
    }
    .more-btn {
      text-align: center;
      .more {
        transform: rotate(90deg);
      }
      .noMore {
        transform: rotate(270deg);
      }
    }

    .child-comp {
      padding-left: 30px;
    }
    :deep(.el-divider--horizontal) {
      margin: 10px 0;
    }
  }
</style>
