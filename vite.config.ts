import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
// import styleImport from 'vite-plugin-style-import';
import AutoImport from 'unplugin-auto-import/vite';

import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { settings } from './src/config/index';
// 自动导入element图标
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

export default defineConfig({
  base: settings.base, // 生产环境路径
  plugins: [
    vue(), //按需导入element-plus组件
    AutoImport({
      resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })]
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver({ enabledCollections: 'ep' })]
    }),
    Icons({
      autoInstall: true
    }),

  ],
  resolve: {
    alias: {
      // 配置别名
      '@': path.resolve(__dirname, 'src'),
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      config: path.resolve(__dirname, 'src/config'),
      router: path.resolve(__dirname, 'src/router'),
      utils: path.resolve(__dirname, 'src/utils'),
      views: path.resolve(__dirname, 'src/views'),
      plugins: path.resolve(__dirname, 'src/plugins'),
      store: path.resolve(__dirname, 'src/store')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/style/variable.scss";'
      }
    }
  },
  build: {
    target: 'modules',
    outDir: 'dist', // 指定输出路径
    assetsDir: 'static', // 指定生成静态资源的存放路径
    minify: 'terser', // 混淆器,terser构建后文件体积更小
    sourcemap: false, // 输出.map文件
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true // 生产环境移除debugger
      }
    }
  },
  server: {
    // 是否主动唤醒浏览器
    open: true,
    // 占用端口
    port: settings.port,
    // 是否使用https请求
    https: settings.https,
    // 扩展访问端口
    host: settings.host,
    proxy: settings.proxyFlag
      ? {
          '/orginone': {
            target: 'http://qkbyte.orginone.cn:2001', // 后台接口
            changeOrigin: true, // 是否允许跨域
            // secure: false,                    // 如果是https接口，需要配置这个参数
            // rewrite: (path: any) => path.replace(/^\/api/, '')
          }
        }
      : {}
  }
});
