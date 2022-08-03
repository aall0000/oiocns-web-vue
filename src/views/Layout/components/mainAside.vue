<template>
  <ul class='mainAside-wrap'>
    <li :class="['aside-li', item.name === active ? 'active' : '']" v-for="item in mainMenus"
      @click="handleRouterChage(item)">
      <el-icon class="aside-li-icon" :size="20">
        <component :is="item.icon" />
      </el-icon>
      <span class="aside-li-name">{{ item.name }}</span>
    </li>

  </ul>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const active = ref<string>('消息')
const mainMenus = [
  { name: '消息', icon: 'Apple', path: '/cohort' },
  { name: '工作台', icon: 'Aim', path: '/thing' },
  { name: '组织架构', icon: 'Apple', path: '/organization' },
  { name: '应用', icon: 'Apple', path: '/personalApp' },
  { name: '市场', icon: 'Clock', path: '/appStore' },
  { name: '我的', icon: 'Apple', path: '/userMsg' },
  { name: '元数据', icon: 'Apple', path: '/work' }
]

const handleRouterChage = (item: any) => {
  active.value = item.name
  router.push(item.path)

}

</script>

<style lang='scss' scoped>
.mainAside-wrap {
  min-width: 60px;
  height: 100%;
  background-color: #f4f4f4;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0;
  overflow: hidden;

  .aside-li {
    display: flex;
    flex-direction: column;
    padding: 4px;
    margin: 6px 6px 0;
    font-size: 12px;
    align-items: center;
    transform: scale(90%);

    &-icon {
      padding: 8px 0;
      margin: 4px;
    }

    &-name {
      font-weight: bold;
      font-size: 10px;
    }

    &.active {
      background-color: #D1D3D5;
      color: $mainColor;
      border-radius: 10%;
    }
  }
}
</style>
