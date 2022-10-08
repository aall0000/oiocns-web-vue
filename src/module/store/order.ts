  // ----------------------应用购物车功能 ---------
  // 加购应用
  // 取消加购
  // 获取当前购物车数量
  // 购买应用
  // 采购订单
  // 出售订单
  // 取消订单
  // 确认订单
import API from '@/services'
import { Merchandise, OrderType } from '@/views/Market/Order/order'

export type ListProps = Pick<PaginationProps, 'current' | 'pageSize'> & Partial<CommonParamsType>

class Order {
    private _formatPage = (params: ListProps) => {
        const sevicePage: CommonParamsType = {
            limit: params.pageSize,
            offset: params.current,
            ...params
        }
        delete sevicePage.current
        delete sevicePage.pageSize
        return sevicePage
    }
    public getSellList = async (params: ListProps) => { // 获取销售订单
        const { data, success } = await API.order.searchSellList({
            data: this._formatPage(params)
        })
        if (!success) {
            return { data: [], total: 0, success }
        }
        const list = data.result?.map(  (item: {  merchandise: Merchandise, order: OrderType  }) => {
                return {
                    ...item,
                    code: item?.order ? item?.order.code : null,
                    belongId: item?.order ? item?.order.belongId : null,
                    marketId: item?.merchandise ? item.merchandise.marketId : null
                }
            }
        )
        return { data: list || [], total: data.total || 0, success }
    }
    /* 
    买方订单
    */
    public geBuyList = async (params: ListProps) => {
        const { data, success } = await API.order.searchBuyList({
            data: this._formatPage(params)
        })
        if (!success) {
            return { data: [], total: 0, success }
        }
        const list = data.result?.map(  (item: {  merchandise: Merchandise, details: any[]  }) => {
            return {
                ...item,
                ordertype: 'buy',
                hasChildren: item.details && item.details.length > 0 ? true : false,
                marketId: item.merchandise ? item.merchandise.marketId : null
            }
        }
    )
    return { data: list || [], total: data.total || 0, success }
    }
}
export default new Order()
