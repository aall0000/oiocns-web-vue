import services from '@/services';

/* --------------------------------------------公共方法--------------------------------- */

// 获取用户信息
export function getUserInfo() {
  return new Promise((resolve, reject) => {
    services.getuserinfo({
      method: 'post'
    }).then(res => {
      if (res.error_no === '0') {
        resolve(res.result);
      }
    });
  });
}

// 获取URL参数
export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) return decodeURI(r[2]);
  return null;
}

