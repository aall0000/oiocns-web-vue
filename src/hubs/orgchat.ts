import * as signalR from '@microsoft/signalr'
import { ElMessage } from 'element-plus'
import { ref,Ref } from 'vue'
// 消息服务
// 创建链接

type orgChatType = {
    _connection: signalR.HubConnection, // 链接对象本身
    _callBack: Function,
    chats: Ref<ImMsgType[]>,
    _stoped: boolean,
    userId: string,
    nameMap: Map<string,string>,
    start: (accessToken: string, userId: string) => void, // 创建及启动链接
    stop: () => void, // 关闭链接
    getChats: () => Promise<ResultType>,
    sendMsg: (data: any) => Promise<ResultType>,
    recallMsg: (ids: [string]) => Promise<ResultType>,
    getPersons: (id: string, limit: number, offset: number) => Promise<ResultType>,
    getHistoryMsg: (id: string, spaceId: string, type: string, limit: number, offset: number) => Promise<ResultType>,
    isConnected: () => boolean //  判断该链接的状态是否为connected
    subscribed: (callback: (data: any) => void) => void // 订阅数据
    unSubscribed: () => void // 取消订阅
    _recvMsg: (data: any) => void // 订阅时，当数据发生更变时通知，不对外使用
}
const orgChat: orgChatType = {
    _connection: null,
    _callBack: null,
    chats: ref<ImMsgType[]>([]),
    _stoped: false,
    userId: "",
    nameMap: new Map(),
    start: (accessToken: string, userId: string) => {
        orgChat._stoped = false
        orgChat.userId = userId
        if (orgChat._connection)
            return
        // 初始化
        orgChat._connection = new signalR.HubConnectionBuilder().withUrl('/orginone/orgchat/msghub').build()
        orgChat._connection.on("RecvMsg", orgChat._recvMsg)
        orgChat._connection.onclose((error) => {
            if(!orgChat._stoped){
                console.log('链接已断开,2秒后重连', error)
                setTimeout(() => {
                    orgChat._connection = null
                    orgChat.start(accessToken,userId)
                }, 2000)
            }
        })
        orgChat._connection.start().then(async () => {
            await orgChat._connection.invoke("TokenAuth", accessToken)
            await orgChat.getChats()
        }).catch((error: any) => {
            console.log('链接出错,2秒后重连', error)
            setTimeout(() => {
                orgChat._connection = null
                orgChat.start(accessToken,userId)
            }, 2000)
        }) // 开启链接
    },
    isConnected: () => {
        if (orgChat._connection != null) {
            return orgChat._connection.state == signalR.HubConnectionState.Connected
        }
        return false
    },
    stop: () => {
        if (orgChat.isConnected()) {
            orgChat._connection.stop()
        }
        orgChat._connection = null
        orgChat._stoped = true;
    },
    getChats: async () => {
        if (orgChat.isConnected()) {
            let res = await orgChat._connection.invoke("GetChats")
            if(res.success){
                const { groups = [] } = res.data
                groups.forEach((item:ImMsgType)=>{
                    item.chats.forEach((chat:ImMsgChildType)=>{
                        if(chat.id == orgChat.userId){
                            chat.name = `我 (${chat.name})`
                        }
                        let typeName = chat.typeName == '人员' ? '' : `[${chat.typeName}]`
                        orgChat.nameMap.set(chat.id, `${chat.name}${typeName}`)
                    })
                })
                orgChat.chats.value = [...groups]
            }
            return res
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    sendMsg: async (data) => {
        if (orgChat.isConnected()) {
            return await orgChat._connection.invoke("SendMsg", data)
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    recallMsg: async (ids: [string]) => {
        if (orgChat.isConnected()) {
            return await orgChat._connection.invoke("RecallMsg", { ids: ids })
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    getPersons: async (id: string, limit: number, offset: number) => {
        if (orgChat.isConnected()) {
            return await orgChat._connection.invoke("GetPersons", {
                cohortId: id,
                limit: limit,
                offset: offset
            })
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    getHistoryMsg: async (id: string, spaceId: string, type: string, limit: number, offset: number) => {
        if (orgChat.isConnected()) {
            const url: string = type == '人员' ? 'QueryFriendMsg' : 'QueryCohortMsg'
            return await orgChat._connection.invoke(url, {
                [type == '人员' ? 'friendId' : 'cohortId']: id,
                offset: offset,
                limit: limit,
                spaceId: spaceId
            })
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    // 订阅数据 key: 订阅数据的key  callback 数据发生变化时的回调
    subscribed: async (callback: (data: any) => void) => {
        orgChat._callBack = callback
    },
    unSubscribed: () => {
        orgChat._callBack = null
    },
    // 收到数据更新的消息，本地可回调 （私有方法）
    _recvMsg: (data: any) => {
        // 当数据发生变化时，更新本地数据
        console.log('接收到新消息', data)
        if (orgChat._callBack) {
            orgChat._callBack.call(orgChat._callBack, data)
        }else{
            let from = orgChat.nameMap.get(data.fromId) || ''
            let to = orgChat.nameMap.get(data.toId) || ''
            ElMessage({
                message: `${from}=>${to}:${data.msgBody}`,
                type: 'success'
            })
        }
    }
}
export default orgChat
