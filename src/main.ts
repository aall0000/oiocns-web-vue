import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from '@/router'
import './router/router.interceptor'
import { setGlobalProperties } from '@/services'
import setupGlobalComponent from '@/components/global'
import setupSvgIcon from '@/icons'
import { createPinia } from 'pinia'
import anyStore from '@/utils/hubConnection'
import '@/assets/style/app.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import InfiniteScroll from 'element-plus'
import VueGridLayout from 'vue-grid-layout'
// 下面是我们安装的固化插件。
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()

const app = createApp(App)
anyStore.start()
// 图标引入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
setupGlobalComponent(app)
setGlobalProperties(app)
setupSvgIcon(app)
pinia.use(piniaPersist)
app.use(pinia)
app.use(VueGridLayout)
setupRouter(app)
app.use(InfiniteScroll)
// await router.isReady()

app.mount('#app')

