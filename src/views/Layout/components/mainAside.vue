<template>
  <div v-show="visible" class="menuRight" :style="{ left: left + 'px', top: top + 'px' }">
    <div class="menuRight-fixed" @click="clickFixed">固定在菜单上</div>
    <div class="menuRight-cancel" @click="cancelFixed">取消固定</div>
  </div>
  <div class="mainAside-wrap">
    <ul class="top-ul">
      <li
        :class="['aside-li', activeRouter.includes(item.path) ? 'active' : '']"
        v-for="item in state.mainMenus.filter((a) => !a?.bottom)"
        @click="handleRouterChage(item)"
        @contextmenu.prevent="rightClick($event, item)"
      >
        <el-icon v-if="!item.type" class="aside-li-icon" :size="20">
          <component :is="item.icon" />
        </el-icon>
        <img v-else :src="item.icon" style="width: 18px; height: 18px; border-radius: 25px" />
        <span class="aside-li-name">{{ item.name }}</span>
      </li>
    </ul>
    <ul class="top-ul">
      <li
        :class="['aside', activeRouter.includes(item.path) ? 'active' : '']"
        v-for="item in state.mainMenus.filter((a) => a?.bottom === true)"
        @click="handleRouterChage(item)"
      >
        <div class="me" v-if="item.name === '我的'">
          <el-icon class="icon1" :size="20">
            <component :is="item.icon" />
          </el-icon>
          <span class="name1">{{ item.name }}</span>
        </div>
        <div
          :class="['apps', activeRouter.includes(item.path) ? 'active' : '']"
          v-if="item.name === '应用'"
        >
          <el-popover placement="right-end" title="小应用" :width="350" trigger="click">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="我使用的应用" name="1">
                <div
                  v-for="(item, index) in appCreate"
                  :key="index"
                  style="width: 80px; height: 100px; float: left; margin: 10px"
                  @click="onAppClick(item)"
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
                  @click="onAppClick(item)"
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
  import { ref, onMounted, onUnmounted, unref, watch, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
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
  type MenuItemType = {
    id?: string
    name: string
    icon: string
    path: string
    type?: string
    fixed?: boolean
    key?: string | unknown
    bottom?: boolean | unknown
  }
  type StateType = {
    mainMenus: MenuItemType[]
    clickMenu: Array<MenuItemType>
    storeObj: MenuItemType
  }
  const state: StateType = reactive({
    mainMenus: [
      { name: '工作台', icon: 'House', path: '/workHome' },
      { name: '消息', icon: 'ChatDotRound', path: '/chat' },
      { name: '关系', icon: 'Avatar', path: '/relation' },
      { name: '组织', icon: 'Avatar', path: '/organization' },
      { name: '市场', icon: 'GoodsFilled', path: '/appStore' },
      { name: '应用', icon: 'Grid', path: '/appStpre', bottom: true },
      { name: '数据', icon: 'Share', path: '/thing' },
      {
        name: '我的',
        icon: 'Operation',
        path: IsSelfSpace ? '/user' : '/company',
        bottom: true
      }
    ],
    clickMenu: [],
    storeObj: {
      id: '',
      name: '',
      icon: '',
      path: ''
    }
  })
  const visible = ref(false)
  const left = ref(0)
  const top = ref(0)
  // const mainMenus = [
  //   { name: '工作台', icon: 'House', path: '/workHome' },
  //   { name: '消息', icon: 'ChatDotRound', path: '/chat' },
  //   { name: '关系', icon: 'Avatar', path: '/organization' },
  //   { name: '市场', icon: 'GoodsFilled', path: '/appStore' },
  //   { name: '应用', icon: 'Grid', path: '/appStpre', bottom: true },
  //   { name: '数据', icon: 'Share', path: '/thing' },
  //   {
  //     name: '我的',
  //     icon: 'Operation',
  //     path: IsSelfSpace ? '/user' : '/company',
  //     key: IsSelfSpace ? '/user/' : '/company/',
  //     bottom: true
  //   }
  // ]
  const appUse = [
    { id: '1', name: '资产管理', icon: img1, path: '/appUse1' },
    { id: '2', name: '苹果插件', icon: img2, path: '/appUse2' },
    { id: '3', name: '推特服务', icon: img3, path: '/appUse3' },
    { id: '4', name: '办公用品', icon: img4, path: '/appUse4' }
  ]
  const appCreate = [
    { id: '5', name: '资产云', icon: img5, path: '/appUse5' },
    { id: '6', name: '云服务', icon: img6, path: '/appUse6' }
  ]
  onMounted(() => {
    window.addEventListener('click', clickother)
    getFixedData()
  })

  onUnmounted(() => {
    window.removeEventListener('click', clickother)
  })

  const clickother = () => {
    visible.value = false
  }
  // const judgeMe = () => {
  //   if (store.workspaceData.name === '个人空间') {
  //     mainMenus[6].path = '/user/userMsg'
  //   } else {
  //     mainMenus[6].path = '/company/unitMsg'
  //   }
  // }
  // 判断是否已经存在菜单
  const onAppClick = (data: MenuItemType) => {
    data.type = 'app'
    let bool = state.mainMenus.filter((el) => {
      return el.id == data.id
    })
    if (bool.length == 0) {
      state.mainMenus.push(data)
    }
  }
  const rightClick = (event: any, item: any) => {
    if (item.type == 'app') {
      state.storeObj = item
      visible.value = true
      top.value = event.pageY - 30
      left.value = event.pageX + 30
    }
  }
  const getFixedData = () => {
    let params = {
      userId: store.queryInfo.id,
      workspaceId: store.workspaceData.id
    }
    $services.diyHome
      .diy(`/anydata/object/get/${params.userId}.${params.workspaceId}.menu`, { method: 'GET' })
      .then((res: ResultType) => {
        if (res.state) {
          state.mainMenus = state.mainMenus.concat(res.data)
          state.clickMenu = res.data
        }
      })
  }
  const cancelFixed = () => {
    let findIndex = null
    let arr = JSON.parse(JSON.stringify(state.clickMenu))
    let bool = state.clickMenu.find((el, index) => {
      findIndex = index
      return el.id == state.storeObj.id
    })
    if (bool && bool.fixed) {
      arr.splice(findIndex, 1)
    }
    let params = {
      userId: store.queryInfo.id,
      workspaceId: store.workspaceData.id
    }
    $services.diyHome
      .diy(`/anydata/object/set/${params.userId}.${params.workspaceId}.menu`, {
        data: {
          operation: 'replaceAll',
          data: arr
        }
      })
      .then((res: ResultType) => {
        if (res.state) {
          ElMessage({
            message: '取消成功',
            type: 'success'
          })
        }
      })
  }
  const clickFixed = () => {
    let bool = state.clickMenu.find((el) => {
      return el.id == state.storeObj.id
    })
    if (!bool) {
      state.storeObj.fixed = true
      state.clickMenu.push(state.storeObj)
    }
    let params = {
      userId: store.queryInfo.id,
      workspaceId: store.workspaceData.id
    }
    $services.diyHome
      .diy(`/anydata/object/set/${params.userId}.${params.workspaceId}.menu`, {
        data: {
          operation: 'replaceAll',
          data: state.clickMenu
        }
      })
      .then((res: ResultType) => {
        if (res.state) {
          ElMessage({
            message: '固定成功',
            type: 'success'
          })
        }
      })
  }
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
  .menuRight {
    width: 100px;
    height: 60px;
    position: absolute;
    background-color: #fff;
    font-size: 12px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &-fixed {
      padding: 5px 0;
      width: 100%;
      text-align: center;
      &:hover {
        background-color: rgb(248, 247, 249);
      }
    }
    &-cancel {
      padding: 10px 0;
      width: 100%;
      text-align: center;
      &:hover {
        background-color: rgb(248, 247, 249);
      }
    }
  }
  .mainAside-wrap {
    min-width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 60px);
    padding-bottom: 20px;
    box-sizing: border-box;
    // overflow: hidden;

    .aside-li {
      display: flex;
      flex-direction: column;
      padding: 4px;
      margin: 6px 6px 0;
      font-size: 12px;
      align-items: center;
      transform: scale(90%);
      cursor: pointer;

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
        cursor: pointer;

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
        cursor: pointer;

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
