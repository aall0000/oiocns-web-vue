import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from '@/router'
import './router/router.interceptor'
import { setGlobalProperties } from '@/services'
import setupGlobalComponent from '@/components/global'
import setupSvgIcon from '@/icons'
import { createPinia } from 'pinia'
import '@/assets/style/app.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import InfiniteScroll from 'element-plus'
import VueGridLayout from 'vue-grid-layout'

const pinia = createPinia()

const app = createApp(App)

// 图标引入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
setupGlobalComponent(app)
setGlobalProperties(app)
setupSvgIcon(app)
app.use(pinia)
app.use(VueGridLayout)
setupRouter(app)
app.use(InfiniteScroll)
// await router.isReady()

app.mount('#app')
