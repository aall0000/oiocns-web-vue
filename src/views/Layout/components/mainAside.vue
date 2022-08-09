<template>
  <div class="mainAside-wrap">
    <ul class="top-ul">
      <li
        :class="['aside-li', activeRouter.includes(item.key ?? item.path) ? 'active' : '']"
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
        :class="['aside', activeRouter.includes(item.key ?? item.path) ? 'active' : '']"
        v-for="item in mainMenus.filter((a) => a?.bottom === true)"
        @click="handleRouterChage(item)"
      >
        <div class="me" v-if="item.name === '我的'">
          <el-icon class="icon1" :size="20">
            <component :is="item.icon" />
          </el-icon>
          <span class="name1">{{ item.name }}</span>
        </div>
        <div
          :class="['apps', activeRouter.includes(item.key ?? item.path) ? 'active' : '']"
          v-if="item.name === '应用'"
        >
          <el-popover placement="right-end" title="小应用" :width="350" trigger="click">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="我使用的应用" name="1">
                <div
                  v-for="(item, index) in appCreate"
                  :key="index"
                  style="width: 80px; height: 100px; float: left; margin: 10px"
                >
                  <div style="display: flex; flex-direction: column; align-items: center">
                    <img :src="item.icon" style="width: 50px; height: 50px; border-radius: 25px" />
                    <span class="appName">{{ item.name }}</span>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="我创建的应用" name="2">
                <div
                  v-for="(item, index) in appUse"
                  :key="index"
                  style="width: 80px; height: 100px; float: left; margin: 10px"
                >
                  <div style="display: flex; flex-direction: column; align-items: center">
                    <img :src="item.icon" style="width: 50px; height: 50px; border-radius: 25px" />
                    <span class="appName">{{ item.name }}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>

            <template #reference>
              <div class="title">
                <el-icon class="icon2" :size="20">
                  <component :is="item.icon" />
                </el-icon>
                <span class="name2">{{ item.name }}</span>
              </div>
            </template>
          </el-popover>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, unref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'

  import img1 from '@/assets/img/appIcon1.png'
  import img2 from '@/assets/img/appIcon2.png'
  import img3 from '@/assets/img/appIcon.png'
  import img4 from '@/assets/img/appIcon4.png'
  import img5 from '@/assets/img/appIcon5.png'
  import img6 from '@/assets/img/appIcon6.png'

  const router = useRouter()
  const store = useUserStore()
  // const active = ref<string>('工作台')
  // 是否是个人空间  默认是个人空间
  const IsSelfSpace = ref<boolean>(store?.workspaceData?.name === '个人空间' ?? true)

  const activeNames = ref(['1', '2'])
  const activeRouter = ref<string>('')
  // const handleChange = (val: string[]) => {
  //   console.log(val)
  // }
  const mainMenus = [
    { name: '工作台', icon: 'Tickets', path: '/home' },
    { name: '消息', icon: 'ChatDotRound', path: '/chat' },
    { name: '组织架构', icon: 'School', path: '/organization' },
    { name: '商店', icon: 'Grid', path: '/appStore' },
    { name: '应用', icon: 'GoodsFilled', path: '/appStpre', bottom: true },
    { name: '元数据', icon: 'Share', path: '/thing' },
    {
      name: '我的',
      icon: 'Setting',
      path: IsSelfSpace ? '/user' : '/company',
      key: IsSelfSpace ? '/user/' : '/company/',
      bottom: true
    }
  ]
  const appUse = [
    { name: '资产管理', icon: img1 },
    { name: '苹果插件', icon: img2 },
    { name: '推特服务', icon: img3 },
    { name: '办公用品', icon: img4 }
  ]
  const appCreate = [
    { name: '资产云', icon: img5 },
    { name: '云服务', icon: img6 }
  ]
  // onMounted(() => {
  //   judgeMe()
  // })
  // const judgeMe = () => {
  //   if (store.workspaceData.name === '个人空间') {
  //     mainMenus[6].path = '/user/userMsg'
  //   } else {
  //     mainMenus[6].path = '/company/unitMsg'
  //   }
  // }
  const handleRouterChage = (item: any) => {
    if (item.name !== '应用') {
      // active.value = item.name
      router.push(item.path)
    } else {
      // active.value = item.name
    }
  }

  watch(
    () => router.currentRoute.value.path,
    (newValue, oldValue) => {
      activeRouter.value = newValue
    },
    { immediate: true }
  )
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

    .aside {
      display: flex;
      flex-direction: column;
      padding: 4px;
      margin: 6px 6px 0;
      font-size: 12px;
      align-items: center;
      transform: scale(90%);

      .me {
        display: flex;
        flex-direction: column;

        align-items: center;
        transform: scale(90%);

        .icon1 {
          padding: 8px 0;
          margin: 4px;
        }

        .name1 {
          font-weight: bold;
          font-size: 10px;
        }

        &.active {
          background-color: #d1d3d5;
          color: $mainColor;
          border-radius: 10%;
        }
      }

      .apps {
        display: flex;
        flex-direction: column;

        align-items: center;
        transform: scale(90%);

        .title {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          align-items: center;

          .icon2 {
            padding: 8px 0;
            margin: 4px;
          }

          .name2 {
            font-weight: bold;
            font-size: 10px;
          }
        }

        &.active {
          background-color: #d1d3d5;
          color: $mainColor;
          border-radius: 10%;
        }
      }

      &.active {
        background-color: #d1d3d5;
        color: $mainColor;
        border-radius: 10%;
      }
    }
  }
</style>
