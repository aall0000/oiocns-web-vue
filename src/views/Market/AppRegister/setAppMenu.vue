<template>
  <ul
    class="setAppMenu-wrap"
    :class="className"
    v-for="(menuItem, index) in menus"
    :key="menuItem.customId"
    @click.stop
  >
    <!-- 子集导航样式 -->
    <li class="menu-item flex">
      <el-input placeholder="请设置资源名称" v-model="menuItem.name"></el-input>
      <!-- <el-icon class="child-btn" @click.stop="handleEvent('Add', menuItem.customId)">
        <CirclePlus />
      </el-icon> -->
      <el-icon class="child-btn" @click.stop="handleEvent('Delete', menuItem.customId)"
        ><Delete
      /></el-icon>
      <el-icon class="child-btn" @click.stop="handleEvent('Up', menuItem.customId)"
        ><SortUp
      /></el-icon>
      <el-icon class="child-btn" @click.stop="handleEvent('Down', menuItem.customId)"
        ><SortDown
      /></el-icon>
    </li>
    <!-- 一级导航 -->
    <!-- <template v-else>
      <li class="menu-item flex">
        <el-input placeholder="应用名称" readonly v-model="menuItem.name"></el-input>
        <el-icon class="add-btn" :size="20" @click.stop="handleEvent('Add', menuItem.customId)">
          <CirclePlus />
        </el-icon>
      </li>
    </template> -->
    <!-- 共有部分 -->
    <li class="menu-item flex">
      <div class="menu-label required">资源地址:</div>
      <el-input placeholder="例如:http://anyinone.com:800/" v-model="menuItem.link"></el-input>
    </li>

    <li class="menu-item flex">
      <div class="menu-label">资源编码:</div>
      <el-input placeholder="请设置" v-model="menuItem.code"></el-input>
    </li>
    <li class="menu-item flex">
      <div class="menu-label">密钥:</div>
      <el-input placeholder="请设置" v-model="menuItem.privateKey"></el-input>
    </li>
    <!-- <li class="more-btn">
      更多 <el-icon class="more"><DArrowLeft /> </el-icon>
    </li> -->

    <el-divider v-if="index !== menus.length - 1" />
    <!-- <template v-if="menuItem?.menus">
      <SetAppMenu
        className="child-comp"
        :isChildren="true"
        :menus="menuItem.menus"
        @handleMemuEvent="handleEvent"
        :key="menuItem.menus.length"
      />
    </template> -->
  </ul>
</template>
<script lang="ts" setup>
  // import SetAppMenu from './setAppMenu.vue'
  type Props = {
    menus?: AppMenuType[]
    className?: string
    isChildren?: boolean
  }
  // type ProductMenuEventType = 'add' | 'delete' | 'up' | 'down'
  const { menus, className } = withDefaults(defineProps<Props>(), { isChildren: false })
  console.log('稻城亚丁', menus)
  const emit = defineEmits(['handleMemuEvent'])
  const handleEvent = (type: ProductMenuEventType, id: string) => {
    emit('handleMemuEvent', type, id)
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
        position: relative;
        width: 90px;
        min-width: 90px;
        height: 34px;
        font-size: 14px;
        line-height: 34px;
        text-align: right;
        color: #666;
        padding-right: 10px;
        box-sizing: border-box;
      }
      .required::after {
        position: absolute;
        left: -8px;
        font-size: 14px;
        content: '*';
        color: var(--el-color-danger);
        margin-right: 4px;
        transform: translateX(20px);
      }
      .add-btn {
        cursor: pointer;
        color: var(--el-color-primary);
        margin: 0 10px;
      }
      .child-btn {
        cursor: pointer;
        color: #575757;
        margin: 0 8px;
        &:hover {
          color: var(--el-color-primary);
        }
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
