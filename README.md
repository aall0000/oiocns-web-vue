# ogocns-vue-ts
奥集能平台前端
框架使用Vue 3 + TypeScript + Vite实现
## 目录介绍

```
.
├── build/dist              # 生成压缩包
├── public             # 静态资源，不需要 webpack 处理
└── src
    ├── assets
    │   ├── fonts      # 字体文件
    │   ├── img        #图片
    │   ├── js         # 不经过 npm 或 yarn 下载的第三方依赖包
    │   └── style       # reset 样式，及定义的常量文件等
    ├── components
    │   └── global     # 全局注册组件
    │       └── SvgIcon
    ├── icons          # svg 文件
    │   └── svg
    ├── router         # 路由及拦截器
    ├── services       # 统一的服务接口请求处理
    └── views
        └── home

```
## git规范
● add/feat：新功能
● fix：bug修复
● update：更新
● del：移除文件
● docs：文档改变
● style：代码格式改变
● perf：性能优化
● test：添加测试代码
● revert：撤销上一次的commit
● refactor：某个已有功能重构
● build：构建工具或构建过程的变动
