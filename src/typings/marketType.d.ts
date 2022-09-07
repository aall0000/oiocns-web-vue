//常规option类型
interface OptionType {
  value: string
  label?: string
  id?: string | number
}
// select数据类型
interface selectType {
  label: string
  id: string | number
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
  source: string
  status: number
  thingId: string
  typeName: string
  updateTime: string
  updateUser: string
  public?:boolean
  version?: string
  remark?: string
  icon?:string
}

interface AppMenuType {
  name: string
  link: string
  customId: string
  code:string
  privateKey:string
}

type ProductMenuEventType = 'Add' | 'Delete' | 'Up' | 'Down'
