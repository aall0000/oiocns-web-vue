import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

//固定路由
const constantRoutes: RouteRecordRaw[] = [
  {
    component: () => import('@/views/Login/index.vue'),
    name: 'login',
    path: '/login'
  },
  {
    component: () => import('@/views/Others/404.vue'),
    name: '404',
    path: '/404'
  }
]

// 主要业务页面路由
const mainRouter: RouteRecordRaw[] = [
  {
    component: () => import('@/views/Home/index.vue'),
    name: 'home',
    path: '/home',
    meta: {
      keepAlive: false,
      title: '首页'
    }
  },
  {
    component: () => import('@/views/Work/index.vue'),
    name: 'work',
    path: '/work',
    meta: {
      keepAlive: false,
      title: '工作区'
    }
  },
  {
    component: () => import('@/views/Work/index.vue'),
    name: 'work2',
    path: '/work2',
    meta: {
      keepAlive: false,
      title: '工作区2'
    },
    children: [
      {
        component: () => import('@/views/Home/index.vue'),
        name: 'test1',
        path: '/test1',
        meta: {
          keepAlive: false,
          title: '测试1'
        }
      },
      {
        component: () => import('@/views/Work/index.vue'),
        name: 'test2',
        path: '/test2',
        meta: {
          keepAlive: false,
          title: '测试2'
        }
      }
    ]
  }
]

// 整合路由
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: mainRouter
  },
  ...constantRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}

function setPath(routerArr, pathStr = '') {
  return routerArr.map((item) => {
    let obj: { index: string; name: string; children?: any[] } = {
      index: `${pathStr}${item.path}`,
      name: item.meta?.title ?? item.path
    }
    if (item?.children) {
      obj.children = setPath(item.children, item.path)
    }
    return obj
  })
}

export const menuList: any = setPath(mainRouter)

export default router
