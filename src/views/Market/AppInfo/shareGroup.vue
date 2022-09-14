<template>
  <div>
    <div style="width: 100%; display: flex; justify-content: space-between">
      <el-select
        v-model="selectedValue"
        @change="changeGroupIndex"
        value-key="id"
        placeholder="请选择集团"
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
          <div class="cell-item"> 集团分享记录 </div>
        </template>
        <template  v-if="state.groupShare.length>0" >
          <div style="margin-right: 10px" v-for="item in state.groupShare" :key="item.id"
          ><el-tag>{{ item.name }}</el-tag></div
        >
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 单位分享记录 </div>
        </template>
        <template v-if="state.unitShare.length > 0">
          <div style="margin-right: 10px" v-for="item in state.unitShare" :key="item.id"
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
      title="应用分享"
      width="1000px"
      draggable
      :close-on-click-modal="false"
    >
      <ShareCohort
        v-if="store.workspaceData.type == 2"
        @closeDialog="shareVisible = false"
        :info="props.info"
      ></ShareCohort>
      <SharePersonBox
        v-else
        @closeDialog="shareVisible = false"
        :info="props.info"
      ></SharePersonBox>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref,nextTick } from 'vue'
  import API from '@/services'
  import type { TabsPaneContext } from 'element-plus'
  import { useUserStore } from '@/store/user'
  import ShareCohort from '../components/shareCohortBox.vue'
  import SharePersonBox from '../components/sharePersonBox.vue'
  const store = useUserStore()
  // 当前选中的集团
  let selectedValue = ref<string>()
  // 当前用户的集团
  let groups = reactive([])
  const shareVisible = ref<boolean>(false)
  const state = reactive({
    options: [],
    groupShare: [],
    unitShare: []
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
      getHistoryData()
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
      .searchGroupShare({
        data: {
          id: props.info.id,
          offset: 0,
          limit: 1000,
          filter: '',
          teamId: selectedValue.value
        }
      })
      .then((res: ResultType) => {
        let { result = [] } = res.data
        state.groupShare = result
      })
    API.product
      .searchUnitShare({
        data: {
          id: props.info.id,
          teamId: selectedValue.value,
          offset: 0,
          limit: 1000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        let { result = [] } = res.data
        state.unitShare = result
      })
  }
  // 查询集团列表
  const getGroupList = () => {
    API.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
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
      })
  }
</script>

<style lang="scss" scoped>
  :deep(.el-tag){
      margin-bottom:10px
    }
    :deep(.el-descriptions__content){
      flex-wrap: wrap;
    }
    :deep(.el-descriptions__label){
      width:210px
    }
    :deep(.is-bordered-content) {
      display: flex;
    }
</style>
