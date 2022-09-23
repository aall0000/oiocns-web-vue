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
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import API from '@/services'
  type IfrType = {
    containLink: string
    appId?: string
  }
  const props = defineProps<IfrType>()
  const loading = ref<boolean>(true)
  // const { iframeLink } = useCommonStore()
  const myIframe = ref()
  const APP_TOKEN = ref<string>('')

  // iframe加载完成时向iframe传递数据
  const load = () => {
    console.log('子页面加载完成')
    loading.value = false
  }

  onMounted(() => {
    // 监听iframe传递的数据
    window.addEventListener('message', handleReceiveMsg)
  })
  onUnmounted(() => {
    // 退出则撤销信息监听
    window.removeEventListener('message', handleReceiveMsg)
  })

  // 接受子页面信息
  const handleReceiveMsg = async (msg: any) => {
    // 判断是否处理改信息
    const { type, data } = msg.data

    if (!type) {
      return console.error('平台接受消息-请求无效')
    }
    console.log('平台接受消息---接受子页面信息====》\n', msg.data)
    sendMessage(type, data, msg.data)
  }

  // 向子页面iframe传递数据的事件
  const sendMessage = async (type: string, params: any, queryInfo: any) => {
    // 返回信息
    let response: any = {
      from: 'HOST',
      to: queryInfo.form,
      appId: props.appId,
      type: queryInfo.type,
      success: true,
      code: 200,
      msg: '成功！',
      checkCode: queryInfo.checkCode,
      data: null
    }
    // 判断是否模块请求
    const isModelUrl = queryInfo.type.includes('_')
    const queryUrl = isModelUrl ? queryInfo.type.split('_') : queryInfo.type

    switch (type) {
      case 'APP_INIT':
        {
          const { data, success } = await API.person.createAPPtoken({
            data: { appId: props.appId, funcAuthList: [] }
          })
          if (success) {
            // response.data = data
            APP_TOKEN.value = data.data
          }
        }
        return

      default:
        {
          const { data, success } = await API[queryUrl[0]][queryUrl[1]]({
            data: params
          })
          if (success) {
            response.data = data
          }
        }
        console.log('其他消息', type)
        break
    }
    nextTick(() => {
      console.log('平台回复消息内容', response)
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
  // watch(
  //   () => props,
  //   (val) => {
  //     API.person
  //       .createAPPtoken({
  //         data: { appId: props.appId, funcAuthList: [] }
  //       })
  //       .then((result: ResultType) => {
  //         const { data, success } = result
  //         console.log('触发监听', data, success)
  //       })
  //   },
  //   { immediate: true }
  // )
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
