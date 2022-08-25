
import * as signalR from '@microsoft/signalr'
import { useUserStore } from '@/store/user'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 消息服务
// 创建链接

type UserOtherDataConnectionType = {
    connection: any, // 链接对象本身
    subscribedKeys: Record<string, ( data: any) => void>, // 订阅的值和回调方法
    start: () => void, // 创建及启动链接
    stop: () => void, // 关闭链接
    subscribed: (key: string, callback: (data: any) => void) => void // 订阅数据
    set: (methodsName: string, data?: any) => Promise<{ state: any; data: any; }> // 更新数据
    delete: (key:string) =>  Promise<{ state: any; data: any; }>, // 删除数据
    unSubscribed: (key: string)=>void // 取消订阅
    _updated: () => void // 订阅时，当数据发生更变时通知，不对外使用
}
const UserOtherDataConnection: UserOtherDataConnectionType = {
    connection: null,
    subscribedKeys: {},
    start: () => { // 不传默认为链接用户属性库
        if(UserOtherDataConnection.connection) return
        // 初始化
        UserOtherDataConnection.connection = new signalR.HubConnectionBuilder().withUrl('anydata/object/hub').withAutomaticReconnect().build()
        UserOtherDataConnection.connection.start().then(() => console.log('链接成功'))
        .catch((error: any) => {
            if (error.toString().includes('请登录')) {
              ElMessage({
                message: '登录失效,请重新登录',
                type: 'warning'
              })
              router.push({ path: '/login' })
            }
            console.log('链接出错', error)
          })// 开启链接

        // 当数据发生变化时，更新本地数据
        UserOtherDataConnection._updated()
        // 监听链接断开
        UserOtherDataConnection.connection.onclose(() => {
            console.log('链接关闭了')
            UserOtherDataConnection.connection=null
        })
    },
    stop:()=>{
        UserOtherDataConnection.connection.stop()
    },
    // 订阅数据 key: 订阅数据的key  callback 数据发生变化时的回调
    subscribed: async (key: string, callback: (data: any) => void) => {
        if (UserOtherDataConnection.subscribedKeys[key] || !UserOtherDataConnection.connection) return  // 如果已订阅 则return
        UserOtherDataConnection.subscribedKeys[key] = callback
        
        const { data, state: success } = await UserOtherDataConnection.connection.invoke("Subscribed", `${useUserStore().queryInfo.id}.${key}`)
        if (success) {
            console.log("已订阅=======",`${useUserStore().queryInfo.id}.${key}`)
            callback.call(callback, data)
        }
    },
    set: async (methodsName: string, setData?: any) => {
        return await UserOtherDataConnection.connection.invoke("Set", `${useUserStore().queryInfo.id}.${methodsName}`, setData)
    },
    delete: async (key: string)=> {
        return await UserOtherDataConnection.connection.invoke("Delete", `${useUserStore().queryInfo.id}.${key}`)
    },
    unSubscribed:(key: string)=> {
        if (!UserOtherDataConnection.subscribedKeys[key]) return
        delete UserOtherDataConnection.subscribedKeys[key]
        UserOtherDataConnection.connection && UserOtherDataConnection.connection.invoke("UnSubscribed", `${useUserStore().queryInfo.id}.${key}`).then(()=>console.log("已取消订阅=======",`${useUserStore().queryInfo.id}.${key}`))
    },
    // 收到数据更新的消息，本地可回调 （私有方法）
    _updated: () => {
        // 当数据发生变化时，更新本地数据
        UserOtherDataConnection.connection.on("Updated", (key: string, data: any) => {
            console.log('数据发生变化了', key, data)
            const callback: (data: any) => void = UserOtherDataConnection.subscribedKeys[key]
            if (callback) {

                callback.call(callback, data)
            }
        })
    }
}
export default UserOtherDataConnection