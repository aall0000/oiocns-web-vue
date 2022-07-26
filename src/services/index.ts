import { App } from 'vue'
import request from './request'
import urls from './RESTFULURL'
const FUNS: { [key: string]: any } = {}

Object.keys(urls).forEach((key) => {
  FUNS[key] = (options = {}) => {
    // @ts-ignore
    return request(urls[key], options)
  }
})

export function setGlobalProperties(app: App<Element>) {
  app.config.globalProperties.$services = FUNS
}

export default FUNS
