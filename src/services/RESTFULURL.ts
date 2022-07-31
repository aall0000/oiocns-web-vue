// 这里只保留接口名，不能包含路径
const cohort = '/orginone/organization/cohort'
const person = '/orginone/organization/person'
const company = '/orginone/organization/company'
export default {
  // 人员接口
  person: {
    login: person + '/login', // 登录
    register: person + '/register', // 注册
    queryInfo: person + '/query/info', // 获取用户详细信息
    switchCpmpany: person + '/change/workspace', //切换工作空间
    workspace: person + '/change/workspace',
    friends: person + '/get/friends'
  },
  cohort: {
    join: cohort + '/join', // 加群
    getMyQun: cohort + '/get/joined/cohorts', // 查询加入的群
    getQunPerson: cohort + '/get/persons' // 查询群成员
  },
  company: {
    getJoined: company + '/get/joined/companys'
  }
  //others
}
