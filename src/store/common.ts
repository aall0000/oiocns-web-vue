import { defineStore } from 'pinia'

export const useCommonStore = defineStore({
  id: 'common', // id必填，且需要唯一
  state: () => {
    return {
      isLoading: false,//加载中...
      iframeLink:''//记录当前打开的ifream内容链接
    }
  },
  persist: {
    //  固化插件
    enabled: true, // 开启存储
    strategies: [
      {
        storage: sessionStorage,
        paths: ['iframeLink']
      }
    ]
  },
})
