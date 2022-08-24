<template>
  <!-- 工作台首页 -->
  <div class="baseLayout">
    <el-tabs v-model="editableTabsValue" type="card" editable class="demo-tabs" @edit="handleTabsEdit">
      <el-tab-pane :closable="false" :label="'工作台'" :name="0">
        <TheHome style="margin-top: 4px"/>
      </el-tab-pane>
      <el-tab-pane v-for="item in userOtherData.homeComplist" :key="item.name" :label="item.title"
        :name="item.name">
        <div class="layout-con" id="workSpace">
          <grid-layout ref="gridlayout" :layout="item.temps" :col-num="12" :row-height="27.5"
            :is-draggable="state.gridLayoutSet.draggable" :is-resizable="state.gridLayoutSet.resizable"
            :vertical-compact="true" :margin="[4, 4]" :use-css-transforms="true" :use-style-cursor="false">
            <grid-item v-for="items in item.temps" :x="items.x" :y="items.y" :w="items.w" :h="items.h" :i="items.i"
              :key="items.i" :use-style-cursor="false">
              <div style="height: 100%; overflow: hidden">
                <TheSandBox v-if="items.type == 'iframe'" :cover="false" :containLink="items.contain_link"
                  :type="items.type"></TheSandBox>
                <TheComponentList v-else :cover="false" :containLink="items.contain_link" :type="items.type">
                </TheComponentList>
              </div>
            </grid-item>
          </grid-layout>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import TheHome from '../Home/index.vue'
import TheSandBox from '@/components/sandBox/index.vue'
import TheComponentList from '@/components/protal/index.vue'
import { ElMessage, TabPanelName } from 'element-plus'
import { onMounted, reactive, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useAnyData } from '@/store/anydata'
import UserOtherDataConnection from '@/utils/hubConnection'

const router = useRouter()
const store = useUserStore()
const userOtherData = useAnyData()

const editableTabsValue = ref<number>()
interface info {
  id: String
  title: String
  name: String
  temps?: Array<String>
}
const state = reactive({
  gridLayoutSet: {
    draggable: false,
    resizable: false
  },

  data: {
    // name: '首页配置',
    // content: [],
    // user: {
    //   name: '用户组件',
    //   content: []
    // }
  }
})

onMounted(() => {
  // 当前标签index
  const templateContentLen = userOtherData.homeComplist ? userOtherData.homeComplist.length :0
  editableTabsValue.value = templateContentLen > 0 ? templateContentLen-1:0
  // 订阅工作空间数据变化
  UserOtherDataConnection.subscribed(`${store.workspaceData.id}`, (data) => {
    console.log('home===',data)
    userOtherData.setWorkspace(data)
    editableTabsValue.value = templateContentLen > 0 ? templateContentLen-1:0
  })
  
  
})
onBeforeUnmount(() => {
 
  UserOtherDataConnection.unSubscribed(`${store.workspaceData.id}`)
})
// 删除tab
const removeTabs = async (targetName: TabPanelName) => {
  const tabs = userOtherData.homeComplist.filter(el => el.name !== targetName)

  const params = {
    workspaceId: store.workspaceData.id,
    content: tabs
  }
  const success = await userOtherData.updateHomeSpace(params)
  if (success) {
    editableTabsValue.value = editableTabsValue.value > 0 ? editableTabsValue.value - 1 : 0
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
  }
}
// 点击tab右侧 + 按钮
const handleTabsEdit = (targetName: TabPanelName, action: 'remove' | 'add') => {
  if (action === 'add') {
    router.push({
      path: '/work',
      query: {
        onValue: editableTabsValue.value,
      }
    })
  } else if (action === 'remove') {
    removeTabs(targetName)
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs) {
  height: 100%;
}

:deep(.el-tabs__content) {
  height: 100%;
}

:deep(.el-tab-pane) {
  height: 100%;
}

:deep(.el-tabs__nav .el-tabs__item:nth-child(1) .el-icon) {
  display: none;
}

.addImg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
}

.text {
  border: 1px solid rgb(64, 158, 255);
  padding: 100px 200px;
  cursor: pointer;
  color: rgb(64, 158, 255);
}

:deep(.el-tabs--card > .el-tabs__header) {
  border: unset;
}

:deep(.el-tabs__content) {
  overflow: auto;
  height: calc(100vh - 102px);
  background-color: rgb(241, 241, 248);
  clear: both;
}

:deep(.el-tabs__new-tab) {
  float: unset;
}

:deep(.el-tabs) {
  background: #fff;
}

:deep(.el-tabs__header) {
  display: flex;
  flex-direction: row-reverse;
  margin: unset;
  float: left;
  z-index: 1;
}

.baseLayout {
  width: 100%;
  height: 100%;
  background-color: rgb(241, 241, 248);
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
  clear: both;
}
</style>
