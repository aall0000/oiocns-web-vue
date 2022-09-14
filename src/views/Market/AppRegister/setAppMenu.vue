<template>
  <template v-if="menus.length > 0">
    <ul
      class="setAppMenu-wrap"
      :class="className"
      v-for="(menuItem, index) in menus"
      :key="menuItem.customId"
      @click.stop
    >
      <!-- 子集导航样式 -->
      <li class="menu-item flex">
        <div :class="['menu-label', readOnly ? '' : 'required']">资源名称:</div>
        <el-input
          placeholder="请设置资源名称"
          v-model="menuItem.name"
          :readonly="readOnly"
        ></el-input>
        <el-icon
          class="child-btn"
          v-if="!readOnly"
          @click.stop="handleEvent('Delete', menuItem.customId)"
          ><Delete
        /></el-icon>
        <el-icon
          class="child-btn"
          v-if="!readOnly"
          @click.stop="handleEvent('Up', menuItem.customId)"
          ><SortUp
        /></el-icon>
        <el-icon
          class="child-btn"
          v-if="!readOnly"
          @click.stop="handleEvent('Down', menuItem.customId)"
          ><SortDown
        /></el-icon>
      </li>
      <!-- 共有部分 -->
      <li class="menu-item flex">
        <div :class="['menu-label', readOnly ? '' : 'required']">资源地址:</div>
        <el-input
          placeholder="例如:http://anyinone.com:800/"
          v-model="menuItem.link"
          :readonly="readOnly"
        ></el-input>
      </li>

      <li class="menu-item flex">
        <div class="menu-label">资源编码:</div>
        <el-input placeholder="请设置" v-model="menuItem.code" :readonly="readOnly"></el-input>
      </li>
      <el-divider v-if="index !== menus.length - 1" />
    </ul>
  </template>
  <template v-else>
    <div class="noData" style="text-align: center;margin-top:50px">暂无资源</div>
  </template>
</template>
<script lang="ts" setup>
  // import SetAppMenu from './setAppMenu.vue'
  type Props = {
    readOnly?: boolean
    menus?: AppResourcesType[]
    className?: string
    isChildren?: boolean
  }
  // type ProductMenuEventType = 'add' | 'delete' | 'up' | 'down'
  const { menus, className, readOnly } = withDefaults(defineProps<Props>(), {
    isChildren: false,
    readOnly: false
  })
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
        color: var(--el-text-color-regular);
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
        color: var(--el-text-color-regular);
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
    .noData {
      text-align: center;
    }
  }
</style>
