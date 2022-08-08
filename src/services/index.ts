// @ts-nocheck

import { isObject } from '@vueuse/shared'
import { App } from 'vue'
import request from './request'
import urls from './RESTFULURL'
const FUNS: { [key: string]: any } = {}

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
        FUNS[key][item] = (options = {}) => {
          return request(urls[key][item], options)
        }
      }
    })
  } else {
    FUNS[key] = (options = {}) => {
      return request(urls[key], options)
    }
  }
})

export function setGlobalProperties(app: App<Element>) {
  app.config.globalProperties.$API = FUNS
}

export default FUNS
