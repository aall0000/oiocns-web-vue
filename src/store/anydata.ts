
/*
    用户附属信息
    workspace 配置信息
    message 已读未读
*/
import { defineStore } from 'pinia'
import anyStore from '@/utils/hubConnection'

type UsingSpace = {
    id: string;
    title: string;
    name: number;
    temps: tempsType[];
}
type tempsType = {
    contain_link: string
    contain_name: string
    h: number
    i: number
    moved: boolean
    type: string
    w: number
    x: number
    y: number
}
// 用户组件数据配置
type UserSpace = {
    id: string;
    height: number;
    width: number;
    url: string;
    name: string;
}
type WorkSpaceType = {
    id?: string;
    name?: string, // 工作空间配置名称 
    content: UsingSpace[], // 组件内容
    user: {
        name: string,
        content: UserSpace[]
    }
}
type messageType = {
    noReadMap: Record<string, Record<string, number>>,
    noReadCount: number
}

export const useAnyData = defineStore({
    id: "userAnyData",
    state: (): { workspace: WorkSpaceType, message: messageType } => {
        return {
            workspace: null,
            message: {

                noReadMap: {},
                noReadCount: 0
            },
        }
    },
    getters: {
        homeComplist: (state) => state.workspace?.content || [], // 首页配置组件
        userComplist: (state) => state.workspace?.user?.content || [], // 用户组件
        noReadMap: (state) => state.message.noReadMap, // 未读数量
        getNoReadCount: (state) =>
            (groupid: string, userid: string) => {
                if (state.message.noReadMap[groupid] && state.message.noReadMap[groupid][userid]) {
                    return state.message.noReadMap[groupid][userid] || 0
                }
                return 0
            },
       
    },
    actions: {
        // getNoReadCount(groupid: string, userid: string) {
        //     if(this.noRead[groupid] && this.noRead[groupid][userid]){
        //         return this.noRead[groupid][userid] || 0
        //     }
        //     return 0
        // },
        // 更新用户组件配置
        updateUserSpace(params: { workspaceId: string, content: UserSpace[] }) {
            console.log('更新用户组件', params.content)
            anyStore.set(`${params.workspaceId}.user.content`,
                {
                    operation: 'replaceAll',
                    data: params.content
                })
            this.workspace.user = this.workspace.user || {}
            this.workspace.user.content = params.content
        },
        // 更新工作空间配置
        updateHomeSpace(params: { workspaceId: string, content: UsingSpace[] }) {
            console.log('更新工作空间配置', params.content)
            anyStore.set(`${params.workspaceId}.content`,
                {
                    operation: 'replaceAll',
                    data: params.content || []
                })
            this.workspace.content = params.content
        },
        // 设置个人空间全部数据
        setWorkspace(data: WorkSpaceType) {
            this.workspace = data || {}
        },
        // 更新已读未读消息数量
        updateMessageNoread({ groupid, userid, count }: { groupid: string, userid: string, count: number }) {
            
            const { noReadMap } = this.message
            const newCount = (noReadMap[groupid] && noReadMap[groupid][userid] || 0) + count
            const  noReadCount = this.message.noReadCount + count
            anyStore.set(`message.noRead.${groupid}.${userid}`,
                {
                    operation: 'replaceAll',
                    data: newCount
                })
            anyStore.set(`message.noReadCount`,
                {
                    operation: 'replaceAll',
                    data: noReadCount
                })
            if (!noReadMap[groupid]) {
                this.message.noReadMap[groupid] = {}
            }
            
            this.message.noReadCount =noReadCount
            this.message.noReadMap[groupid][userid] = newCount
        },
        clearMessageNodread(groupid: string, userid: string) {
            const { noReadMap, noReadCount  } = this.message
            const newnoReadCount = noReadCount - noReadMap[groupid][userid]
            anyStore.delete(`message.noRead.${groupid}.${userid}`)
            anyStore.set(`message.noReadCount`,
                {
                    operation: 'replaceAll',
                    data: newnoReadCount
            })
            if (noReadMap[groupid] && noReadMap[groupid][userid]) {
                this.message.noReadCount = newnoReadCount
                delete this.message.noReadMap[groupid][userid]
            }
        },
        // 初始化未读数量
        setMessageNoRead(data: Record<string, number>) {
            if(data.noread){
                this.message.noReadMap = data.noread
                this.message.noReadCount = data.noReadCount
            }else{
                this.message.noReadMap = data
            }
            console.log("newnoread", data)
        }
    }
})

