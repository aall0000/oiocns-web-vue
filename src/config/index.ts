const BASE_URL =
  process.env.NODE_ENV === 'development' ? '/orginone' : 'http://localhost:8080';

const settings:any = {
  // 请求根路径
  baseUrl: BASE_URL,
  // 是否开启代理，本地需要开，线上环境关闭
  proxyFlag: true,
  // 端口
  port: 8081,
  // 是否开启https
  https: false,
  // 扩展端口
  host: 'localhost',
  // 公共路径
  base: './'
};

export { settings };
