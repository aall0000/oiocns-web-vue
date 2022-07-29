
// 这里只保留接口名，不能包含路径
const authGSV = 'auth-service/v/' // 用户服务
const smsGSV = 'sms-service/v/' // 短信服务
const cohort = '/orginone/organization/cohort'
const person = '/orginone/organization/person'
const company = '/orginone/organization/company'
export default {
  // 公共接口
  getUserInfo: authGSV + 'getUserInfo', // 获取登录信息
  getConfirmCode: smsGSV + 'getConfirmCode', // 获取短信信息
  // 人员接口
  person: {
    login: person + '/login', // 登录
    register: person + '/register', // 注册
    info: person + '/query/info', // 注册
    workspace:person + '/change/workspace'
  },
  cohort: {
    join: cohort + '/join' // 加群
  },
  company: {
    getJoined: company+'/get/joined/companys'
  },
  test: '/orginone/organization/cohort/get/authoritys',
  //others
}
