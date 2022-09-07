<template>
  <SandBox :containLink="commonStore.iframeLink" :key="commonStore.iframeLink" />
</template>
<script lang="ts" setup>
  import SandBox from '@/components/sandBox/index.vue'
  import { useCommonStore } from '@store/common'
  const commonStore= useCommonStore()
</script>

<style lang="scss" scoped>
  @import '@/assets/style/main.scss';
  :deep(#myIframe #app) {
    background: red;
  }
  .foreign-app-wrap {
    #myIframe #app {
      ::-webkit-scrollbar {
        overflow: visible;
        width: 6px;
        height: 10px;
      }
      ::-webkit-scrollbar-thumb {
        min-height: 10px;
        border-radius: 5px;
      }
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
      ::-webkit-scrollbar-track-piece {
        // margin: 10px 0;
        border-radius: 5px;
      }
      ::-webkit-scrollbar {
        background-color: #fff;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #d8d8d8;
      }

      ::-webkit-scrollbar-thumb:vertical:hover {
        background-color: #e1e1e1;
      }
      ::-webkit-scrollbar-thumb:vertical:active {
        background-color: #6690ff;
      }
    }
  }
</style>
