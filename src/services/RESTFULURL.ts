// 这里只保留接口名，不能包含路径
const cohort = '/orginone/organization/cohort'
const person = '/orginone/organization/person'

export default {
  //公共接口

  // 人员接口
  person: {
    login: person + '/login', // 登录
    register: person + '/register', // 注册
    queryInfo: person + '/query/info', // 获取用户详细信息
    approval:person + '/get/all/approval',// 获取代办列表
    joinRefse:person + '/get/all/approval',// 拒绝加好友
    joinSuccess:person + '/get/all/approval',// 同意加好友
  },
  joinCompanys: '/orginone/organization/company/get/joined/companys', // 获取组织列表
  cohort: {
    join: cohort + '/join' // 加群
  },
  //others
}
