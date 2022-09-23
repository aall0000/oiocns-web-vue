// @ts-nocheck

import { isObject } from '@vueuse/shared'
import { App } from 'vue'
import request from './request'
import urls from './RESTFULURL'
const FUNS: { [key: string]: any } = {}

// 拒绝处理的API
const REFUSE_API = ['person_register', 'person_login', 'person_changeWorkspace']
//子应用 支持的API
let ACCETP_API: { [key: string]: boolean } = { APP_INIT: true }

Object.keys(urls).forEach((key) => {
  if (isObject(urls[key])) {
    FUNS[key] = {}
    Object.keys(urls[key]).forEach((item) => {
      if (typeof urls[key][item] === 'function') {
        // 接口拼接额外动态参数
        FUNS[key][item] = (extarStr: string, options = {}) => {
          return request(urls[key][item](extarStr), options)
        }
      } else {
        const apiStr = `${key}_${item}`
        !REFUSE_API.includes(apiStr) && (ACCETP_API[`${key}_${item}`] = true)
        FUNS[key][item] = (options = {}) => {
          return request(urls[key][item], options)
        }
      }
    })
  } else {
    FUNS[key] = (options = {}) => {
      ACCETP_API[key] = true
      return request(urls[key], options)
    }
  }
})

export function setGlobalProperties(app: App<Element>) {
  app.config.globalProperties.$API = FUNS
}

export default FUNS
export { ACCETP_API }
