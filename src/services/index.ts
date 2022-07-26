import { isObject } from '@vueuse/shared'
import { App } from 'vue'
import request from './request'
import urls from './RESTFULURL'
const FUNS: { [key: string]: any } = {}

Object.keys(urls).forEach((key) => {
  if(isObject(urls[key])){
    FUNS[key] = {}
    Object.keys(urls[key]).forEach((item)=>{
      FUNS[key][item] = (options = {}) => {
        // @ts-ignore
        return request(urls[key][item], options)
      }
    })
  }else{
    FUNS[key] = (options = {}) => {
      // @ts-ignore
      return request(urls[key], options)
    }
  }
})

export function setGlobalProperties(app: App<Element>) {
  app.config.globalProperties.$services = FUNS
}

export default FUNS
