import { onMounted, onUnmounted, ref, Ref, nextTick } from 'vue'
import API from '@/services'
import { isObject } from '@vueuse/shared'
//所有可支持的消息列表
import { ACCETP_API } from '@/services'

export default function (iframeRef: Ref<any>, appId: string, link: string) {
  console.log('注入POSTMESSAGE')
  const APP_TOKEN = ref<string>('')
  //所有可支持的消息列表
  // console.log('ACCETP_API', ACCETP_API)

  onMounted(() => {
    // 监听iframe传递的数据
    window.addEventListener('message', handleReceiveMsg)
  })
  onUnmounted(() => {
    // 退出则撤销信息监听
    window.removeEventListener('message', handleReceiveMsg)
  })
  type MSGType = {
    data: { type: string | { url: string; extar: string }; checkCode: any; data: any }
  }
  // 接受子页面信息
  const handleReceiveMsg = async (msg: MSGType) => {
    console.log('平台接受消息\n', msg.data.type)

    // 判断是否处理改信息
    const { type, checkCode, data } = msg.data
    // const obj = { url: 'collection.insert', extar: 'aaa' }
    let endType: string = type as string
    let extar = ''
    if (isObject(type)) {
      endType = type.url
      extar = type.extar
    }
    // 若不存在消息类型 or 消息类型处于忽略名单,则放弃处理
    if (!endType || !checkCode || !ACCETP_API[endType]) {
      return console.error('平台不支持该请求', endType, checkCode)
    }
    sendMessage(endType, data, msg.data, extar)
  }

  // 向子页面iframe传递数据的事件
  const sendMessage = async (type: string, params = {}, queryInfo: any, extar?: string) => {
    // 返回信息
    let response: any = {
      from: 'HOST', //SDK 判断消息来源的字段
      to: queryInfo.from,
      appId,
      type,
      success: true,
      code: 200, //SDK 判断消息成功的字段
      msg: '成功！',
      checkCode: queryInfo.checkCode, //sdk 判断消息的核心字段
      data: null
    }

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
        iframeRef.value.contentWindow.postMessage(
          { code: 200, msg: '初始化完成', success: true },
          link
        )
      }
    } else if (ACCETP_API[type]) {
      // 判断是否模块请求
      const isModelUrl = type.includes('_')
      const queryUrl = isModelUrl ? type.split('_') : queryInfo.type

      console.log('判断是否已获得应用token', !!APP_TOKEN.value)
      if (!APP_TOKEN.value) {
        return console.warn('应用登录失败!请重试')
      }

      let option = {
        headers: { Authorization: APP_TOKEN.value },
        data: params
      }
      const FUN = API[queryUrl[0]][queryUrl[1]]
      if (extar) {
        await FUN(extar, option)
          .then((res: ResultType) => {
            const { data, success } = res
            response.data = data
          })
          .catch(() => {
            response.data = null
            const errorObj = {
              success: true,
              code: 500, //SDK 判断消息成功的字段
              msg: '失败！'
            }
            response = { ...response, ...errorObj }
          })
      } else {
        await FUN(option)
          .then((res: ResultType) => {
            const { data, success } = res
            response.data = data
          })
          .catch(() => {
            response.data = null
            const errorObj = {
              success: true,
              code: 500, //SDK 判断消息成功的字段
              msg: '失败！'
            }
            response = { ...response, ...errorObj }
          })
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
