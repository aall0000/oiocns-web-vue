// 这里只保留接口名，不能包含路径
const cohort = '/orginone/organization/cohort'
const person = '/orginone/organization/person'

export default {
  //公共接口

  // 人员接口
  person: {
    login: person + '/login', // 登录
    register: person + '/register' // 注册
  },
  cohort: {
    join: cohort + '/join' // 加群
  },
  //others
}
