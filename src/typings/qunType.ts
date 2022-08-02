// @ts-nocheck

//好友/群列表 数据类型
interface userType {
  code: string
  createTime: string
  createUser: string
  id: string
  name: string
  status: number
  thingId: string
  typeName: string
  updateTime: string
  updateUser: string
  version: string
  team?: teamType
}

// 群数据类型
interface teamType extends userType  {
  authId: string
  remark: string
  targetId: string
}
