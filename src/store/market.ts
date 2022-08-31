import { defineStore } from 'pinia'
import $services from '@/services'
import { ElMessage } from 'element-plus'
import anyStore from '@/utils/hubConnection'
import { type } from 'os'
import { Search } from '@element-plus/icons-vue'
import { forEach } from 'lodash'
import { el } from 'element-plus/es/locale'
type MarketInfoType = {
  market: object
  name:string
  [key: string]: any
}

export const useMarketStore = defineStore({
  id: "useMarketData",
  state: (): MarketInfoType => {
      return {
        market:{},
        name:'',
        marketMap:new Map()
      }
  },
  getters: {
    getMarketName: (state) => {
      return (id: string): string => state.marketMap.get(id)
    }
  },
  actions: {
    async SearchAllMarket() {
      // 获取市场信息
      await $services.appstore
        .searchAll({
          data: {
            offset: 0,
            limit: 10,
            filter: ""
          }
        })
        .then(async (res: ResultType) => {
          if (res.success) {
            const {result = [],total = 0} = res.data
            result.forEach((item: { id: any; name: any })=>{
              this.market.set(item.id,item.name)

            })

          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
}
})
