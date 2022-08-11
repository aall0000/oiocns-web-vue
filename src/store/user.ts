import { defineStore } from 'pinia'
import $services from '@/services'
import { ElMessage } from 'element-plus'
import { type } from 'os'

type QueryInfoType = {
  id: string
  [key: string]: any
}
type UserType = {
  userInfo: any
  queryInfo: QueryInfoType
  [key: string]: any
}

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: (): UserType => {
    return {
      userInfo: {}, // 用户登录信息
      queryInfo: {} as QueryInfoType, // 用户详细信息
      userCompanys: [], // 获取用户组织列表 分页
      copyCompanys: [],
      userToken: '' || sessionStorage.getItem('TOKEN'),
      workspaceData: {}, // 当前选中的公司
      userNameMap: new Map()
    }
  },
  persist: {
    //  固化插件
    enabled: true, // 开启存储
    strategies: [
      // 指定存储的位置以及存储的变量都有哪些，该属性可以不写，
      //在不写的情况下，默认存储到 sessionStorage 里面,默认存储 state 里面的所有数据。
      { storage: sessionStorage, paths: ['userInfo', 'queryInfo', 'userToken', 'workspaceData'] }
      // paths 是一个数组，如果写了 就会只存储 count 变量，当然也可以写多个。
    ]
  },
  getters: {
    // token: (state) => 'Bearer ' + state.userToken
    getUserName: (state) => {
      return (userId: string): string => state.userNameMap.get(userId)
    }
  },
  actions: {
    async updateUserInfo(data: { username: string; password: string }) {
      // 获取用户登录信息
      await $services.person
        .login({
          data: {
            account: data.username,
            password: data.password
          }
        })
        .then(async (res: ResultType) => {
          if (res.code == 200) {
            this.userInfo = res.data
            this.userToken = res.data.accessToken
            this.getQueryInfo()
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    getQueryInfo(token: string) {
      if (token) {
        this.userToken = token
      }
      //获取用户详细信息
      $services.person.queryInfo().then((res: ResultType) => {
        if (res.code == 200) {
          this.queryInfo = res.data
          if (!token) {
            this.getCompanyList(0)
          }
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    async getCompanyList(current: number, workspaceId: string, lazyLoad: boolean) {
      await $services.company
        .getJoinedCompany({
          data: {
            offset: current,
            limit: 10
          }
        })
        .then((res: ResultType) => {
          console.log(res)
          if (res.code == 200) {
            let arr = []
            arr.push({ id: this.queryInfo.id, name: this.userInfo.workspaceName })
            if (lazyLoad) {
              this.userCompanys = [...this.userCompanys, ...(res.data.result || [])]
            } else {
              this.userCompanys = [...arr, ...(res.data.result || [])]
            }
            this.copyCompanys = JSON.parse(JSON.stringify(this.userCompanys))
            if (workspaceId) {
              this.getWorkspaceData(workspaceId)
            } else {
              this.getWorkspaceData(this.userInfo.workspaceId)
            }
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },

    async createUnit(data: any) {
      // 创建单位时 默认选择创建单位
      await $services.company
        .getJoinedCompany({
          data: {
            offset: 0,
            limit: 100
          }
        })
        .then((res: ResultType) => {
          console.log(res)
          if (res.code == 200) {
            let arr = []
            arr.push({ id: this.queryInfo.id, name: this.userInfo.workspaceName })
            this.copyCompanys = JSON.parse(JSON.stringify(res.data.result))
            this.getWorkspaceData(data.workspaceId)
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },

    async getWorkspaceData(id: string) {
      await this.copyCompanys.forEach((el: any, index: number) => {
        if (id == el.id) {
          let obj = {
            id: el.id,
            name: el.team ? el.team.name : el.name
          }
          this.workspaceData = obj
          sessionStorage.setItem('WORKSPACE', JSON.stringify(obj))
          this.userCompanys.splice(index, 1)
        }
      })
    },
    resetState() {
      // this.userInfo = null
      // this.queryInfo = null
      // this.userCompanys = null
      // this.copyCompanys = null
      this.userToken = ''
      // this.workspaceData = null
    },
    setUserNameMap(id: string, name: string) {
      this.userNameMap.set(id, name)
    }
  }
})
