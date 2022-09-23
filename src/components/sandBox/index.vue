<template>
  <div :class="['sandboxLayout', props.containLink ? '' : 'noData']" v-loading="loading">
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
      @load="load"
    ></iframe>
    <div class="txt" v-else>暂无内容</div>
  </div>
</template>

<script setup lang="ts">
  // import { useCommonStore } from '@store/common'
  import { onMounted, ref, watch } from 'vue'
  import usePostMessage from '@/hooks/usePostMessage'
console.log(usePostMessage);

  type IfrType = {
    containLink: string
    appId?: string
  }
  const props = defineProps<IfrType>()
  const loading = ref<boolean>(true)
  // const { iframeLink } = useCommonStore()
  const myIframe = ref()
  // const APP_TOKEN = ref<string>('')

  // iframe加载完成时向iframe传递数据
  const load = () => {
    console.log('子页面加载完成')
    loading.value = false
  }
  usePostMessage(myIframe, props.appId, props.containLink)
  
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
