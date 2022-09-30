
import * as signalR from '@microsoft/signalr'

// 消息服务
// 创建链接

type anyStoreType = {
    _stoped: boolean,
    userId: string,
    spaceId: string,
    authed: boolean,
    _connection: signalR.HubConnection, // 链接对象本身
    _subscribedKeys: Record<string, (data: any) => void>, // 订阅的值和回调方法
    start: (accessToken: string, userId: string, spaceId: string) => void, // 创建及启动链接
    stop: () => void, // 关闭链接
    isConnected: () => boolean //  判断该链接的状态是否为connected
    subscribed: (key: string, domain: string, callback: (data: any) => void) => void // 订阅数据
    get: (key: string, domain: string) => Promise<ResultType>,
    set: (methodsName: string, data: any, domain: string) => Promise<ResultType> // 更新数据
    delete: (key: string, domain: string) => Promise<ResultType>, // 删除数据
    insert: (collName: string, data: any, domain: string) => Promise<ResultType>, // 插入集合数据
    remove: (collName: string, match: any, domain: string) => Promise<ResultType>, // 移除匹配数据
    update: (collName: string, update: any, domain: string) => Promise<ResultType>, // 更新匹配数据
    aggregate: (collName: string, options: any, domain: string) => Promise<ResultType>, // 通过管道查询集合数据
    unSubscribed: (key: string, domain: string) => void // 取消订阅
    _updated: (key: string, data: any) => void // 订阅时，当数据发生更变时通知，不对外使用
    _resubscribed: () => void
}
const anyStore: anyStoreType = {
    _stoped: false,
    _connection: null,
    _subscribedKeys: {},
    userId: "",
    spaceId: "",
    authed: false,
    start: (accessToken: string, userId: string, spaceId: string) => { // 不传默认为链接用户属性库
        anyStore.userId = userId
        anyStore.spaceId = spaceId
        anyStore._stoped = false
        anyStore.authed = false
        if (anyStore._connection) return
        // 初始化
        anyStore._connection = new signalR.HubConnectionBuilder().withUrl('/orginone/anydata/hub').build()
        anyStore._connection.serverTimeoutInMilliseconds = 5000
        anyStore._connection.keepAliveIntervalInMilliseconds = 3000
        anyStore._connection.on("Updated", anyStore._updated)
        anyStore._connection.onclose((error) => {
            anyStore.authed = false
            if (!anyStore._stoped) {
                console.log('链接已断开,5秒后重连', error)
                setTimeout(() => {
                    anyStore._connection = null
                    anyStore.start(accessToken, userId, spaceId)
                }, 5000);
            }
        })
        anyStore._connection.start().then(async () => {
            await anyStore._connection.invoke("TokenAuth", accessToken, "user")
            anyStore.authed = true
            anyStore._resubscribed()
        }).catch((error: any) => {
            console.log('链接出错,5秒后重连', error)
            setTimeout(() => {
                anyStore._connection = null
                anyStore.start(accessToken, userId, spaceId)
            }, 5000);
        })// 开启链接
    },
    isConnected: () => {
        if (anyStore._connection != null && anyStore.authed) {
            return anyStore._connection.state == signalR.HubConnectionState.Connected
        }
        return false
    },
    stop: () => {
        if (anyStore.isConnected()) {
            anyStore._connection.stop()
        }
        anyStore._connection = null
        anyStore._stoped = true
        anyStore.authed = false
        anyStore._subscribedKeys = {}
    },
    // 订阅数据 key: 订阅数据的key  callback 数据发生变化时的回调
    subscribed: async (key: string, domain: string, callback: (data: any) => void) => {
        let fullKey = key + '|' + domain
        if (!anyStore._subscribedKeys[fullKey]) {
            anyStore._subscribedKeys[fullKey] = callback
            if (anyStore.isConnected()) {
                let { data, success } = await anyStore._connection.invoke("Subscribed", key, domain)
                if (success) {
                    callback.call(callback, data)
                }
            }
        }
    },
    get: async (key: string, domain: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke("Get", key, domain)
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    set: async (key: string, setData: any, domain: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke("Set", key, setData, domain)
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    delete: async (key: string, domain: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke<ResultType>("Delete", key, domain)
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    insert: async (collName: string, data: any, domain: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke<ResultType>("Insert", collName, data, domain)
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    update: async (collName: string, update: any, domain: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke<ResultType>("Update", collName, update, domain)
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    remove: async (collName: string, match: any, domain: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke<ResultType>("Remove", collName, match, domain)
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    aggregate: async (collName: string, options: any, domain: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke<ResultType>("Aggregate", collName, options, domain)
        }
        return { success: false, data: {}, code: 404, msg: "" }
    },
    unSubscribed: (key: string, domain: string) => {
        let fullKey = key + '|' + domain
        if (anyStore._subscribedKeys[fullKey]) {
            delete anyStore._subscribedKeys[fullKey]
            anyStore.isConnected()
            anyStore._connection.invoke("UnSubscribed", key, domain)
        }
    },
    // 收到数据更新的消息，本地可回调 （私有方法）
    _updated: (key: string, data: any) => {
        Object.keys(anyStore._subscribedKeys).forEach(fullKey => {
            if (fullKey.split('|')[0] === key) {
                const callback: (data: any) => void = anyStore._subscribedKeys[fullKey]
                if (callback) {
                    callback.call(callback, data)
                }
            }
        })
    },
    _resubscribed: () => {
        if (anyStore.isConnected()) {
            Object.keys(anyStore._subscribedKeys).forEach(async fullKey => {
                let key = fullKey.split('|')[0]
                let domain = fullKey.split('|')[1]
                const { data, success } = await anyStore._connection.invoke("Subscribed", key, domain)
                if (success) {
                    anyStore._subscribedKeys[fullKey].call(anyStore._subscribedKeys[fullKey], data)
                }
            })
        }
    }
}
export default anyStore
