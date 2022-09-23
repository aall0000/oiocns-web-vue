import { onMounted, onUnmounted, ref, Ref, nextTick } from 'vue'
import API from '@/services'

export default function (iframeRef: Ref<any>, appId: string, link: string) {
  if (appId) {
    return
  }
  const APP_TOKEN = ref<string>('')
  const ignoreApi = ['person_register', 'person_login', 'person_changeWorkspace']

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
    const { type, checkCode, data } = msg.data
    // 若不存在消息类型 or 消息类型处于忽略名单,则放弃处理
    if (!type || !checkCode || ignoreApi.includes(type)) {
      return console.error('平台不支持该请求', type, checkCode)
    }
    console.log('平台接受消息---接受子页面信息\n', msg.data)
    sendMessage(type, data, msg.data)
  }

  // 向子页面iframe传递数据的事件
  const sendMessage = async (type: string, params: any, queryInfo: any) => {
    // 返回信息
    let response: any = {
      from: 'HOST', //SDK 判断消息来源的字段
      to: queryInfo.form,
      appId,
      type,
      success: true,
      code: 200, //SDK 判断消息成功的字段
      msg: '成功！',
      checkCode: queryInfo.checkCode, //sdk 判断消息的核心字段
      data: null
    }
    // 判断是否模块请求
    const isModelUrl = queryInfo.type.includes('_')
    const queryUrl = isModelUrl ? queryInfo.type.split('_') : queryInfo.type

    if (type == 'APP_INIT') {
      if (!appId) {
        return console.error('未获取应用id!请重试')
      }
      // 获取应用token
      const { data, success } = await API.person.createAPPtoken({
        data: { appId, funcAuthList: [] }
      })
      if (success) {
        APP_TOKEN.value = data.accessToken
      }
    } else if (type !== 'APP_INIT' && type.includes('_')) {
      console.log('判断是否已获得应用token', APP_TOKEN.value)
      if (!APP_TOKEN.value) {
        return console.warn('应用登录失败!请重试')
      }
      const { data, success } = await API[queryUrl[0]][queryUrl[1]]({
        headers: { Authorization: APP_TOKEN.value },
        data: params
      })
      if (success) {
        response.data = data
      }
      nextTick(() => {
        console.log('平台回复消息内容', response)
        iframeRef.value.contentWindow.postMessage(response, link)
      })
    } else {
      console.log('不支持消息类型', type)
    }
  }
}
