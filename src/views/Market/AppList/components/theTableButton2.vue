<template>
  <DiyButton>
    <template v-slot:opt>
      <template v-if="props.type === 'manage'">
        <div class="diy-button" @click="requireItem"> 下架 </div>
        <div class="diy-button" @click="requireItem"> 分配 </div>
        <div class="diy-button" @click="requireItem"> 分发 </div>
      </template>
      <template v-else>
        <div class="diy-button" @click="requireItem"> 订阅 </div>
        <div class="diy-button" @click="joinShopCar"> 加入购物车 </div>
      </template>
    </template>
  </DiyButton>
</template>

<script setup lang="ts">
  import DiyButton from '@/components/diyButton/index.vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  const emit = defineEmits(['update'])
  const props = withDefaults(
    defineProps<{
      data: any
      type: 'manage' | 'shop'
    }>(),
    { type: 'manage' }
  )
  const joinShopCar = () => {
    $services.appstore
      .staging({
        data: {
          id: props.data.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
        }
      })
  }
  const requireItem = () => {}
</script>

<style lang="scss" scoped>
  .diy-button {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: rgba(235, 238, 245, 1);
      border-radius: 4px;
    }
  }
</style>
