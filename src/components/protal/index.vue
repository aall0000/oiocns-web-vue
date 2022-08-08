<template>
  <div class="base">
    <div class="baseCover" v-if="cover"></div>
    <testComponents v-if="containLink == 'test'"></testComponents>
  </div>
</template>

<script setup lang="ts">
  import testComponents from './components/test.vue'
  const props = defineProps({
    cover: {
      type: Boolean,
      required: false
    },
    containLink: {
      type: String,
      default: ''
    }
  })
</script>

<style lang="scss" scoped>
  .base {
    width: 100%;
    height: 100%;
  }
  .baseCover {
    position: absolute;
    width: 96%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0);
    // background: red;
    z-index: 99999;
  }
</style>
