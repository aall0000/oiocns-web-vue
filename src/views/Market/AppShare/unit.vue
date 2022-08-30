<template>
  <div class="unitLayout">
    <DiyTable
      ref="diyTable"
      :hasTableHead="true"
      :tableData="companies"
      @handleUpdate="handleUpdate"
      :tableHead="tableHead"
    >
      <template #operate="scope">
        <el-button
          link
          type="danger"
          size="small"
          :disabled="scope.row.id == selectItem.data?.belongId"
          @click="removeFrom(scope.row)"
          >移除单位</el-button
        >
      </template>
    </DiyTable>
  </div>
  <!-- <div :style="{ height: tabHeight - 30 + 'px' }">
      <div style="width: 100%; height: 100%">
        
      </div>
    </div> -->
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const diyTable = ref(null)
  onMounted(() => {
    console.log(route.query.id)
    getShareHistory()
  })
  const getShareHistory = () => {}
</script>

<style lang="scss" scoped>
  .unitLayout {
    width: 100%;
    height: 100%;
    background: #fff;
  }
</style>
