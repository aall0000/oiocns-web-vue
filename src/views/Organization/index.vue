<template>
  <!-- 主体 -->
  <div class="organization-layout-wrap" style="display: flex; height: 100%;">
    <!-- 侧边栏-->
    <teleport v-if="isShowMenu" to="#menu-teleport-target">
      <div class="menu-tab">
        <el-menu router :default-active="currentRouter" class="el-menu-vertical-demo" mode="vertical">
          <el-menu-item v-if="!isMySpace" index="/organization/company">单位维护</el-menu-item>
          <el-menu-item v-if="!isMySpace" index="/organization/group">集团维护</el-menu-item>
          <el-menu-item index="/organization/cohort">群组维护</el-menu-item>
          <el-menu-item index="/organization/friend">好友维护</el-menu-item>
        </el-menu>
      </div>
    </teleport>
    <!-- 内容区域home -->
    <router-view />
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'

  const store = useUserStore()
  const router = useRouter()
  const { workspaceData,queryInfo } = storeToRefs(store)

  const isMySpace = ref<boolean>(workspaceData.value.id == queryInfo.value.id)
  
  const isShowMenu = ref<boolean>(false)
  
  const currentRouter = ref<string>(router.currentRoute.value.fullPath)

  onMounted(() => {
    isShowMenu.value = true
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
</script>

<style lang="scss" scoped>
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
    display: flex;
    flex-direction: column;
  }
  .menu-tab {
    width: 140px;
    height: calc(100% - 15px);
    background: #fff;
  }
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
</style>
