type TargetModel = {
    id: string,
    name: string,
    code: string,
    typeName: string,
    createTime: string,
    team: TeamModel,
}

type TeamModel = {
    id: string,
    name: string,
    code: string,
    remark: string,
    createTime: string,
}

type OrgTreeModel = {
    id: string,
    label: string,
    children: OrgTreeModel[],
    data: TargetModel
}
