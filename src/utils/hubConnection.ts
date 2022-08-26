
import * as signalR from '@microsoft/signalr'

// 消息服务
// 创建链接

type anyStoreType = {
    _prefix: string,
    _connection: signalR.HubConnection, // 链接对象本身
    _subscribedKeys: Record<string, (data: any) => void>, // 订阅的值和回调方法
    start: () => void, // 创建及启动链接
    stop: () => void, // 关闭链接
    connected: () => boolean // connected
    setPrefix: (str: string) => void,
    subscribed: (key: string, callback: (data: any) => void) => void // 订阅数据
    set: (methodsName: string, data?: any) => Promise<{ state: any; data: any; }> // 更新数据
    delete: (key: string) => Promise<{ state: any; data: any; }>, // 删除数据
    unSubscribed: (key: string) => void // 取消订阅
    _updated: (key: string, data: any) => void // 订阅时，当数据发生更变时通知，不对外使用
}
const anyStore: anyStoreType = {
    _connection: null,
    _subscribedKeys: {},
    _prefix: "",
    start: () => { // 不传默认为链接用户属性库
        if (anyStore._connection) return
        // 初始化
        anyStore._connection = new signalR.HubConnectionBuilder().withUrl('anydata/object/hub').withAutomaticReconnect().build()
        anyStore._connection.on("Updated", anyStore._updated)
        anyStore._connection.onclose((err)=>{
            anyStore._subscribedKeys = {}
        })
        anyStore._connection.start().then(() => console.log('链接成功'))
            .catch((error: any) => {
                console.log('链接出错', error)
                setTimeout(() => {
                    anyStore._connection = null
                    anyStore.start()
                }, 2000);
            })// 开启链接
    },
    connected: () => {
        if (anyStore._connection != null) {
            return anyStore._connection.state == signalR.HubConnectionState.Connected
        }
        return false
    },
    stop: () => {
        if (anyStore.connected()) {
            anyStore._connection.stop()
        }
    },
    setPrefix: (str: string) => {
        if (anyStore._prefix != str && anyStore.connected()) {
            Object.keys(anyStore._subscribedKeys).forEach((key: string) => {
                if (key.startsWith(anyStore._prefix)) {
                    delete anyStore._subscribedKeys[key]
                    anyStore._connection.invoke("UnSubscribed", key)
                }
            })
        }
        anyStore._prefix = str
    },
    // 订阅数据 key: 订阅数据的key  callback 数据发生变化时的回调
    subscribed: async (key: string, callback: (data: any) => void) => {
        if (anyStore._prefix == "") return;
        let fullKey = anyStore._prefix + "." + key
        if (!anyStore._subscribedKeys[fullKey]) {
            if(!anyStore.connected()){
                setTimeout(()=>{
                    anyStore.subscribed(key, callback)
                }, 1000)
            }else{
                anyStore._subscribedKeys[fullKey] = callback
                const { data, state: success } = await anyStore._connection.invoke("Subscribed", fullKey)
                if (success) {
                    console.log("已订阅=======", fullKey)
                    callback.call(callback, data)
                }
            }
        }
    },
    set: async (key: string, setData?: any) => {
        let fullKey = `${anyStore._prefix}.${key}`
        return await anyStore._connection.invoke("Set", fullKey, setData)
    },
    delete: async (key: string) => {
        let fullKey = `${anyStore._prefix}.${key}`
        return await anyStore._connection.invoke("Delete", fullKey)
    },
    unSubscribed: (key: string) => {
        let fullKey = `${anyStore._prefix}.${key}`
        if (!anyStore._subscribedKeys[fullKey]) return
        delete anyStore._subscribedKeys[fullKey]
        anyStore.connected() && anyStore._connection.invoke("UnSubscribed", fullKey).then(()=>{
            console.log("已订阅=======", fullKey)
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
    }
}
export default anyStore