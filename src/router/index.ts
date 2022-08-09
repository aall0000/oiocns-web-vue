import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

let resultRouter: RouteRecordRaw[] = []

//固定路由
const constantRoutes: RouteRecordRaw[] = [
  {
    component: () => import('@/views/Login/index.vue'),
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    }
  },
  {
    component: () => import('@/views/Others/404.vue'),
    name: '404',
    path: '/404'
  },
  // {
  //   component: () => import('@/views/Test/index.vue'),
  //   name: 'test',
  //   path: '/test'
  // }
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
    component: () => import('@/views/Layout/components/loading.vue'),
    name: 'Thing',
    path: '/Thing',
    meta: {
      keepAlive: false,
      title: '元数据'
    }
  },
  {
    component: () => import('@/views/Chat/index.vue'),
    name: 'chat',
    path: '/chat',
    meta: {
      keepAlive: false,
      title: '消息'
    }
  },
  {
    path: '/organization',
    component: () => import('@/views/Organization/components/layout.vue'),
    redirect: '/organization/company',

    children: [
      {
        path: '/organization/company',
        name: 'company',
        component: () => import('@/views/Organization/index.vue'),
        meta: {
          title: '单位维护'
        }
      },
      {
        path: '/organization/group',
        name: 'group',
        component: () => import('@/views/Person/msgSetting/userMsg.vue'),
        meta: {
          title: '集团维护'
        }
      },
      {
        path: '/organization/cohort',
        name: 'cohort',
        component: () => import('@/views/Person/msgSetting/userSaveSet.vue'),
        meta: {
          title: '单位群组'
        }
      },
      {
        path: '/organization/friend',
        name: 'friend',
        component: () => import('@/views/Person/msgSetting/userUnit.vue'),
        meta: {
          title: '我的好友'
        }
      },
    ]
  },
  {
    component: () => import('@/views/Organization/OrganizationTable/index.vue'),
    name: 'organizationTable',
    path: '/organizationTable',

    meta: {
      keepAlive: false,
      title: '组织架构'
    }

  },
  {
    component: () => import('@/views/Work/index.vue'),
    name: 'work',
    path: '/work',
    meta: {
      keepAlive: false,
      title: '工作组'
    }
  },
  {
    component: () => import('@/views/Work/cardDetail.vue'),
    name: 'cardDetail',
    path: '/cardDetail',
    meta: {
      keepAlive: false,
      title: '待办详情'
    }
  },
  {
    component: () => import('@/views/Work/personalApp.vue'),
    name: 'personalApp',
    path: '/personalApp',
    meta: {
      keepAlive: false,
      title: '我的应用'
    }
  },
  {
    component: () => import('@/views/Work/appStore.vue'),
    name: 'appStore',
    path: '/appStore',
    meta: {
      keepAlive: false,
      title: '应用市场'
    }
  },
  {
    component: () => import('@/views/Person/application/index.vue'),
    name: 'application',
    path: '/application',
    meta: {
      keepAlive: false,
      title: '我的申请'
    }
  },
  //个人中心信息设置路由
  {
    path: '/user',
    component: () => import('@/views/Layout/msgLayout/layout.vue'),
    redirect: '/user/userMsg',
    children: [
      {
        path: '/user/userMsg',
        name: 'userMsg',
        component: () => import('@/views/Person/msgSetting/userMsg.vue'),
        meta: {
          title: '个人信息'
        }
      },
      {
        path: '/user/userUnit',
        name: 'userUnit',
        component: () => import('@/views/Person/msgSetting/userUnit.vue'),
        meta: {
          title: '我的单位'
        }
      },
      {
        path: '/user/userAccountBind',
        name: 'userAccountBind',
        component: () => import('@/views/Person/msgSetting/userAccountBind.vue'),
        meta: {
          title: '账号绑定'
        }
      },
      {
        path: '/user/userSaveSet',
        name: 'userSaveSet',
        component: () => import('@/views/Person/msgSetting/userSaveSet.vue'),
        meta: {
          title: '安全设置'
        }
      },
      {
        path: '/user/test',
        name: 'test',
        component: () => import('@/views/Person/msgSetting/test.vue'),
        meta: {
          title: '测试'
        }
      }
    ]
  },

  {
    path: '/company',
    redirect: '/company/unitMsg',
    component: () => import('@/views/Layout/msgLayout/layout.vue'),
    children: [
      {
        path: '/company/unitMsg',
        name: 'unitMsg',
        component: () => import('@/views/Person/msgSetting/unitMsg.vue'),
        meta: {
          title: '单位信息'
        }
      },
      {
        path: '/company/affiliatedGroups',
        name: 'affiliatedGroups',
        component: () => import('@/views/Person/msgSetting/affiliatedGroups.vue'),
        meta: {
          title: '关联集团'
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

function setRouterPath(routerArr: any, pathStr = '') {
  return routerArr.map((item: any) => {
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
function setPath(routerArr: any[], pathStr = '') {
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
