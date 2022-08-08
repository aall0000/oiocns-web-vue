import { defineStore } from 'pinia'
import $services from '@/services'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('ZCY_LOGIN_DATA')), // 用户登录信息
      queryInfo: JSON.parse(sessionStorage.getItem('ZCY_DETAIL_DATA')), // 用户详细信息
      userCompanys: [], // 获取用户组织列表 分页
      copyCompanys: [],
      userToken: '' || sessionStorage.getItem('TOKEN'),
      workspaceData: JSON.parse(sessionStorage.getItem('WORKSPACE')), // 当前选中的公司
      userNameMap: new Map()
    }
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
            sessionStorage.setItem('ZCY_LOGIN_DATA', JSON.stringify(res.data))
            sessionStorage.setItem('TOKEN', res.data.accessToken)
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
          sessionStorage.setItem('ZCY_DETAIL_DATA', JSON.stringify(res.data))
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
