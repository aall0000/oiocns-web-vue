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
  import { useCommonStore } from '@store/common'
  import { nextTick, onUnmounted, ref, watch } from 'vue'
  import API from '@/services'
  type IfrType = {
    containLink: string
    appId: string
  }
  const props = defineProps<IfrType>()
  const loading = ref<boolean>(true)
  const { iframeLink } = useCommonStore()
  const myIframe = ref()

  // iframe加载完成时向iframe传递数据
  const load = () => {
    console.log('子页面加载完成')
    loading.value = false
    // 监听iframe传递的数据
    window.addEventListener('message', handleReceiveMsg)
  }
  // 退出则撤销信息监听
  onUnmounted(() => {
    window.removeEventListener('message', handleReceiveMsg)
  })
  // 接受子页面信息
  const handleReceiveMsg = async (msg: any) => {
    // origin: strinng,
    // appId: string,
    // cmd: string,
    // queryTime: string,
    // params: Object,
    // desc:'string'

    // 判断是否处理改信息
    const { cmd, params = {} } = msg.data
    console.log('平台接受消息---接受子页面信息====》\n', msg.data)
    sendMessage(cmd, params)
  }

  // 向子页面iframe传递数据的事件
  const sendMessage = async (cmd: string, params: any) => {
    let response: any = {
      origin: 'HOST',
      appId: props.appId,
      cmd,
      success: true,
      createTime: new Date().getTime(),
      data: null
    }
    switch (cmd) {
      case 'getAppToken':
        const { data, success } = await API.person.createAPPtoken({
          data: { appId: props.appId, funcAuthList: [] }
        })
        if (success) {
          response.data = data
        }
        // })
        break

      default:
        console.log('其他消息', cmd)

        break
    }
    nextTick(() => {
      console.log('平台回复消息内容',response)
      myIframe.value.contentWindow.postMessage(response, props.containLink)
    })

    // const queryUrl = aimUrl.includes('&&') ? aimUrl.split('&&') : aimUrl
    // // 返回处理结果
    // const { data, success } = await API[queryUrl[0]][queryUrl[1]]({
    //   data: {}
    // })
    // if (success) {
    //   console.log('平台请求结果====>\n', data)
    //   myIframe.value.contentWindow.postMessage(data, props.containLink)
    // }
  }
  watch(
    () => props,
    (val) => {
      API.person
        .createAPPtoken({
          data: { appId: props.appId, funcAuthList: [] }
        })
        .then((result: ResultType) => {
          const { data, success } = result
          console.log('触发监听', data, success)
        })
    },
    { immediate: true }
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
