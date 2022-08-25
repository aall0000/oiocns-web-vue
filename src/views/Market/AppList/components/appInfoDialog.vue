<template>
  <el-dialog append-to-body v-model="dialogShow.value" title="应用详情" width="30%">
    <el-descriptions class="margin-top" :column="1" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 应用名称 </div>
        </template>
        {{ dialogShow.sendData.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 应用描述 </div>
        </template>
        {{ dialogShow.sendData.remark }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 创建时间 </div>
        </template>
        {{ dialogShow.sendData.createTime }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">分配人员</el-button>
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    dialogShow: {
      type: Object
    }
  })

  const emit = defineEmits(['closeDialog'])

  const closeDialog = () => {
    emit('closeDialog', 'info')
  }
</script>

<style scoped></style>
