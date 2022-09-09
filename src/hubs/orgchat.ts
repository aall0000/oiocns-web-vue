import * as signalR from '@microsoft/signalr'
import { ElMessage } from 'element-plus'
import { ref, Ref } from 'vue'
import anyStore from '@/utils/anystore'
// 消息服务
// 创建链接

type orgChatType = {
    _connection: signalR.HubConnection, // 链接对象本身
    _callBack: Function,
    chats: Ref<ImMsgType[]>,
    _stoped: boolean,
    userId: string,
    lastMsg: any,
    nameMap: Record<string, string>,
    curMsgs: Ref<any[]>,
    qunPersons: Ref<any[]>,
    curChat: Ref<ImMsgChildType>,
    openChats: ImMsgChildType[],
    start: (accessToken: string, userId: string) => void, // 创建及启动链接
    stop: () => void, // 关闭链接
    getName: (id: string) => string, //获取名称
    getNoRead: () => string, //获取未读数量
    getChats: () => Promise<ResultType>, //获取会话列表
    sendMsg: (data: any) => Promise<ResultType>, //发送消息
    recallMsg: (ids: [string]) => Promise<ResultType>, //撤回消息
    setCurrent: (chat: ImMsgChildType) => void, //设置当前会话
    getPersons: (reset: boolean) => Promise<ResultType>, //获取组织人员
    getHistoryMsg: () => Promise<ResultType>, //获取历史消息
    isConnected: () => boolean //  判断该链接的状态是否为connected
    subscribed: (callback: (data: any) => void) => void // 订阅数据
    unSubscribed: () => void // 取消订阅
    _recvMsg: (data: any) => void // 订阅时，当数据发生更变时通知，不对外使用
    _handleMsg: (data: any) => void // 处理消息
    _loadChats: (cache: boolean) => void //加载会话
}
const orgChat: orgChatType = {
    _connection: null,
    _callBack: null,
    chats: ref<ImMsgType[]>([]),
    _stoped: false,
    userId: "",
    lastMsg: null,
    curChat: ref<ImMsgChildType>(null),
    qunPersons: ref<any[]>([]),
    nameMap: {},
    openChats: [],
    curMsgs: ref<any[]>([]),
    start: (accessToken: string, userId: string) => {
        orgChat.userId = userId
        orgChat._stoped = false
        anyStore.start(accessToken, userId)
        if (orgChat._connection)
            return
        // 初始化
        orgChat._connection = new signalR.HubConnectionBuilder().withUrl('/orginone/orgchat/msghub').build()
        orgChat._connection.on("RecvMsg", orgChat._recvMsg)
        orgChat._connection.onclose((error) => {
            if (!orgChat._stoped) {
                console.log('链接已断开,2秒后重连', error)
                setTimeout(() => {
                    orgChat._connection = null
                    orgChat.start(accessToken, userId)
                }, 2000)
            }
        })
        orgChat._connection.start().then(async () => {
            await anyStore.subscribed("orgChat", async (data) => {
                if (data.chats) {
                    orgChat.chats.value = data.chats
                }
                if (data.nameMap) {
                    orgChat.nameMap = data.nameMap
                }
                if (data.openChats) {
                    orgChat.openChats = data.openChats
                }
                if (data.lastMsg && orgChat.curChat.value) {
                    if (orgChat.curChat.value.id === data.lastMsg.chat.id &&
                        orgChat.curChat.value.spaceId === data.lastMsg.chat.spaceId) {
                        let exist = orgChat.curMsgs.value.filter(item=>{
                            return item.id === data.lastMsg.data.id
                        }).length > 0
                        if(!exist){
                            orgChat.curMsgs.value.push(data.lastMsg.data)
                        }
                    }
                }
                orgChat._loadChats(false)
            })
            await orgChat._connection.invoke("TokenAuth", accessToken)
            if (orgChat.chats.value.length < 1) {
                await orgChat.getChats()
            }
        }).catch((error: any) => {
            console.log('链接出错,30秒后重连', error)
            setTimeout(() => {
                orgChat._connection = null
                orgChat.start(accessToken, userId)
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
        anyStore.stop()
        if (orgChat.isConnected()) {
            orgChat._connection.stop()
        }
        orgChat._connection = null
        orgChat._stoped = true
        orgChat.chats.value = []
        orgChat.curChat.value = null
        orgChat.curMsgs.value = []
        orgChat.openChats = []
        orgChat.nameMap = {}
        orgChat._callBack = null
        orgChat.qunPersons.value = []
    },
    getName: (id: string) => {
        let name = orgChat.nameMap[id] || '-'
        if (name.indexOf(']') > -1) {
            return name.split(']')[1]
        }
        return name
    },
    getNoRead: () => {
        let sum = 0
        orgChat.chats.value.forEach(item => {
            item.chats.forEach(chat => {
                sum += chat.noRead || 0
            })
        });
        if (sum > 999) {
            return "999+"
        }
        if (sum == 0) {
            return ""
        }
        return sum.toString()
    },
    getChats: async () => {
        if (orgChat.isConnected()) {
            let res = await orgChat._connection.invoke("GetChats")
            if (res.success) {
                const { groups = [] } = res.data
                groups.forEach((item: ImMsgType) => {
                    item.chats.forEach((chat: ImMsgChildType) => {
                        chat.spaceId = item.id
                        chat.totalMsg = 10000
                        chat.personNum = 10000
                        chat.showTxt = chat.msgBody?.includes('img') ? "[图片]" : chat.msgBody
                        if (chat.id == orgChat.userId) {
                            chat.name = `我 (${chat.name})`
                        }
                        let typeName = chat.typeName == '人员' ? '' : `[${chat.typeName}]`
                        orgChat.nameMap[chat.id] = `${chat.name}${typeName}`
                    })
                })
                orgChat.chats.value = [...groups]
                orgChat._loadChats(true)
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
    setCurrent: async (chat: ImMsgChildType) => {
        if (orgChat.curChat.value) {
            orgChat.openChats = orgChat.openChats.filter((item) => {
                return item.id !== orgChat.curChat.value.id ||
                    item.spaceId !== orgChat.curChat.value.spaceId
            })
        }
        orgChat.curChat.value = null
        orgChat.curMsgs.value = []
        orgChat.qunPersons.value = []
        if (chat && chat.id.length > 0) {
            chat.noRead = 0
            orgChat.curChat.value = chat
            await orgChat.getHistoryMsg()
            if (chat.typeName !== "人员") {
                await orgChat.getPersons(true)
            } else {
                orgChat.curChat.value.personNum = 0
            }
            orgChat.openChats.push(orgChat.curChat.value)
        }
        orgChat._loadChats(true)
    },
    getPersons: async (reset: boolean) => {
        if (reset) {
            orgChat.qunPersons.value = []
        }
        if (orgChat.isConnected() && orgChat.curChat &&
            orgChat.curChat.value.personNum > orgChat.qunPersons.value.length) {
            let res = await orgChat._connection.invoke("GetPersons", {
                cohortId: orgChat.curChat.value.id,
                limit: 10,
                offset: orgChat.qunPersons.value.length
            })
            if (res.success) {
                orgChat.curChat.value.personNum = res.data.total
                if (res.data.result) {
                    res.data.result.forEach((item: any) => {
                        if (item.team) {
                            item.name = item.team.name
                            if (item.id == orgChat.userId) {
                                item.name = `我 (${item.name})`
                            }
                            let typeName = item.typeName == '人员' ? '' : `[${item.typeName}]`
                            orgChat.nameMap[item.id] = `${item.name}${typeName}`
                        }
                        orgChat.qunPersons.value.push(item)
                    })
                    orgChat._loadChats(true)
                }
            }
            return res
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    getHistoryMsg: async () => {
        if (orgChat.isConnected() && orgChat.curChat &&
            orgChat.curChat.value.totalMsg > orgChat.curMsgs.value.length) {
            let funcName = 'QueryFriendMsg'
            let idName = 'friendId'
            if (orgChat.curChat.value.typeName != '人员') {
                funcName = 'QueryCohortMsg'
                idName = 'cohortId'
            }
            let res = await orgChat._connection.invoke(funcName, {
                limit: 15,
                [idName]: orgChat.curChat.value.id,
                offset: orgChat.curMsgs.value.length,
                spaceId: orgChat.curChat.value.spaceId
            })
            if (res.success) {
                orgChat.curChat.value.totalMsg = res.data.total
                if (res.data.result) {
                    res.data.result.forEach((item: any) => {
                        orgChat.curMsgs.value.unshift(item)
                    })
                }
            }
            return res
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    // 订阅数据 key: 订阅数据的key  callback 数据发生变化时的回调
    subscribed: async (callback: (data: any) => void) => {
        orgChat._callBack = callback
    },
    unSubscribed: () => {
        orgChat._callBack = null
        orgChat.setCurrent(null)
    },
    _loadChats: (cache: boolean) => {
        orgChat.chats.value.forEach((item) => {
            if (orgChat.curChat.value) {
                item.chats.forEach((chat: ImMsgChildType) => {
                    if (chat.id === orgChat.curChat.value.id &&
                        chat.spaceId === orgChat.curChat.value.spaceId) {
                        chat.noRead = 0
                    }
                })
            }
        })
        if (cache) {
            anyStore.set("orgChat", {
                operation: "replaceAll",
                data: {
                    name: "我的消息",
                    chats: orgChat.chats.value,
                    nameMap: orgChat.nameMap,
                    openChats: orgChat.openChats,
                    lastMsg: orgChat.lastMsg
                }
            })
        }
    },
    _recvMsg: (data: any) => {
        orgChat._handleMsg(data)
        if (orgChat._callBack) {
            orgChat._callBack.call(orgChat._callBack, data)
        } else {
            if (orgChat.chats.value.length < 1) {
                setTimeout(() => {
                    orgChat._recvMsg(data)
                }, 1000);
            } else {
                let from = orgChat.nameMap[data.fromId] || ''
                let to = orgChat.nameMap[data.toId] || ''
                if (to.startsWith('我')) {
                    to = "你"
                }
                ElMessage({
                    message: `[${from}=>${to}]: ${data.msgBody}`,
                    type: 'success'
                })
            }
        }
    },
    _handleMsg: (data: any) => {
        if (data.msgType === "recall") {
            data.showTxt = "撤回了一条消息"
            orgChat.curMsgs.value.forEach((item: any) => {
                if (item.id === data.id) {
                    item.msgBody = data.msgBody
                    item.msgType = "recall"
                    item.createTime = data.createTime
                }
            })
        }
        if(data.spaceId === data.fromId){
            data.spaceId = orgChat.userId
        }
        orgChat.chats.value.forEach((item: ImMsgType) => {
            if (item.id === data.spaceId) {
                let newChats: ImMsgChildType[] = []
                item.chats.forEach((chat: ImMsgChildType) => {
                    let sessionId = data.toId
                    if (chat.typeName === "人员" &&
                        data.fromId !== orgChat.userId &&
                        data.toId === orgChat.userId) {
                        sessionId = data.fromId
                    }
                    if (sessionId == chat.id) {
                        chat.msgBody = data.msgBody
                        chat.msgTime = data.msgTime
                        chat.msgBody = data.msgType
                        if (chat.msgType != "recall") {
                            chat.showTxt = data.msgBody?.includes('img') ? "[图片]" : data.msgBody
                        } else {
                            chat.showTxt = data.showTxt
                        }
                        if (orgChat.curChat.value && orgChat.curChat.value.id === chat.id &&
                            orgChat.curChat.value.spaceId === chat.spaceId) {
                            orgChat.curMsgs.value.push(data)
                            newChats.unshift(chat)
                        } else {
                            let opened = orgChat.openChats.filter(i => {
                                return i.id === chat.id && i.spaceId === chat.spaceId
                            }).length > 0
                            if (!opened) {
                                chat.noRead = (chat.noRead || 0) + 1
                            }
                            newChats.push(chat)
                        }
                        orgChat.lastMsg = {
                            data: data,
                            chat: chat
                        }
                    } else {
                        newChats.push(chat)
                    }
                })
                item.chats = newChats
            }
        })
        orgChat._loadChats(true)
    },
}
export default orgChat
