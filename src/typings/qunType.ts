//好友/群列表 数据类型

export {}
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
interface teamType {
  authId: string
  code: string
  createTime: string
  createUser: string
  id: string
  name: string
  remark: string
  status: number
  targetId: string
  updateTime: string
  updateUser: string
  version: string
}
