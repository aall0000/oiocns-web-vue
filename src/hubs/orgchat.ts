import * as signalR from '@microsoft/signalr'
import { ElNotification } from 'element-plus'
import { ref, Ref } from 'vue'
import anyStore from '@/utils/anystore'
import notify from '@/utils/notify'
const hisMsgCollName = "chat-message"


// 消息服务
// 创建链接

type orgChatType = {
    _connection: signalR.HubConnection, // 链接对象本身
    _callBack: Function,
    chats: Ref<ImMsgType[]>,
    _stoped: boolean,
    userId: Ref<string>,
    spaceId: Ref<string>,
    lastMsg: any,
    nameMap: Record<string, string>,
    curMsgs: Ref<any[]>,
    qunPersons: Ref<any[]>,
    curChat: Ref<ImMsgChildType>,
    openChats: ImMsgChildType[],
    start: (accessToken: string, userId: string, spaceId: string) => void, // 创建及启动链接
    stop: () => void, // 关闭链接
    getName: (id: string) => string, //获取名称
    getNoRead: () => string, //获取未读数量
    parseIdentitys: (identitys: any[]) => string, //将身份解析成名称
    getChats: () => Promise<ResultType>, //获取会话列表
    sendMsg: (data: any) => Promise<ResultType>, //发送消息
    recallMsg: (msg: any) => Promise<ResultType>, //撤回消息
    deleteMsg: (msg: any) => void, //删除消息
    clearMsg: () => void, // 清空消息
    setCurrent: (chat: ImMsgChildType) => void, //设置当前会话
    getPersons: (reset: boolean) => Promise<ResultType>, //获取组织人员
    getHistoryMsg: () => Promise<number>, //获取历史消息
    isConnected: () => boolean //  判断该链接的状态是否为connected
    subscribed: (callback: (data: any) => void) => void // 订阅数据
    unSubscribed: () => void // 取消订阅
    _recvMsg: (data: any) => void // 订阅时，当数据发生更变时通知，不对外使用
    _handleMsg: (data: any) => void // 处理消息
    _cacheChats: () => void //缓存会话
    _cacheMsg: (sessionId: string, data: any) => void //缓存消息
}
const orgChat: orgChatType = {
    _connection: null,
    _callBack: null,
    chats: ref<ImMsgType[]>([]),
    _stoped: false,
    userId: ref<string>(""),
    spaceId: ref<string>(""),
    lastMsg: null,
    curChat: ref<ImMsgChildType>(null),
    qunPersons: ref<any[]>([]),
    nameMap: sessionStorage.getItem('nameMap')? JSON.parse(sessionStorage.getItem('nameMap')) : {} , // 解决首次加载时，应用中心归属人无法响应式渲染数据
    openChats: [],
    curMsgs: ref<any[]>([]),
    start: (accessToken: string, userId: string, spaceId: string) => {
        orgChat.userId.value = userId
        orgChat.spaceId.value = spaceId
        orgChat._stoped = false
        anyStore.start(accessToken, userId, spaceId)
        if (orgChat._connection)
            return
        // 初始化
        orgChat._connection = new signalR.HubConnectionBuilder().withUrl('/orginone/orgchat/msghub').build()
        orgChat._connection.on("RecvMsg", orgChat._recvMsg)
        orgChat._connection.on("ChatRefresh", async (data: any) => {
            await orgChat.getChats()
        })
        orgChat._connection.onclose((error) => {
            if (!orgChat._stoped) {
                console.log('链接已断开,5秒后重连', error)
                setTimeout(() => {
                    orgChat._connection = null
                    orgChat.start(accessToken, userId, spaceId)
                }, 5000)
            }
        })
        orgChat._connection.start().then(async () => {
            // 获取当前 用户的 会话列表
            await anyStore.subscribed("orgChat", "user", async (data) => {
                if (data.chats) {
                    orgChat.chats.value = []
                    data.chats.forEach((item: ImMsgType) => {
                        if (item.id === orgChat.spaceId.value) {
                            orgChat.chats.value.unshift(item)
                        } else {
                            orgChat.chats.value.push(item)
                        }
                    })
                }
                if (data.nameMap) {
                    orgChat.nameMap = data.nameMap
                    sessionStorage.setItem('nameMap',JSON.stringify(data.nameMap) )
                }
                if (data.openChats) {
                    orgChat.openChats = data.openChats
                }
                if (data.lastMsg && orgChat.curChat.value) {
                    if (orgChat.curChat.value.id === data.lastMsg.chat.id &&
                        orgChat.curChat.value.spaceId === data.lastMsg.chat.spaceId) {
                        let exist = orgChat.curMsgs.value.filter(item => {
                            return item.id === data.lastMsg.data.id
                        }).length > 0
                        if (!exist) {
                            orgChat.curMsgs.value.push(data.lastMsg.data)
                        }
                    }
                }
            })
            setTimeout(async () => {
                await orgChat._connection.invoke("TokenAuth", accessToken)
                if (orgChat.chats.value.length < 1) {
                    await orgChat.getChats()
                }
            }, 2000)
        }).catch((error: any) => {
            console.log('链接出错,5秒后重连', error)
            setTimeout(() => {
                orgChat._connection = null
                orgChat.start(accessToken, userId, spaceId)
            }, 5000)
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
        orgChat._callBack = null
        orgChat._stoped = true
        orgChat.chats.value = []
        orgChat.curChat.value = null
        orgChat.curMsgs.value = []
        orgChat.openChats = []
        orgChat.nameMap = {}
        orgChat.qunPersons.value = []
        orgChat.userId.value = ""
        orgChat.spaceId.value = ""
        orgChat.lastMsg = null
    },
    getName: (id: string) => {
        let name = orgChat.nameMap[id] || ''
        if (name === '' && orgChat.isConnected()) {
            orgChat._connection.invoke("GetName", id).then((res) => {
                if (res.success) {
                    orgChat.nameMap[id] = res.data
                    orgChat._cacheChats()
                }
            })
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
    parseIdentitys: (identitys: any[]) => {
        if (Array.isArray(identitys)) {
            return identitys.map((item) => {
                if (item.name.indexOf('-') > -1) {
                    let names = item.name.split('-')
                    return names[names.length - 1]
                }
                return item.name
            }).join(';')
        }
        return '暂无岗位'
    },
    getChats: async () => {
        if (orgChat.isConnected()) {
            let res = await orgChat._connection.invoke("GetChats")
            if (res.success) {
                const { groups = [] } = res.data
                groups.forEach((item: ImMsgType) => {
                    item.chats.forEach((chat: ImMsgChildType) => {
                        chat.spaceId = item.id
                        orgChat.chats.value.forEach((i: ImMsgType) => {
                            if (i.id === item.id) {
                                i.chats.forEach((c: ImMsgChildType) => {
                                    if (c.id === chat.id) {
                                        chat.msgBody = c.msgBody
                                        chat.msgTime = c.msgTime
                                        chat.msgType = c.msgType
                                        chat.showTxt = c.showTxt
                                        chat.noRead = c.noRead
                                    }
                                })
                            }
                        })
                        let typeName = chat.typeName == '人员' ? '' : `[${chat.typeName}]`
                        orgChat.nameMap[chat.id] = `${chat.name}${typeName}`
                    })
                    item.chats = item.chats.sort((a, b) => {
                        return new Date(b.msgTime).getTime() - new Date(a.msgTime).getTime()
                    })
                })
                orgChat.chats.value = [...groups]
                orgChat._cacheChats()
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
    recallMsg: async (msg: any) => {
        if (orgChat.isConnected()) {
            return await orgChat._connection.invoke("RecallMsg", msg)
        }
        return { success: false, data: 0, code: 404, msg: "" }
    },
    deleteMsg: async (msg: any) => {
        if (!msg.chatId) {
            msg.chatId = msg.id
        }
        anyStore.remove(hisMsgCollName, {
            chatId: msg.chatId
        }, "user").then((res: ResultType) => {
            if (res.data === 1 && orgChat.curMsgs.value.length > 0) {
                orgChat.curMsgs.value = orgChat.curMsgs.value.filter(item => {
                    return item.chatId != msg.chatId
                })
            }
        })
    },
    clearMsg: async () => {
        if(orgChat.curChat.value){
            anyStore.remove(hisMsgCollName, {
                sessionId: orgChat.curChat.value.id
            }, "user").then((res: ResultType) => {
                if (res.data > 0 && orgChat.curMsgs.value.length > 0) {
                    orgChat.curMsgs.value = []
                }
            })
        }
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
            }
            orgChat.openChats.push(orgChat.curChat.value)
        }
        orgChat._cacheChats()
    },
    getPersons: async (reset: boolean) => {
        if (reset) {
            orgChat.qunPersons.value = []
        }
        if (orgChat.isConnected() && orgChat.curChat) {
            let res = await orgChat._connection.invoke("GetPersons", {
                cohortId: orgChat.curChat.value.id,
                limit: 1000,
                offset: orgChat.qunPersons.value.length
            })
            if (res.success) {
                orgChat.curChat.value.personNum = res.data.total
                if (res.data.result) {
                    res.data.result.forEach((item: any) => {
                        if (item.team) {
                            item.name = item.team.name
                            let typeName = item.typeName == '人员' ? '' : `[${item.typeName}]`
                            orgChat.nameMap[item.id] = `${item.name}${typeName}`
                        }
                        orgChat.qunPersons.value.push(item)
                    })
                    orgChat._cacheChats()
                }
            }
            return res
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    getHistoryMsg: async () => {
        if (orgChat.curChat) {
            if (orgChat.curChat.value.spaceId === orgChat.userId.value) {
                let res = await anyStore.aggregate(hisMsgCollName, {
                    match: {
                        sessionId: orgChat.curChat.value.id
                    },
                    sort: {
                        createTime: -1
                    },
                    skip: orgChat.curMsgs.value.length,
                    limit: 30
                }, "user")
                if (res.success && Array.isArray(res.data)) {
                    res.data.forEach((item: any) => {
                        item.id = item.chatId
                        orgChat.curMsgs.value.unshift(item)
                    })
                    return res.data.length
                }
            } else {
                if (orgChat.isConnected() && orgChat.curChat) {
                    let funcName = 'QueryFriendMsg'
                    let idName = 'friendId'
                    if (orgChat.curChat.value.typeName != '人员') {
                        funcName = 'QueryCohortMsg'
                        idName = 'cohortId'
                    }
                    let res = await orgChat._connection.invoke(funcName, {
                        limit: 30,
                        [idName]: orgChat.curChat.value.id,
                        offset: orgChat.curMsgs.value.length,
                        spaceId: orgChat.curChat.value.spaceId
                    })
                    if (res.success) {
                        if (res.data.result) {
                            res.data.result.forEach((item: any) => {
                                orgChat.curMsgs.value.unshift(item)
                            })
                            return res.data.result.length
                        }
                    }
                }
            }
        }
        return 0
    },
    // 订阅数据 key: 订阅数据的key  callback 数据发生变化时的回调
    subscribed: async (callback: (data: any) => void) => {
        orgChat._callBack = callback
    },
    unSubscribed: () => {
        orgChat._callBack = null
        orgChat.setCurrent(null)
    },
    _cacheChats: () => {
        anyStore.set("orgChat", {
            operation: "replaceAll",
            data: {
                name: "我的消息",
                chats: orgChat.chats.value,
                nameMap: orgChat.nameMap,
                openChats: orgChat.openChats,
                lastMsg: orgChat.lastMsg
            }
        }, "user")
    },
    _recvMsg: (data: any) => { // 接收到新消息的回调 
        orgChat._handleMsg(data)

        if (orgChat._callBack) { // 如果有回调，说明在消息聊天页面，执行相关回调
            orgChat._callBack.call(orgChat._callBack, data)
        } else { // 没有回调 则说明不在聊天界面，弹出消息提醒
            if (orgChat.chats.value.length < 1) {
                setTimeout(() => {
                    orgChat._recvMsg(data)
                }, 1000);
            } else {
                let to = orgChat.nameMap[data.toId] || ''
                const noReadCout = orgChat.getNoRead()
                if (to.startsWith('我')) {
                    to = "你"
                }
                ElNotification.closeAll()
                ElNotification({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    offset: 30,
                    duration: 2500,
                    message: `<div style="position:relative;">
                    <span style="color: var(--el-text-color-secondary);margin-right:4px;">${to}有最新消息</span> 
                    ${noReadCout ? `<div class="el-badge">
                    <sup class="el-badge__content el-badge__content--danger">${orgChat.getNoRead()}</sup></div>` : ''}
                    <div style="overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    word-break: break-all;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    ">${data.showTxt}</div><div>`
                })
            }
        }
    },
    _handleMsg: (data: any) => {
        if (!orgChat.chats.value || orgChat.chats.value.length < 1) {
            setTimeout(() => {
                orgChat._handleMsg(data)
            }, 1000)
        }
        if (data.msgType === "recall") {
            data.showTxt = "撤回了一条消息"
            orgChat.curMsgs.value.forEach((item: any) => {
                if (item.id === data.id) {
                    item.showTxt = data.showTxt
                    item.msgBody = data.msgBody
                    item.msgType = "recall"
                    item.createTime = data.createTime
                    if (data.fromId === orgChat.userId.value) {
                        item.allowEdit = true
                    } else {
                        delete item.allowEdit
                    }
                }
            })
        }
        if (data.spaceId === data.fromId) {
            data.spaceId = orgChat.userId.value
        }
        orgChat.chats.value.forEach((item: ImMsgType) => {
            if (item.id === data.spaceId) {
                let newChats: ImMsgChildType[] = []
                item.chats.forEach((chat: ImMsgChildType) => {
                    let sessionId = data.toId
                    if (chat.typeName === "人员" &&
                        data.fromId !== orgChat.userId.value &&
                        data.toId === orgChat.userId.value) {
                        sessionId = data.fromId
                    }
                    if (sessionId == chat.id) {
                        if (chat.spaceId === orgChat.userId.value) {
                            orgChat._cacheMsg(sessionId, data)
                        }
                        chat.msgBody = data.msgBody
                        chat.msgType = data.msgType
                        chat.msgTime = data.createTime
                        if (chat.msgType != "recall") {
                            chat.showTxt = data.msgBody?.includes('img') ? "[图片]" : data.msgBody
                        } else {
                            chat.showTxt = data.showTxt
                        }
                        if (chat.typeName !== "人员") {
                            chat.showTxt = orgChat.nameMap[data.fromId] + ": " + chat.showTxt
                        }
                        data.showTxt = chat.showTxt
                        if (orgChat.curChat.value && orgChat.curChat.value.id === chat.id &&
                            orgChat.curChat.value.spaceId === chat.spaceId) {
                            if (data.msgType !== "recall") {
                                orgChat.curMsgs.value.push(data)
                            }
                            newChats.unshift(chat)
                        } else {
                            let opened = orgChat.openChats.filter(i => {
                                return i.id === chat.id && i.spaceId === chat.spaceId
                            }).length > 0
                            if (!opened) {
                                notify.player();
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
        orgChat._cacheChats()
    },
    _cacheMsg: (sessionId: string, data: any) => {
        if (data.msgType === "recall") {
            anyStore.update(hisMsgCollName, {
                match: {
                    chatId: data.id
                },
                update: {
                    _set_: {
                        msgBody: data.msgBody,
                        msgType: data.msgType,
                    }
                },
                options: {}
            }, "user")
        } else {
            anyStore.insert(hisMsgCollName, {
                chatId: data.id,
                toId: data.toId,
                spaceId: data.spaceId,
                fromId: data.fromId,
                msgType: data.msgType,
                msgBody: data.msgBody,
                sessionId: sessionId,
                createTime: data.createTime
            }, "user")
        }
    }
}
export default orgChat
