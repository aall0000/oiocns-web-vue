import { defineStore } from 'pinia'
import $services from '@/services'

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('ZCY_LOGIN_DATA')), // 用户登录信息
      queryInfo: JSON.parse(sessionStorage.getItem('ZCY_DETAIL_DATA')), // 用户详细信息
      userCompanys: [], // 获取用户组织列表 分页
      copyCompanys: [],
      userToken: '' || sessionStorage.getItem('TOKEN'),
      workspaceData: JSON.parse(sessionStorage.getItem('WORKSPACE')) // 当前选中的公司
    }
  },
  getters: {
    // token: (state) => 'Bearer ' + state.userToken
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
        .then(async (res) => {
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
      $services.person.queryInfo().then((res) => {
        console.log(res)
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
        .getJoined({
          data: {
            offset: current,
            limit: 10
          }
        })
        .then((res) => {
          console.log(res)
          if (res.code == 200) {
            let arr = []
            arr.push({ id: this.queryInfo.id, name: this.userInfo.workspaceName })
            if (lazyLoad) {
              this.userCompanys = [...this.userCompanys, ...res.data.result]
            } else {
              this.userCompanys = [...arr, ...res.data.result]
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
    async getWorkspaceData(id: string) {
      await this.copyCompanys.forEach((el: any, index: number) => {
        if (id == el.id) {
          let obj = {
            id: el.id,
            name: el.name
          }
          this.workspaceData = obj
          sessionStorage.setItem('WORKSPACE', JSON.stringify(obj))
          this.userCompanys.splice(index, 1)
        }
      })
    },
    resetState() {
      this.userInfo = null
      this.queryInfo = null
      this.userCompanys = null
      this.copyCompanys = null
      this.userToken = null
      this.workspaceData = null
    }
  }
})
