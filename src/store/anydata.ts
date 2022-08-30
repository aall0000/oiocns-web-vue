
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

export const useAnyData = defineStore({
    id: "userAnyData",
    state: (): { workspace: WorkSpaceType, messageNoReadMap: Record<string, Record<string, number>> } => {
        return {
            workspace: null,
            messageNoReadMap: {}
        }
    },
    getters: {
        homeComplist: (state) => state.workspace?.content || [], // 首页配置组件
        userComplist: (state) => state.workspace?.user?.content || [], // 用户组件
        noReadMap: (state) => state.messageNoReadMap // 未读数量
    },
    actions: {
        getNoReadCount(groupid: string, userid: string) {
            if(this.messageNoReadMap[groupid] && this.messageNoReadMap[groupid][userid]){
                return this.messageNoReadMap[groupid][userid] || 0
            }
            return 0
        },
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
            this.workspace = data ||{}
        },
        // 更新已读未读消息数量
        updateMessageNoread({ groupid, userid, count }: { groupid: string, userid: string, count: number }) {

            const newCount = (this.messageNoReadMap[groupid] && this.messageNoReadMap[groupid][userid] || 0) + count
            anyStore.set(`message.noread.${groupid}.${userid}`,
                {
                    operation: 'replaceAll',
                    data: newCount
                })

            if (!this.messageNoReadMap[groupid]) {
                this.messageNoReadMap[groupid] = {}
            }

            this.messageNoReadMap[groupid][userid] = newCount
        },
        clearMessageNodread(groupid: string, userid: string) {
            anyStore.delete(`message.noread.${groupid}.${userid}`)
            if (this.messageNoReadMap[groupid] && this.messageNoReadMap[groupid][userid]) {

                delete this.messageNoReadMap[groupid][userid]
            }
        },
        // 初始化未读数量
        setMessageNoRead(data: Record<string, number>) {
            this.messageNoReadMap = data
            console.log("newnoread", data)
        }
    }
})

