import { defineStore } from 'pinia'
import $services from '@/services'

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('ZCY_LOGIN_DATA')), // 用户登录信息
      queryInfo: JSON.parse(sessionStorage.getItem('ZCY_DETAIL_DATA')), // 用户详细信息
      userCompanys: [], // 获取用户组织列表 分页
      userToken: '' || sessionStorage.getItem('TOKEN'),
      workspaceId: ''
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
    getQueryInfo() {
      //获取用户详细信息
      $services.person.queryInfo().then((res) => {
        console.log(res)
        if (res.code == 200) {
          this.queryInfo = res.data
          sessionStorage.setItem('ZCY_DETAIL_DATA', JSON.stringify(res.data))
          this.getCompanyList(0)
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getCompanyList(current: number) {
      $services
        .joinCompanys({
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
            this.userCompanys = [...arr, ...res.data.result]
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    }
  }
})
