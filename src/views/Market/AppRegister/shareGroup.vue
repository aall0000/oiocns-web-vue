<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import API from '@/services'
  import type { TabsPaneContext } from 'element-plus'

  // 当前选中的集团
  let selectedValue = ref<string>()
  // 当前用户的集团
  let groups = reactive([])
  const state = reactive({
    options: []
  })
  onMounted(() => {
    getGroupList()
  })
  const handleTabsClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab.index)
    if (tab.index == '1') {
      getGroupList()
    }
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
          selectedValue.value = groups[0].name
        } else {
          groups = []
        }
      })
  }
</script>

<style scoped></style>
