// 这里只保留接口名，不能包含路径
const cohort = '/orginone/organization/cohort'
const person = '/orginone/organization/person'

export default {
  //公共接口

  // 人员接口
  person: {
    login: person + '/login', // 登录
    register: person + '/register', // 注册
    queryInfo: person + '/query/info' // 获取用户详细信息
  },
  joinCompanys: '/orginone/organization/company/get/joined/companys', // 获取组织列表
  cohort: {
    join: cohort + '/join' // 加群
  },
<<<<<<< HEAD
  test: '/orginone/organization/cohort/get/authoritys'
=======
>>>>>>> df6c735861fc5960a1ac8853dac0ffec0c50c125
  //others
}
