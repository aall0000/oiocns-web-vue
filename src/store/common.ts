import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'common', // id必填，且需要唯一
  state: () => {
    return {
      isLoading: false,//加载中...
    }
  }
})
