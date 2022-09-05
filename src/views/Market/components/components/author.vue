v<template>
  <div
    class="cohortLayout-content-right-box"
    :style="
      item.type == 'add' ? 'background:#beffd0' : item.type == 'del' ? 'background:#ffb4c4' : ''
    "
    v-for="(item, index) in state.dataList"
  >
    <div class="cohortLayout-content-right-box__icon">
      <el-icon @click="delContent(item)"><CircleClose /></el-icon>
    </div>
    <div class="cohortLayout-content-right-box__text">
      {{ item.name ?? item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch, reactive } from 'vue'

  type dataValue = {
    name: string
    label: string
    type: string
    id: string | number
  }
  type Org = {
    resource: string
    data: dataValue[]
  }
  type Props = {
    orgData: Org[]
    resource: string
  }
  const state = reactive({
    dataList: []
  })
  watch(
    () => props.resource,
    (newValue, oldValue) => {
      console.log('321', newValue)
      props.orgData.forEach((el) => {
        if (el.resource == newValue) {
          state.dataList = el.data
        }
      })
    },
    { immediate: true }
  )
  const emit = defineEmits(['delContent'])
  const props = defineProps<Props>()
  const delContent = (item: any) => {
    emit('delContent', item)
  }
</script>

<style lang="scss" scoped>
  .cohortLayout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &-header {
      display: flex;
      align-items: center;
    }
    &-content {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: space-between;
      &-left {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
      &-center {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
      &-right {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
        &-box {
          display: flex;
          margin: 5px;
          padding-left: 10px;
          align-items: center;
          &__icon {
            cursor: pointer;
            margin-top: 5px;
          }
          &__text {
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>
