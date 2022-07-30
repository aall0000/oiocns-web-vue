import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from '@/router'
import './router/router.interceptor'
import { setGlobalProperties } from '@/services'
import setupSvgIcon from '@/icons'
import { createPinia } from 'pinia'
import '@/assets/style/app.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import InfiniteScroll from 'element-plus'

const pinia = createPinia()

const app = createApp(App)

// 图标引入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
setGlobalProperties(app)
setupSvgIcon(app)
setupRouter(app)

app.use(InfiniteScroll)
app.use(pinia)
app.mount('#app')
