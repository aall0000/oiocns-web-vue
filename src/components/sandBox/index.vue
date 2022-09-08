<template>
  <div class="sandboxLayout">
    <iframe
      v-if="props.containLink"
      id="myIframe"
      class="iframe"
      ref="myIframe"
      allow="payment"
      allowfullscreen="true"
      :src="props.containLink"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
    <div v-else>暂无内容</div>
  </div>
</template>

<script setup lang="ts">
  import { useCommonStore } from '@store/common'
  import { watch } from 'vue'
  type IfrType = {
    containLink: string
  }
  const props = defineProps<IfrType>()

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
  }
</style>
