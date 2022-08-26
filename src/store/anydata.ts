
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
    state: (): { workspace: WorkSpaceType, messageNoReadMap: Record<string, number> } => {
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
        // 更新用户组件配置
        updateUserSpace(params: { workspaceId: string, content: UserSpace[] }) {
            console.log('更新用户组件', params.content)
            anyStore.set(`${params.workspaceId}.user.content`,
            {
                operation: 'replaceAll',
                data: params.content
            })
        },
        // 更新工作空间配置
        updateHomeSpace(params: { workspaceId: string, content: UsingSpace[] }) {
            console.log('更新工作空间配置', params.content)
            anyStore.set(`${params.workspaceId}.content`,
            {
                operation: 'replaceAll',
                data: params.content || []
            })
        },
        // 设置个人空间全部数据
        setWorkspace(data: WorkSpaceType) {
            this.workspace = data
        },
        // 更新已读未读消息数量
        updateMessageNoread(userid: string, count: number) {
            const newCount = (this.messageNoReadMap[userid] || 0) + count
            anyStore.set(`message.noread.${userid}`,
            {
                operation: 'replaceAll',
                data: newCount
            })
        },
        clearMessageNodread(userid: string) {
            anyStore.delete(`message.noread.${userid}`)
        },
        // 初始化未读数量
        setMessageNoRead(data: Record<string, number>) {
            this.messageNoReadMap = data
            console.log("newnoread", data)
        }
    }
})

