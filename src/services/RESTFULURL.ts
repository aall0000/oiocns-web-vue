// 这里只保留接口名，不能包含路径
const authGSV = 'auth-service/v/' // 用户服务
const smsGSV = 'sms-service/v/' // 短信服务

export default {
  // 公共接口
  getUserInfo: authGSV + 'getUserInfo', // 获取登录信息
  getConfirmCode: smsGSV + 'getConfirmCode', // 获取短信信息
  test: '/orginone/organization/cohort/get/authoritys'
  //others
}
