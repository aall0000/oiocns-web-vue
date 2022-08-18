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
  message?: any
  team?: teamType
}

// 群数据类型
interface teamType extends userType {
  authId: string
  remark: string
  targetId: string
}

interface ImMsgChildType {
  id: string
  label: string
  msgTime: string
  name: string
  remark: string
  typeName: string
  createTime:string
  msgBody?: any
  spaceId?:string
  count?: number
}
// 聊天 侧边栏展示列表类型
interface ImMsgType {
  chats: ImMsgChildType[]
  id: string
  name: string
}
