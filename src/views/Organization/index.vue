<template>
  <div class="main-content">
    <!-- 单位管理 -->
    <div class="org-content mainBox" v-if="showMenu == true">
      <departmentTree
        :envType="envType"
        :rootElement="rootElement"
        :selectItem="selectItem"
        ref="unitTree"
        @changeIndex="changeIndex"
        class="department-tree left box"
      />
      <div class="resize" title="收缩侧边栏"> ⋮ </div>
      <div class="main-dep mid box" v-if="envType == 1">
        <departmentDetail :envType="envType" @Refresh="Refresh" :rootElement="rootElement" :selectItem="selectItem" />
        <departmentList
          ref="departmentDom"
          :envType="envType"
          :rootElement="rootElement"
          :selectId="selectId"
          :selectItem="selectItem"
          :personType="personType"
        ></departmentList>
      </div>
      <div class="main-dep mid box" v-else>
        <orgDetail :envType="envType" :rootElement="rootElement" :selectItem="selectItem" />
        <orgList
          :envType="envType"
          :rootElement="rootElement"
          :selectId="selectId"
          :selectItem="selectItem"
          :personType="personType"
        ></orgList>
      </div>
    </div>
    <!-- 个人管理 -->
    <div class="org-content" v-else style="flex-direction: column">
      <organizatList :personType="personType"></organizatList>
    </div>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import $services from '@/services'
  import { ref, onMounted, watch } from 'vue'
  import departmentTree from './components/departmentTree.vue'
  import departmentDetail from './components/departmentDetail.vue'
  import departmentList from './components/departmentList.vue'
  import orgDetail from './components/orgDetail.vue'
  import orgList from './components/orgList.vue'
  import organizatList from './components/organizatList.vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'

  const store = useUserStore()
  const { queryInfo } = storeToRefs(store)
  const { workspaceData, userUnitInfo } = storeToRefs(store)
  const unitTree = ref(null)
  let showMenu = ref<boolean>(true)
  if (workspaceData.value.name != '个人空间') {
    showMenu.value = true
  } else {
    showMenu.value = false
  }
  const isShowMenu = ref<boolean>(false)
  type selectType = {
    name: string
    id: string
  }
  onMounted(() => {
    isShowMenu.value = true
    if (router.currentRoute.value.path == '/organization/company') {
      getInfo()
    }
    dragControllerDiv()
  })

  // 拖拽移动实现
  const dragControllerDiv = () => {
    let resize = document.getElementsByClassName('resize')
    let left = document.getElementsByClassName('left')
    let mid = document.getElementsByClassName('mid')
    let box = document.getElementsByClassName('mainBox')
    for (let i = 0; i < resize.length; i++) {
      // 鼠标按下事件
      resize[i].onmousedown = function (e) {
        //颜色改变提醒
        resize[i].style.background = '#818181'
        let startX = e.clientX
        resize[i].left = resize[i].offsetLeft
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          let endX = e.clientX
          let moveLen = resize[i].left + (endX - startX) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
          let maxT = box[i].clientWidth - resize[i].offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
          if (moveLen < 200) moveLen = 200 // 左边区域的最小宽度为32px
          if (moveLen > 580) moveLen = 580
          if (moveLen > maxT - 150) moveLen = maxT - 150 //右边区域最小宽度为150px
          resize[i].style.left = moveLen // 设置左侧区域的宽度
          for (let j = 0; j < left.length; j++) {
            left[0].style.width = moveLen + 'px'
            if (moveLen - 40 > unitTree.beginWidth) {
              unitTree.styleTree = {
                width: moveLen - 45 + 'px'
              }
            }
            // mid[0].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
          }
        }
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          //颜色恢复
          resize[i].style.background = '#d6d6d6'
          document.onmousemove = null
          document.onmouseup = null
          resize[i].releaseCapture && resize[i].releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        }
        resize[i].setCapture && resize[i].setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false
      }
    }
  }

  let router = useRouter()
  let envType = ref<number>(1)

  watch(
    () => router.currentRoute.value.path,
    (newValue, oldValue) => {
      if (router.currentRoute.value.path == '/organization/company') {
        envType.value = 1 //1-单位 2-集团
      } else {
        envType.value = 2 //1-单位 2-集团
      }
    },
    { immediate: true }
  )
  // const selectList = reactive<selectType[]>([])

  let selectId = ref<string>()
  const selectItem = ref<selectType>({
    id: '',
    name: '',
    num: 0,
    remark: '',
    label: ''
  })
  let personType = ref<string>('1')
  //获取当前账号的所有单位
  // $services.company
  //   .getJoinedCompany({
  //     data: {
  //       id: queryInfo.value.id,
  //       offset: 0,
  //       limit: 100
  //     }
  //   })
  //   .then((res: ResultType) => {
  //     selectList.push(...res.data.result)
  //     console.log(selectList)
  //   })
  type treeItem = {
    id: string
    name: string
    remark: string
  }
  // const menuIndex = ref<string>('1')
  // const menuCheck = (index:string)=>{
  //   menuIndex.value= index;
  // }
  type rootType = {
    id: string
    name: string
  }
  const rootElement = ref<rootType>({id: '',})
  const getInfo = () => {
    $services.company.queryInfo({}).then((res: ResultType) => {
      let selectObj = res.data
      selectObj.remark = res.data.team.remark
      selectItem.value = selectObj
      rootElement.value = res.data
      store.userUnitInfo = res.data
    })
  }
  const changeIndex = (obj: treeItem) => {
    console.log('obj',obj)
    selectItem.value = JSON.parse(JSON.stringify(obj))//深拷贝obj，解决影响切换空间丢失name的问题
    selectItem.value.name = obj.label
    selectId.value = obj.id
  }
  // const personTypeChange = (index: string) => {
  //   personType.value = index
  // }
  const departmentDom = ref(null)
  //刷新页面
  const Refresh = ()=>{
    departmentDom.value.Refresh()
  }
</script>

<style lang="scss">
  .organization-wrap {
    .el-menu--horizontal > .el-menu-item {
      font-size: 18px;

      &:hover,
      &.is-active {
        background-color: none !important;
        color: $mainColor !important;
      }

      &.is-active {
        border-bottom: 2px solid $mainColor;
      }
    }

    .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
    .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
      background: none !important;
    }
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .resize {
    cursor: col-resize;
    float: left;
    position: relative;
    left: 2px;
    top: 45%;
    background-color: #d6d6d6;
    border-radius: 5px;
    width: 4px;
    height: 50px;
    background-size: cover;
    background-position: center;
    /*z-index: 99999;*/
    font-size: 12px;
    padding-top: 16px;
    padding-left: 1px;
    color: white;
  }
  /*拖拽区鼠标悬停样式*/
  .resize:hover {
    color: #444444;
  }
  :deep(.el-select) {
    width: 100%;
  }

  .subMenu {
    height: 100%;
    width: 100px;
    float: left;
  }

  .main-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 0;
  }

  .org-content {
    display: flex;
    background: #f0f2f5;
    padding: 15px;
    width: 100%;
    height: 100%;
    // overflow-y: scroll;
    .department-tree {
      width: 200px;
      min-width: 200px;
    }
    .main-dep {
      width: 100%;
      margin-left: 10px;
    }
    // 右侧列表
    .department-info {
      flex-grow: 1;
    }
  }
</style>
