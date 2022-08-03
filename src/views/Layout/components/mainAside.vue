<template>
  <div class="mainAside-wrap">
    <ul class="top-ul">
      <li
        :class="['aside-li', item.name === active ? 'active' : '']"
        v-for="item in mainMenus.filter((a) => !a?.bottom)"
        @click="handleRouterChage(item)"
      >
        <el-icon class="aside-li-icon" :size="20">
          <component :is="item.icon" />
        </el-icon>
        <span class="aside-li-name">{{ item.name }}</span>
      </li>
    </ul>
    <ul class="top-ul">
      <li
        :class="['aside-li', item.name === active ? 'active' : '']"
        v-for="item in mainMenus.filter((a) => a?.bottom === true)"
        @click="handleRouterChage(item)"
      >
        <el-icon class="aside-li-icon" :size="20">
          <component :is="item.icon" />
        </el-icon>
        <span class="aside-li-name">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'
  const router = useRouter()
  const store = useUserStore()
  const active = ref<string>('工作台')
  const mainMenus = [
    { name: '工作台', icon: 'Tickets', path: '/thing' },
    { name: '消息', icon: 'ChatDotRound', path: '/cohort' },
    { name: '组织架构', icon: 'School', path: '/organization' },
    { name: '应用', icon: 'Grid', path: '/personalApp' },
    { name: '市场', icon: 'GoodsFilled', path: '/appStore' },
    { name: '元数据', icon: 'Share', path: '/work' },
    { name: '我的', icon: 'Setting', path: '/user/userMsg', bottom: true }
  ]
  onBeforeMount(() => {
    judgeMe()
  })
  const judgeMe = () => {
    if (store.workspaceData.name === '个人空间') {
      mainMenus[6].path = '/user/userMsg'
    } else {
      mainMenus[6].path = '/company/unitMsg'
    }
  }
  const handleRouterChage = (item: any) => {
    active.value = item.name
    router.push(item.path)
  }
</script>

<style lang="scss" scoped>
  .mainAside-wrap {
    min-width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 60px);
    padding-bottom: 20px;
    background-color: #f4f4f4;
    box-sizing: border-box;
    border-right: 1px solid #e0e0e0;
    // overflow: hidden;

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
        background-color: #d1d3d5;
        color: $mainColor;
        border-radius: 10%;
      }
    }
  }
</style>
