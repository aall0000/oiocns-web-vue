<template>
  <div :class="['sandboxLayout', props.containLink ? '' : 'noData']">
    <iframe
      v-if="props.containLink"
      id="myIframe"
      class="iframe"
      :ref="myIframe"
      allow="payment"
      allowfullscreen="true"
      :src="props.containLink"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
    <div class="txt" v-else>暂无内容</div>
  </div>
</template>

<script setup lang="ts">
  import { useCommonStore } from '@store/common'
  import { watch,ref } from 'vue'
  type IfrType = {
    containLink: string
  }
  const props = defineProps<IfrType>()
  const myIframe = ref(null)
  const { iframeLink } = useCommonStore()
  console.log('props', props, iframeLink)
  watch(
    () => iframeLink,
    (val, old) => {
      console.log('比哪壶啊', val, old)
    }
  )
</script>

<style lang="scss" scoped>
  .sandboxLayout {
    display: flex;
    height: 100%;
    width: 100%;

    &.noData {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      .txt {
        margin: 0 auto;
        font-size: 40px;
        text-shadow: 5px 5px 5px black, 0px 0px 2px black;
        color: white;
      }
    }
  }
</style>
