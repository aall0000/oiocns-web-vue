import API from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus'
// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

interface MarketServicesType {
  //----------------------我的应用 ---------
  //----------------------市场功能 ---------
  //创建市场
  //获取市场列表
  getMarketList: () => void
  //编辑市场信息
  //删除市场
  deleteMarket: () => void
  // 退出市场
  quitMarket: () => void
  //获取共享市场信息
  // 获取市场展示应用--筛选
  // ----------------------应用购物车功能 ---------
  // 加购应用
  // 取消加购
  // 获取当前购物车数量
  // 购买应用
  // 采购订单
  // 出售订单
  // 取消订单
  // 确认订单
}

class MarketServices {
  public marketList: MarketType[] //商店列表
  public marketTotal: number //商店列表 总数
  public QueryParams: CommonParamsType //记录历史请求参数
  public PUBLIC_STORE_ID: string //共享仓库id
  public shopcarCount: number //当前购物车数量

  /**
   * @description: 获取市场列表
   * @param {CommonParamsType} params
   * @return {*}
   */
  public getMarketList = async (params: CommonParamsType) => {
    const { data, success } = await API.market
    .searchOwn({
      data: params
    })
    if (success) {
      const { result = [], total = 0 } = data
      this.marketList = result
      this.marketTotal = total
      // 记录搜索条件
      this.QueryParams = params
    }
  }

  /**
   * @description: 创建市场
   * @param:
   * @return {*}
   */
  public creatMarket = async (params: {
    name: string
    code: string
    samrId: string
    authId: string // 空间为组织单位时取组织单位 的authId
    remark: string
    public: boolean
  }) => {
    const { success } = await API.appstore.create({
      data: params
    })
    if (success) {
      await this.getMarketList(this.QueryParams)
    }
  }

  /**
   * @desc: 更新商店信息
   * @event:{
        "id": 0,
        "name": "string",
        "code": "string",
        "samrId": 0,
        "remark": "string",
        "public": true
      }
   * @return {*}
   */
  public updateMarket = async (params: {
    id: string
    name: string
    code: string
    samrId: string
    authId: string // 空间为组织单位时取组织单位 的authId
    remark: string
    public: boolean
  }) => {
    const { success } = await API.appstore.create({
      data: params
    })
    if (success) {
      await  this.getMarketList(this.QueryParams)
    }
  }
  /**
   * @description: 删除 管理的市场
   * @param {string} id 市场id
   * @return {*}
   */

  public deleteMarket = async (id: string) => {
    const { success } = await API.appstore.marketDel({
      data: { id }
    })
    if (success) {
      await this.getMarketList(this.QueryParams)
    }
  }
  /**
   * @desc: 退出市场
   * @param {string} id 市场Id
   * @return {*}
   */
  public quitMarket = async (id: string | number) => {
    const { success } = await API.appstore.marketQuit({
      data: { id }
    })
    if (success) {
    await this.getMarketList(this.QueryParams)
    }
  }

  /**
   * @description: 获取共享仓库详情
   * @event:{}
   * @return {*}
   */
  public getPublicStore = async () => {
    const { success, data } = await API.market.getSoftShareInfo()
    if (success) {
      const { id } = data
      this.PUBLIC_STORE_ID = id
    }
  }
  // -------------------购物车-------------------------------
  /**
   * @description: 获取当前购物车数量
   * @return {*}
   */
  public getShopCarCount = async () => {
    const { success, data } = await API.market.searchStaging({
      data: {
        id: 0, //市场id （需删除）
        offset: 0,
        limit: 2,
        filter: ''
      }
    })
    if (success) {
      let { total = 0 } = data
      this.shopcarCount = total
    }
  }
}
const marketServices = new MarketServices()
export default marketServices
console.log('marketServices', marketServices)
