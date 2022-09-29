import authority from '@/utils/authority'
import API from '@/services'
import { useUserStore } from '@/store/user'
const store = useUserStore()
type TreeData = {
  children: any[]
  data: shareTab
  disabled: boolean
  hasNodes: boolean
  id: string
  label: string
  type: string
}
type Page = {
  currentPage: number
  pageSize: number
}

/*
 *分发分享业务逻辑
 */
export default class Application {
  /*
   *分发分享变量定义
   */
  private appInfo: ProductType
  private opertion: number
  private rootTreeId: string
  private parentIdMap: any = {}
  public cascaderTree: any
  public tabs: shareTab

  constructor(appInfo: ProductType, opertion: number) {
    this.appInfo = appInfo
    this.opertion = opertion
  }
  /**
   * 获取群的树形信息
   * @return 返回群的树形信息
   */
  public async getJoinedCohorts() {
    const { data, success } = await API.cohort.getJoinedCohorts({
      data: { offset: 0, limit: 10000, filter: '' }
    })
    if (!success) {
      return []
    }
    const { result = [], total = 0 } = data
    this.cascaderTree = result
    let obj: any = {
      id: authority.getUserId(),
      name: '我的好友',
      label: '我的好友',
      parentId: '0',
      belongId: authority.getUserId()
    }
    obj.data = obj
    this.cascaderTree.forEach((el: any) => {
      el.label = el.team.name
      el.data = el
      el.disabled = !authority.IsApplicationAdmin([el.id, el.belongId])
    })
    this.cascaderTree.unshift(obj)
    return this.cascaderTree
  }
  /**
   *获取集团树形
   * @param resource 当前选择的资源id
   * @return 返回集团树形
   */
  public async getGroupTree(resource: string) {
    const res = await API.company.getGroupTree({
      data: { id: resource }
    })
    if (!res.success) {
      return
    }
    res.data = this.isGroupAuthAdmin(res.data)
    return res.data
  }

  private isGroupAuthAdmin(node: any) {
    node.disabled = !authority.IsApplicationAdmin([node.data.id, node.data.belongId])
    if (node.children) {
      for (const children of node.children) {
        this.isGroupAuthAdmin(children)
      }
    }
    //判断是否有操作权限
    return node
  }

  /**
   *获取tab数据
   * @return 返回资源或集团的数据
   */
  public async searchResource() {
    if (this.opertion == 1) {
      const { data, success } = await API.product.searchResource({
        data: {
          id: this.appInfo.id,
          offset: 0,
          limit: 1000,
          filter: ''
        }
      })
      if (!success) {
        return
      }
      const { result = [], total = 0 } = data
      this.tabs = result
      return this.tabs
    } else {
      const { data, success } = await API.company.companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      if (!success) {
        return
      }
      const { result = [], total = 0 } = data
      this.tabs = result
      return this.tabs
    }
  }

  /*
   *获取左侧树形
   */
  public async getCompanyTree() {
    const res = await API.company.getCompanyTree({})
    if (!res.success) {
      return
    }
    this.rootTreeId = res.data.data.id
    let orgTree = []
    orgTree.push(res.data)
    this.initIdMap(orgTree)
    this.cascaderTree = this.isAuthAdmin(this.filter(orgTree))
    return this.cascaderTree
  }
  /*
   * 初始化ID和对象映射关系
   */
  private initIdMap = (nodes: any[]) => {
    for (const node of nodes) {
      this.parentIdMap[node.id] = node
      if (node.children) {
        this.initIdMap(node.children)
      }
    }
  }
  /**
   * 树形权限判断
   * @param nodes 过滤出的树形数据
   */
  private isAuthAdmin = (nodes: any) => {
    //判断是否有操作权限
    for (const node of nodes) {
      node.disabled = !authority.IsApplicationAdmin([node.data.id, node.data.belongId])
      if (node.children) {
        this.isAuthAdmin(node.children)
      }
    }
    return nodes
  }
  /*
   * 过滤掉工作组作为表单级联数据
   */
  private filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
    if (this.opertion == 1) {
      nodes = nodes.filter((node) => node.data?.typeName !== '工作组')
    } else {
      nodes = nodes.filter(
        (node) => node.data?.typeName !== '工作组' && node.data?.authAdmin === true
      )
    }
    for (const node of nodes) {
      node.children = this.filter(node.children)
    }
    return nodes
  }

  /**
   *获取历史记录
   *@param radio 当前选中的radio
   *@param resource 当前选中的资源id
   *@param treeData 当前选中的左侧树数据
   *@return 获取历史记录
   */
  public async getHistoryData(radio: string, resource?: string, treeData?: TreeData) {
    let teamId =
      radio == '1'
        ? this.opertion == 1
          ? this.rootTreeId
          : this.opertion == 2
          ? resource
          : store.queryInfo.id
        : treeData.id
    let sourceId = this.opertion == 1 ? resource : this.appInfo.id
    let sourceType = this.opertion == 1 ? '资源' : '产品'
    let destType = radio == '1' ? '组织' : radio == '2' ? '角色' : radio == '3' ? '岗位' : '人员'
    const { data, success } = await API.product.extendQuery({
      data: {
        teamId: teamId,
        sourceId: sourceId,
        sourceType: sourceType,
        destType: destType
      }
    })
    if (!success) {
      return
    }
    const { result = [], total = 0 } = data
    return result
  }

  /**
   *提交radio = 1 时的方法
   *@param departData 提交的数据
   *@param resource 所选择的资源信息
   */
  public async submitAll(departData: any, resource?: string) {
    let departAdd: any[] = []
    let departDel: any[] = []

    departData.forEach((el: any) => {
      if (el.type == 'add') {
        departAdd.push(el.id)
      } else if (el.type == 'del') {
        departDel.push(el.id)
      }
    })
    let teamId =
      this.opertion == 1 ? this.rootTreeId : this.opertion == 2 ? resource : store.queryInfo.id
    let sourceId = this.opertion == 1 ? resource : this.appInfo.id
    let sourceType = this.opertion == 1 ? '资源' : '产品'
    let promise1
    let promise2
    if (departAdd.length > 0) {
      promise1 = API.product.extendCreate({
        data: {
          teamId: teamId,
          sourceId: sourceId,
          destIds: departAdd,
          sourceType: sourceType,
          destType: '组织'
        }
      })
    }
    if (departDel.length > 0) {
      promise2 = API.product.extendDelete({
        data: {
          teamId: teamId,
          sourceId: sourceId,
          destIds: departDel,
          sourceType: sourceType,
          destType: '组织'
        }
      })
    }
    const res = await Promise.all([promise1, promise2])
    return res
  }
  /**
   *提交radio != 1 时的方法
   *@param data 所选中的数据
   *@param switchData 接口所需teamid数据
   *@param destType 区分分发分享的数据
   *@param resource 所选中的资源信息
   */
  public async sumbitSwitch(data: any, switchData: string, destType: string, resource?: string) {
    let addData: any[] = []
    let delData: any[] = []
    data.forEach((el: any) => {
      if (el.type == 'add') {
        addData.push(el.id)
      } else if (el.type == 'del') {
        delData.push(el.id)
      }
    })
    let sourceId = this.opertion == 1 ? resource : this.appInfo.id
    let sourceType = this.opertion == 1 ? '资源' : '产品'
    let promise1
    let promise2
    if (addData.length > 0) {
      promise1 = API.product.extendCreate({
        data: {
          teamId: switchData,
          sourceId: sourceId,
          destIds: addData,
          sourceType: sourceType,
          destType: destType
        }
      })
    }
    if (delData.length > 0) {
      promise2 = API.product.extendDelete({
        data: {
          teamId: switchData,
          sourceId: sourceId,
          destIds: delData,
          sourceType: sourceType,
          destType: destType
        }
      })
    }
    await Promise.all([promise1, promise2])
  }

  /**
   *点击左侧树形获取到的数据
   *按角色
   *@param node 所选中左侧树的数据
   *@param search 搜索内容
   *@return 返回角色中间树形信息
   */
  public async getAuthorityTree(node: any, search?: string) {
    const { data, success } = await API.company.getAuthorityTree({
      data: {
        id: node.id,
        filter: typeof search == 'string' ? search : ''
      }
    })
    if (!success) {
      return
    }
    const tree = this.handleTreeData(data, node.id)
    return tree
  }
  private handleTreeData(node: any, belongId: string) {
    node.disabled = !(node.belongId && node.belongId == belongId)
    if (node.nodes) {
      node.nodes = node.nodes.map((children: any) => {
        return this.handleTreeData(children, belongId)
      })
    }
    //判断是否有操作权限
    return node
  }
  /**
   *点击左侧树形获取到的数据
   *按岗位
   *@param node 所选中左侧树的数据
   *@param search 搜索内容
   *@param page 接口页数信息
   *@return 返回岗位中间树形信息
   */
  public async getIdentities(node: any, page: Page, search: string) {
    const { data, success } = await API.company.getIdentities({
      data: {
        id: node.id,
        limit: page.pageSize,
        offset: this.handleCurrent(page),
        filter: typeof search == 'string' ? search : ''
      }
    })
    if (!success) {
      return
    }
    const { result = [], total = 0 } = data
    result.forEach((item: any) => {
      item.disable = !authority.IsApplicationAdmin([item.belongId, node.data.belongId])
    })
    return result
  }
  private handleCurrent(page: any) {
    return (page.currentPage - 1) * page.pageSize
  }
  /**
   *点击左侧树形获取到的数据
   *按人员
   *@param node 所选中左侧树的数据
   *@param page 接口页数信息
   *@param search 搜索内容
   *@return 返回人员中间树形信息
   */
  public async getPerson(node: any, page: Page, search: string) {
    let action = ''
    let module = ''
    if (this.opertion == 1) {
      module = 'company'
      action = 'getPersons'
      switch (node.data.typeName) {
        case '部门':
          action = 'getDepartmentPersons'
          break
        case '工作组':
          action = 'getJobPersons'
          break
      }
    } else if (this.opertion == 2) {
      module = 'company'
      action = 'getGroupCompanies'
      if (node.TypeName === '子集团') {
        action = 'getSubgroupCompanies'
      }
    } else {
      module = 'person'
      action = 'getFriends'
      if (node.typeName === '群组') {
        module = 'cohort'
        action = 'getPersons'
      }
    }
    const { data, success } = await API[module][action]({
      data: {
        id: node.id,
        limit: page.pageSize,
        offset: this.handleCurrent(page),
        filter: typeof search == 'string' ? search : ''
      }
    })
    if (!success) {
      return
    }
    const { result = [], total = 0 } = data
    return result
  }
}
