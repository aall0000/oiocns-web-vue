// declare module '*.vue' {
//   import type { DefineComponent } from 'vue';
//   const component: DefineComponent;
//   export default component;
// }

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
declare module 'vue-grid-layout';
declare module 'qrcode';
declare module '@wcjiang/notify';
declare module 'pako';