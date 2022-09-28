export type Merchandise = { // 商品
    caption: string;
    days: string;
    sellAuth: string;
    price: string;
    information: string;
    marketId: string
}
export type OrderType = { // 订单主表
    code: string;
    name: string;
    status: number,
    belongId: string
}