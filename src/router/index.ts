import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

let resultRouter: RouteRecordRaw[] = []

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
  },
  {
    path: '/user',
    component: () => import('../views/Layout/MsgLayout/Layout.vue'),
    redirect: '/userMsg',
    children: [
      {
        path: '/userMsg',
        name: 'userMsg',
        component: () => import('../views/Person/msgSetting/userMsg.vue'),
        meta: {
          title: '个人信息'
        }
      },
      {
        path: '/userUnit',
        name: 'userUnit',
        component: () => import('../views/Person/msgSetting/userUnit.vue'),
        meta: {
          title: '我的单位'
        }
      },
      {
        path: '/userAccountBind',
        name: 'userAccountBind',
        component: () => import('../views/Person/msgSetting/userAccountBind.vue'),
        meta: {
          title: '账号绑定'
        }
      },
      {
        path: '/userSaveSet',
        name: 'userSaveSet',
        component: () => import('../views/Person/msgSetting/userSaveSet.vue'),
        meta: {
          title: '安全设置'
        }
      },
      {
        path: '/UnitMsg',
        name: 'UnitMsg',
        component: () => import('../views/Person/msgSetting/unitMsg.vue'),
        meta: {
          title: '单位信息'
        }
      },
      {
        path: '/AffiliatedGroups',
        name: 'AffiliatedGroups',
        component: () => import('../views/Person/msgSetting/affiliatedGroups.vue'),
        meta: {
          title: '关联集团'
        }
      }
    ]
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
    component: () => import('@/views/Group/index.vue'),
    name: 'group',
    path: '/group',
    meta: {
      keepAlive: false,
      title: '群'
    }
  },
  {
    component: () => import('@/views/Group/Organization/index.vue'),
    name: 'organization',
    path: '/organization',
    meta: {
      keepAlive: false,
      title: '组织架构'
    }
  },
  {
    component: () => import('@/views/Thing/index.vue'),
    name: 'thing',
    path: '/thing'
  },
  {
    component: () => import('@/views/Thing/cardDetail.vue'),
    name: 'cardDetail',
    path: '/cardDetail'
  },
  {
    component: () => import('@/views/Thing/personalApp.vue'),
    name: 'personalApp',
    path: '/personalApp'
  },
  {
    component: () => import('@/views/Thing/appStore.vue'),
    name: 'appStore',
    path: '/appStore'
  },
  {
    name: 'work2',
    path: '/work2',
    meta: {
      keepAlive: false,
      title: '工作区2'
    },
    children: [
      {
        component: () => import('@/components/usePinia.vue'),
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
  //个人中心信息设置路由
]

// 整合路由
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: handleMainRouter(mainRouter)
  },
  ...constantRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 处理业务路由为一级
function handleMainRouter(routerArr: RouteRecordRaw[], path?: string) {
  routerArr.forEach((item: RouteRecordRaw) => {
    if (item?.children) {
      handleMainRouter(item.children, item.path)
    } else {
      let obj = { ...item }
      if (path) {
        obj.path = `${path}${item.path}`
      }
      resultRouter.push(obj)
    }
  })
  return resultRouter
}

function setRouterPath(routerArr, pathStr = '') {
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

// 处理导航展示所需信息
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
// 根据业务路由导出菜单列表用于渲染导航
export const menuList: any = setPath(mainRouter)

export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
