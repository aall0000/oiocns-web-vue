
import * as signalR from '@microsoft/signalr'

// 消息服务
// 创建链接

type anyStoreType = {
    _connection: signalR.HubConnection, // 链接对象本身
    _authed: boolean,
    _subscribedKeys: Record<string, (data: any) => void>, // 订阅的值和回调方法
    start: () => void, // 创建及启动链接
    stop: () => void, // 关闭链接
    isConnected: () => boolean //  判断该链接的状态是否为connected
    isConnAuthed: () => boolean
    tokenAuth: (shareDomain: string, accessToken: string) => void, // 设置链接前缀，默认设置为userid
    subscribed: (key: string, callback: (data: any) => void) => void // 订阅数据
    get: (key: string) => Promise<{ success: any; data: any; }>,
    set: (methodsName: string, data?: any) => Promise<{ success: any; data: any; }> // 更新数据
    delete: (key: string) => Promise<{ success: any; data: any; }>, // 删除数据
    unSubscribed: (key: string) => void // 取消订阅
    _updated: (key: string, data: any) => void // 订阅时，当数据发生更变时通知，不对外使用
    _authAction: (action: Function, ...args:any) => void
}
const anyStore: anyStoreType = {
    _connection: null,
    _subscribedKeys: {},
    _authed: false,
    start: () => { // 不传默认为链接用户属性库
<<<<<<< HEAD
        if (anyStore._connection) return
        // 初始化
        anyStore._connection = new signalR.HubConnectionBuilder().withUrl('/orginone/anydata/object/hub').withAutomaticReconnect().build()
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
=======
        // if (anyStore._connection) return
        // // 初始化
        // anyStore._connection = new signalR.HubConnectionBuilder().withUrl('anydata/object/hub').withAutomaticReconnect().build()
        // anyStore._connection.on("Updated", anyStore._updated)
        // anyStore._connection.onclose((err)=>{
        //     anyStore._subscribedKeys = {}
        // })
        // anyStore._connection.start().then(() => console.log('链接成功'))
        //     .catch((error: any) => {
        //         console.log('链接出错', error)
        //         setTimeout(() => {
        //             anyStore._connection = null
        //             anyStore.start()
        //         }, 2000);
        //     })// 开启链接
>>>>>>> origin/Dev
    },
    isConnected: () => {
        if (anyStore._connection != null) {
            return anyStore._connection.state == signalR.HubConnectionState.Connected
        }
        return false
    },
    isConnAuthed: () => {
        return anyStore.isConnected() && anyStore._authed;
    },
    stop: () => {
        if (anyStore.isConnected()) {
            anyStore._connection.stop()
        }
    },
    tokenAuth: async (shareDomain: string, accessToken: string)=>{
        if(!anyStore.isConnected()){
            setTimeout(()=>{
                anyStore.tokenAuth(shareDomain, accessToken)
            }, 1000)
        }else{
            await anyStore._connection.invoke("TokenAuth", shareDomain, accessToken)
            anyStore._authed = true;
        }
    },
    // 订阅数据 key: 订阅数据的key  callback 数据发生变化时的回调
    subscribed: async (key: string, callback: (data: any) => void) => {
        if (!anyStore._subscribedKeys[key]) {
            if(!anyStore.isConnAuthed()){
                setTimeout(()=>{
                    anyStore.subscribed(key, callback)
                }, 1000)
            }else{
                anyStore._subscribedKeys[key] = callback
                const { data, state: success } = await anyStore._connection.invoke("Subscribed", key)
                if (success) {
                    console.log("已订阅===", key)
                    callback.call(callback, data)
                }
            }
        }
    },
    get: async (key:string) => {
        if(anyStore.isConnAuthed()){
            return await anyStore._connection.invoke("Get", key)
        }
    },
    set: async (key: string, setData?: any) => {
        if(anyStore.isConnAuthed()){
            return await anyStore._connection.invoke("Set", key, setData)
        }
    },
    delete: async (key: string) => {
        if(anyStore.isConnAuthed()){
            return await anyStore._connection.invoke("Delete", key)
        }
    },
    unSubscribed: (key: string) => {
        if (!anyStore._subscribedKeys[key]) return
        delete anyStore._subscribedKeys[key]
        anyStore.isConnected() && anyStore._connection.invoke("UnSubscribed", key).then(()=>{
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
    _authAction: (action: Function, ...args:any) => {
        if(!anyStore.isConnAuthed()){
            setTimeout(()=>{
                anyStore._authAction(action, args)
            }, 1000)
        }else{
            action(args)
        }
    }
}
export default anyStore
