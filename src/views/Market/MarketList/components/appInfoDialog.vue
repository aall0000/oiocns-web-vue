<template>
  <el-dialog append-to-body v-model="dialogShow.value" title="应用详情" width="30%">
    <el-descriptions class="margin-top" :column="1" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 应用名称 </div>
        </template>
        {{ dialogShow.sendData.caption }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 售卖价格 </div>
        </template>
        {{ dialogShow.sendData.price??'--' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 售卖权属 </div>
        </template>
        {{ dialogShow.sendData.sellAuth??'--' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 使用期限 </div>
        </template>
        {{ dialogShow.sendData.days??'--' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 应用描述 </div>
        </template>
        {{ dialogShow.sendData.information }}
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
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
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

<style lang="scss" scoped>
  :deep(.el-descriptions__content) {
    display: -webkit-box;
    -webkit-box-orient: vertical; /*设置方向*/
    -webkit-line-clamp: 3; /*设置超过为省略号的行数*/
    overflow: hidden;
  }
</style>
