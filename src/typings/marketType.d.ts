//常规option类型
interface OptionType {
  value: string
  label?: string
  id?: string | number
}

// 应用商品数据类型
interface ProductType {
  authority?: string
  belongId?: string
  code: string
  createTime: string
  createUser: string
  endTime: string
  id: string
  name: string
  remark: string
  source: string
  status: number
  thingId: string
  typeName: string
  updateTime: string
  updateUser: string
  version?: string
}

interface AppMenuType {
  caption: string
  menuType: string
  link: string
  resource: any
  menus?: AppMenuType[]
}
