<template>
  <DiyButton>
    <template v-slot:opt>
      <template>
        <div class="diy-button" @click="unpublishFun"> 上架 </div>
        <div class="diy-button" @click="requireItem"> 分享 </div>
        <div class="diy-button" @click="requireItem"> 分发 </div>
        <div class="diy-button" @click="requireItem"> 移除 </div>
      </template>
    </template>
  </DiyButton>
</template>

<script setup lang="ts">
  import DiyButton from '@/components/diyButton/index.vue'
  import $services from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  const emit = defineEmits(['update'])
  const props = withDefaults(
    defineProps<{
      data: any
      type?: 'manage' | 'shop'
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

  const unpublishFun = () => {
    let title: string
    console.log('是是是', props.data)

    title = `确定把 ${props.data.caption} 下架吗？`
    ElMessageBox.confirm(title, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        unpublishApp()
      })
      .catch(() => {})
  }
  //下架应用
  const unpublishApp = () => {
    $services.market
      .unpublishMerchandise({
        data: {
          id: props.data.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '下架成功',
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
