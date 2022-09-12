<template>
  <el-card
    class="marketCreate"
    shadow="hover"
    :body-style="{ padding: '0px' }"
    @click="() => emit('myclick')"
  >
    <div class="createCard">
      <el-icon><Plus /></el-icon>
      {{ info }}
    </div>
  </el-card>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue'

  type createInfo = {
    info: string
  }
  const props = defineProps<createInfo>()
  const { info } = props

  const emit = defineEmits(['myclick'])
</script>

<style lang="scss" scoped>
  .marketCreate {
    width: 24%;
    min-width: 200px;
    height: 184px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 2px dashed #409eff;
    text-align: center;
    line-height: 184px;
    .createCard {
    }
  }
</style>
