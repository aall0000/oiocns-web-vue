<template>
  <ul class='group-side-bar-wrap'>
    <li :class="['group-con', active == 1 ? 'active' : '']" @click="changeInfo(1)">群1</li>
    <li :class="{ 'group-con': true, active: active == 2 }" @click="changeInfo(2)">群2</li>
    <li :class="{ 'group-con': true, active: active == 3 }" @click="changeInfo(3)">个人3</li>
  </ul>
</template>

<script lang="ts" setup name="groupSideBar">
const props = defineProps({
  active: Number,
})

const emit = defineEmits(['update:active'])
const changeInfo = (id: number) => {
  // 触发父组件值更新
  emit('update:active', id)
}
// 暴露
defineExpose({

})

</script>

<style lang='scss' scoped>
.group-side-bar-wrap {
  width: 220px;
  height: 100%;
  padding: 10px 0;
  overflow-y: auto;
  border-right: 1px solid #ccc;

  .group-con {
    padding: 10px 12px;

    &.active,
    &:hover {
      color: #0F39D1;
      background-color: #E7ECFB;
    }
  }
}
</style>
