
import * as signalR from '@microsoft/signalr'

// 消息服务
// 创建链接

type anyStoreType = {
    _stoped: boolean,
    userId: string,
    _connection: signalR.HubConnection, // 链接对象本身
    _subscribedKeys: Record<string, (data: any) => void>, // 订阅的值和回调方法
    start: (accessToken: string, userId: string) => void, // 创建及启动链接
    stop: () => void, // 关闭链接
    isConnected: () => boolean //  判断该链接的状态是否为connected
    subscribed: (key: string, callback: (data: any) => void) => void // 订阅数据
    get: (key: string) => Promise<ResultType>,
    set: (methodsName: string, data?: any) => Promise<ResultType> // 更新数据
    delete: (key: string) => Promise<ResultType>, // 删除数据
    unSubscribed: (key: string) => void // 取消订阅
    _updated: (key: string, data: any) => void // 订阅时，当数据发生更变时通知，不对外使用
    _resubscribed: ()=>void
}
const anyStore: anyStoreType = {
    _stoped: false,
    _connection: null,
    _subscribedKeys: {},
    userId: "",
    start: (accessToken: string, userId: string) => { // 不传默认为链接用户属性库
        anyStore._stoped = false
        anyStore.userId = userId
        if (anyStore._connection) return
        // 初始化
        anyStore._connection = new signalR.HubConnectionBuilder().withUrl('/orginone/anydata/object/hub').build()
        anyStore._connection.on("Updated", anyStore._updated)
        anyStore._connection.onclose((error) => {
            if(!anyStore._stoped){
                console.log('链接已断开,2秒后重连', error)
                setTimeout(() => {
                    anyStore._connection = null
                    anyStore.start(accessToken,userId)
                }, 2000);
            }
        })
        anyStore._connection.start().then(async() => {
            await anyStore._connection.invoke("TokenAuth", "user", accessToken)
            anyStore._resubscribed()
        }).catch((error: any) => {
            console.log('链接出错,2秒后重连', error)
            setTimeout(() => {
                anyStore._connection = null
                anyStore.start(accessToken,userId)
            }, 2000);
        })// 开启链接
    },
    isConnected: () => {
        if (anyStore._connection != null) {
            return anyStore._connection.state == signalR.HubConnectionState.Connected
        }
        return false
    },
    stop: () => {
        if (anyStore.isConnected()) {
            anyStore._connection.stop()
        }
        anyStore._connection = null
        anyStore._stoped = true;
    },
    // 订阅数据 key: 订阅数据的key  callback 数据发生变化时的回调
    subscribed: async (key: string, callback: (data: any) => void) => {
        if (!anyStore._subscribedKeys[key]) {
            if (!anyStore.isConnected()) {
                setTimeout(() => {
                    anyStore.subscribed(key, callback)
                }, 1000)
            } else {
                anyStore._subscribedKeys[key] = callback
                const { data, state: success } = await anyStore._connection.invoke("Subscribed", key)
                if (success) {
                    console.log("已订阅===", key)
                    callback.call(callback, data)
                }
            }
        }
    },
    get: async (key: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke("Get", key)
        }
        return {success: false,data: {},code: 404, msg: ""}
    },
    set: async (key: string, setData?: any) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke("Set", key, setData)
        }
        return {success: false,data: {},code: 404, msg: ""}
    },
    delete: async (key: string) => {
        if (anyStore.isConnected()) {
            return await anyStore._connection.invoke<ResultType>("Delete", key)
        }
        return {success: false,data: {},code: 404, msg: ""}
    },
    unSubscribed: (key: string) => {
        if (!anyStore._subscribedKeys[key]) return
        delete anyStore._subscribedKeys[key]
        anyStore.isConnected() && anyStore._connection.invoke("UnSubscribed", key).then(() => {
            console.log("取消订阅===", key)
        })
    },
    // 收到数据更新的消息，本地可回调 （私有方法）
    _updated: (key: string, data: any) => {
        // 当数据发生变化时，更新本地数据
        console.log('数据发生变化了', key, data)
        const callback: (data: any) => void = anyStore._subscribedKeys[key]
        if (callback) {
            callback.call(callback, data)
        }
    },
    _resubscribed: ()=>{
        if(anyStore.isConnected()){
            Object.keys(anyStore._subscribedKeys).forEach(async key=>{
                const { data, state: success } = await anyStore._connection.invoke("Subscribed", key)
                if (success) {
                    anyStore._subscribedKeys[key].call(anyStore._subscribedKeys[key], data)
                }
            })
        }
    }
}
export default anyStore
