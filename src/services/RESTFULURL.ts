// 这里只保留接口名，不能包含路径
const cohort = '/orginone/organization/cohort'
const person = '/orginone/organization/person'
const company = '/orginone/organization/company'
export default {
  // 人员接口
  person: {
    applyJoin: person + '/apply/join', //申请加好友
    cancelJoin: person + '/cancel/join', //取消/删除申请
    changeWorkspace: person + '/change/workspace', //切换工作空间
    createAPPtoken: person + '/create/app/token', //生成APP访问授权accessToken
    createAuthority: person + '/create/authority', //创建个人职权
    createIdentity: person + '/create/identity', //创建身份标签
    getAllApply: person + '/get/all/apply', //查询我的申请
    getAllApproval: person + '/get/all/approval', //查询我的审批
    getAuthorityIdentities: person + '/get/authority/identitys', //查询职权身份
    getAuthority: person + '/get/authoritys', //查询职权
    getFriends: person + '/get/friends', //查询好友
    getIdentityPersons: person + '/get/identity/persons', //查询身份的人
    getIdentities: person + '/get/identitys', //查询身份
    getSubAuthority: person + '/get/subauthoritys', //查询子职权
    giveIdentity: person + '/give/identity', //给好友身份
    joinRefuse: person + '/join/refuse', //加好友拒绝
    joinSuccess: person + '/join/success', //加好友通过
    login: person + '/login', // 登录
    logout: person + '/logout', //注销
    register: person + '/register', // 注册
    approval: person + '/get/all/approval', // 代办列表
    queryInfo: person + '/query/info', // 查询当前登录人员详细信息
    remove: person + '/remove', //删除好友
    removeIdentity: person + '/remove/identity', //删除好友身份
    searchPersons: person + '/search/persons', //搜索人员
    update: person + '/update' //变更信息
  },
  cohort: {
    applyJoin: cohort + '/apply/join', //申请加群组
    create: cohort + '/create', //创建群组
    join: cohort + '/join', // 加群
    createAuthority: cohort + '/create/authority', //创建群组职权
    createIdentity: cohort + '/create/identity', //创建群身份标签
    delete: cohort + '/delete', //删除群组
    getAuthIdentity: cohort + '/get/authority/identitys', //查询职权身份
    getAuthority: cohort + '/get/authoritys', //查询职权
    getIdentityPerson: cohort + '/get/identity/persons', //查询身份的人
    getIdentities: cohort + '/get/identitys', //查询身份
    getJoinedCohorts: cohort + '/get/joined/cohorts', //查询我加入的群
    getPersons: cohort + '/get/persons', //查询群成员
    getSubAuthorities: cohort + '/get/subauthoritys', //查询子职权
    giveIdentity: cohort + '/give/identity', //给群成员身份
    joinRefuse: cohort + '/join/refuse', //加群组拒绝
    joinSuccess: cohort + '/join/success', //加群组通过
    pullPerson: cohort + '/pull/person', //拉人进群组
    removeIdentity: cohort + '/remove/identity', //移除群成员身份
    removePerson: cohort + '/remove/person', //移除群成员
    searchCohorts: cohort + '/search/cohorts', //搜索群聊
    update: cohort + '/update' //变更群组
  },
  company: {
    applyJoin: company + '/apply/join', //申请加入单位
    applyJoinGroup: company + 'apply/join/group', //申请加入集团
    assignDepartment: company + '/assign/department', //分配部门
    assignJob: company + '/assign/job', //分配岗位
    assignSubgroup: company + '/assign/subgroup', //分配子集团
    create: company + '/create', //创建单位
    createAuthority: company + '/create/authority', //创建组织员工职权
    createDepartment: company + '/create/department', //创建部门
    createGroup: company + '/create/group', //创建集团
    createIdentity: company + '/create/identity', //创建组织员工身份标签
    createJob: company + '/create/job', //创建岗位
    createSubgroup: company + '/create/subgroup', //创建子集团
    companyDelete: company + '/company/delete', //删除单位
    deleteDepartment: company + '/delete/department', //删除部门
    deleteGroup: company + '/delete/group', //删除集团
    deleteJob: company + '/delete/job', //删除岗位
    deleteSubgroup: company + '/delete/subgroup', //删除子集团
    getAuthorityIdentities: company + '/get/authority/identitys', //查询职权身份
    getAuthorities: company + '/get/authoritys', //查询职权
    getDepartmentPersons: company + '/get/department/persons', //查询部门员工
    getDepartments: company + '/get/departments', //查询部门
    getGroupCompanies: company + '/get/group/companys', //查询集团单位
    companyGetGroups: company + 'company/get/groups', //查询集团
    getIdentityPersons: company + '/get/identity/persons', //查询身份的人
    getIdentities: company + '/get/identitys', //查询身份
    getJobPersons: company + '/get/job/persons', //查询岗位员工
    getJobs: company + '/get/jobs', //查询岗位
    getJoinGroupApply: company + '/get/join/group/apply', //查询加入集团申请
    getJoinedCompany: company + '/get/joined/companys', //查询加入的公司
    getPersons: company + '/get/persons', //查询公司员工
    getSubAuthorities: company + '/get/subauthoritys', //查询子职权
    getSubgroupCompanies: company + '/get/subgroup/companys', //查询子集团单位
    getSubgroups: company + '/get/subgroups', //查询子集团
    giveIdentity: company + '/give/identity', //给员工身份
    joinApproval: company + '/join/approval', //加申请审批
    joinRefuse: company + '/join/refuse', //加申请拒绝
    joinSuccess: company + '/join/success', //加申请通过
    pullPerson: company + '/pull/person', //拉人进单位
    queryInfo: company + '/query/info', //查询当前单位详细信息
    removeFromCompany: company + '/remove/from/company', //移除单位成员
    removeFromDepartment: company + '/remove/from/department', //移除部门成员
    removeFromGroup: company + '/remove/from/group', //移除集团成员
    removeFromJob: company + '/remove/from/job', //移除岗位成员
    removeFromSubgroup: company + '/remove/from/subgroup', //移除子集团成员
    removeIdentity: company + '/remove/identity', //移除员工身份
    searchCompany: company + '/search/companys', //搜索单位
    update: company + '/update', //变更单位
    updateDepartment: company + '/update/department', //变更部门
    updateGroup: company + '/update/group', //变更集团
    updateJob: company + '/update/job', //变更岗位
    updateSubGroup: company + '/update/subGroup' //变更子集团
  }
  //others
}
