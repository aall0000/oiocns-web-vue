<template>
  <div class="baseLayout">
    <div v-if="state.isShow" class="addImg">
      <div class="text" @click="router.push({ path: '/work', query: { tabsData: '[]' } })">+</div>
    </div>
    <el-tabs
      v-else
      v-model="editableTabsValue"
      type="card"
      editable
      class="demo-tabs"
      @edit="handleTabsEdit"
    >
      <el-tab-pane
        v-for="item in state.editableTabs"
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
              <TheComponentList
                :cover="false"
                :containLink="items.contain_link"
                :type="items.type"
              ></TheComponentList>
            </grid-item>
          </grid-layout>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import TheComponentList from '@/components/protal/index.vue'
  import { ElMessage } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'
  import { useUserStore } from '@/store/user'

  const router = useRouter()
  const store = useUserStore()

  const editableTabsValue = ref(0)
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
    editableTabs: [],
    isShow: false
  })

  onMounted(() => {
    getData()
  })
  const getData = () => {
    let params = {
      userId: store.queryInfo.id,
      workspaceId: store.workspaceData.id
    }
    $services.diyHome
      .diy(`/anydata/object/get/${params.userId}.${params.workspaceId}`, { method: 'GET' })
      .then((res: ResultType) => {
        if (res.state) {
          state.editableTabs = res.data.content
          if (state.editableTabs && state.editableTabs.length !== 0) {
            editableTabsValue.value = state.editableTabs[state.editableTabs.length - 1].name
          } else {
            state.isShow = true
          }
          console.log(state.editableTabs)
        }
      })
  }
  const handleTabsEdit = (targetName: any, action: 'remove' | 'add') => {
    if (action === 'add') {
      router.push({
        path: '/work',
        query: { tabsData: JSON.stringify(state.editableTabs), onValue: editableTabsValue.value }
      })
    } else if (action === 'remove') {
      const tabs = state.editableTabs
      let activeName = targetName
      tabs.forEach((el, index) => {
        if (el.name == activeName) {
          tabs.splice(index, 1)
        }
      })
      let params = {
        userId: store.queryInfo.id,
        workspaceId: store.workspaceData.id,
        content: tabs
      }
      $services.diyHome
        .diy(`/anydata/object/set/${params.userId}.${params.workspaceId}`, {
          data: {
            operation: 'replaceAll',
            data: {
              name: '首页配置',
              // temps: props.dialogShow.sendData
              content: params.content
            }
          }
        })
        .then((res: ResultType) => {
          if (res.state) {
            ElMessage({
              message: '删除成功',
              type: 'success'
            })
            getData()
          }
        })
    }
  }
</script>

<style lang="scss" scoped>
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
