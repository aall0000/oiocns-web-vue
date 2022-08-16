<template>
  <div class="baseLayout">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      editable
      class="demo-tabs"
      @edit="handleTabsEdit"
    >
      <el-tab-pane :closable="false" :label="'工作台'" :name="0">
        <TheHome style="margin-top: 4px"></TheHome>
      </el-tab-pane>
      <el-tab-pane
        v-for="item in state.data.content"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <div class="layout-con" id="workSpace">
          <grid-layout
            ref="gridlayout"
            :layout="item.temps"
            :col-num="12"
            :row-height="27.5"
            :is-draggable="state.gridLayoutSet.draggable"
            :is-resizable="state.gridLayoutSet.resizable"
            :vertical-compact="true"
            :margin="[4, 4]"
            :use-css-transforms="true"
            :use-style-cursor="false"
          >
            <grid-item
              v-for="items in item.temps"
              :x="items.x"
              :y="items.y"
              :w="items.w"
              :h="items.h"
              :i="items.i"
              :key="items.i"
              :use-style-cursor="false"
            >
              <div style="height: 100%; overflow: hidden">
                <TheSandBox
                  v-if="items.type == 'iframe'"
                  :cover="true"
                  :containLink="items.contain_link"
                  :type="items.type"
                ></TheSandBox>
                <TheComponentList
                  v-else
                  :cover="true"
                  :containLink="items.contain_link"
                  :type="items.type"
                ></TheComponentList>
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
  import { ElMessage } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'
  import { useUserStore } from '@/store/user'

  const router = useRouter()
  const store = useUserStore()

  const editableTabsValue = ref(null)
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
      name: '首页配置',
      content: [],
      user: {
        name: '用户组件',
        content: []
      }
    }
  })

  onMounted(() => {
    loadData()
  })

  const loadData = () => {
    let params = {
      userId: store.queryInfo.id,
      workspaceId: store.workspaceData.id
    }
    $services.diyHome
      .diy(`/anydata/object/get/${params.userId}.${params.workspaceId}`, { method: 'GET' })
      .then((res: ResultType) => {
        if (res.state) {
          state.data = res.data
          if (state.data.content && state.data.content.length !== 0) {
            editableTabsValue.value = state.data.content[state.data.content.length - 1].name
          } else {
            editableTabsValue.value = 0
          }
        }
      })
  }
  const saveData = () => {
    let params = {
      userId: store.queryInfo.id,
      workspaceId: store.workspaceData.id
    }
    $services.diyHome
      .diy(`/anydata/object/set/${params.userId}.${params.workspaceId}`, {
        data: {
          operation: 'replaceAll',
          data: state.data
        }
      })
      .then((res: ResultType) => {
        if (res.state) {
          ElMessage({
            message: '更新成功',
            type: 'success'
          })
        }
      })
  }
  const handleTabsEdit = (targetName: any, action: 'remove' | 'add') => {
    if (action === 'add') {
      router.push({
        path: '/work',
        query: {
          // tabsData: JSON.stringify(state.data.content),
          tabsData: JSON.stringify([]),
          onValue: editableTabsValue.value,
          userComponentList: JSON.stringify(state.data.user),
          allData: JSON.stringify(state.data)
        }
      })
      console.log(JSON.stringify(state.data.user))
    } else if (action === 'remove') {
      const tabs = state.data.content
      let activeName = targetName
      state.data.content.forEach((el, index) => {
        if (el.name == activeName) {
          state.data.content.splice(index, 1)
        }
      })
      saveData()
    }
  }
</script>

<style lang="scss" scoped>
  :deep(.el-tabs) {
    height: calc(100% - 40px);
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
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
    clear: both;
  }
</style>
