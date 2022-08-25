<template>
  <div class="shareComp-wrap">
    <div class="app-info"></div>
    <div class="share-box"></div>
  </div>
</template>
<script lang="ts" setup>
  type PropType = {
    info: ProductType
  }
  const props = defineProps<PropType>()
  console.log('展示数据',props);

</script>

<style lang="scss" scoped>
  .shareComp-wrap {
  }
</style>
