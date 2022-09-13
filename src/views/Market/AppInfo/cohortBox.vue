<template>
    <div>
      <div style="width: 100%; display: flex; justify-content: space-between">
        <el-select
          v-model="selectedValue"
          @change="changeGroupIndex"
          value-key="id"
          placeholder="请选择资源"
        >
          <el-option
            v-for="item in state.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button small link type="primary" @click="editDialog">编辑</el-button>
      </div>
  
      <el-descriptions style="margin-top: 10px" class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 按部门分发记录 </div>
          </template>
          <template  v-if="state.departData.length>0" >
            <div style="margin-right: 10px" v-for="item in state.departData" :key="item.id"
            ><el-tag>{{ item.name }}</el-tag></div
          >
          </template>
          <template v-else>
            <div>-</div>
          </template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 按职权分发记录 </div>
          </template>
          <template v-if="state.authorData.length > 0">
            <div style="margin-right: 10px" v-for="item in state.authorData" :key="item.id"
              ><el-tag>{{ item.name}}</el-tag></div
            >
          </template>
          <template v-else>
            <div>-</div>
          </template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 按人员分发记录 </div>
          </template>
          <template v-if="state.personsData.length > 0">
            <div style="margin-right: 10px" v-for="item in state.personsData" :key="item.id"
              ><el-tag>{{ item.name}}</el-tag></div
            >
          </template>
          <template v-else>
            <div>-</div>
          </template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 按身份分发记录 </div>
          </template>
          <template v-if="state.identitysData.length > 0">
            <div style="margin-right: 10px" v-for="item in state.identitysData" :key="item.id"
              ><el-tag>{{ item.name}}</el-tag></div
            >
          </template>
          <template v-else>
            <div>-</div>
          </template>
        </el-descriptions-item>
      </el-descriptions>

      <el-dialog
        v-if="shareVisible"
        v-model="shareVisible"
        custom-class="share-dialog"
        title="应用分发"
        width="1000px"
        draggable
        :close-on-click-modal="false"
      >
        <Cohort @closeDialog="shareVisible = false" :info="props.info"></Cohort>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
    import { onMounted, reactive, ref,nextTick } from 'vue'
    import API from '@/services'
    import type { TabsPaneContext } from 'element-plus'
    import { useUserStore } from '@/store/user'
    import Cohort from '../components/cohortBox.vue'
    const store = useUserStore()
    // 当前选中的集团
    let selectedValue = ref<string>()
    // 当前用户的集团
    let groups = reactive([])
    const shareVisible = ref<boolean>(false)
    const state = reactive({
      options: [],
      groupShare: [],
      unitShare: [],
      departData: [], // 集团分发右侧数据
      authorData: [], // 职权右侧数据
      personsData: [], // 人员右侧数据
      identitysData: [], //身份右侧数据
    })
    type createInfo = {
      info: {
        id: string
      }
      // groupId: string
    }
    const props = defineProps<createInfo>()
    onMounted(() => {
      nextTick(() => {
        getGroupList()
        
      })
      
    })
    const handleTabsClick = (tab: TabsPaneContext, event: Event) => {
      console.log(tab.index)
      if (tab.index == '1') {
        getGroupList()
      }
    }
    const editDialog = () => {
      shareVisible.value = true
    }
    // 切换集团
    const changeGroupIndex = (id: string) => {
      getHistoryData()
    }
    // 查询历史记录
    const getHistoryData = () => {
      API.product
          .toDepartment({
            data: {
              id: selectedValue.value,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.departData = res.data.result ? res.data.result : []
          })
          API.product
          .toAuthority({
            data: {
              id:selectedValue.value,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.authorData = res.data.result ? res.data.result : []
          })
          API.product
          .toPerson({
            data: {
              id: selectedValue.value,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.personsData = res.data.result ? res.data.result : []
          })
          API.product
          .toIdentity({
            data: {
              id: selectedValue.value,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.identitysData = res.data.result ? res.data.result : []
          })
    }
    // 查询集团列表
    const getGroupList = () => {
      API.product
        .searchResource({
          data: {
            id: props.info.id,
            offset: 0,
            limit: 1000,
            filter: ''
          }
        })
        .then((res: ResultType) => {
          if (res.data.result && res.data.result.length > 0) {
            groups = res.data.result
            state.options = groups.map((g) => {
              return { value: g.id, label: g.name }
            })
            selectedValue.value = groups[0].id
          } else {
            groups = []
          }
          getHistoryData()
        })
        
    }
  </script>
  
  <style lang="scss" scoped>
    :deep(.el-descriptions__label){
      width:210px
    }
    :deep(.is-bordered-content) {
      display: flex;
    }
  </style>
  