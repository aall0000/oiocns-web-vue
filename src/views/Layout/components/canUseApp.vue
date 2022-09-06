<template>
  <div
    v-for="(item, index) in appList"
    :key="index"
    style="width: 80px; height: 100px; float: left; margin: 10px"
    @click="handleChooseItem(item)"
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <img
        v-if="item.icon"
        :src="item.icon"
        style="width: 40px; height: 40px; border-radius: 50%"
      />
      <span class="appName">{{ item.name }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import img1 from '@/assets/img/group22.png'
  import { onMounted, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  // const appUse = [
  //   {
  //     id: '1',
  //     name: '资产管理',
  //     icon: img1,
  //     path: '/online',
  //     link: 'https://element-plus.gitee.io/zh-CN/component/button.html'
  //   },
  //   {
  //     id: '2',
  //     name: '苹果插件',
  //     icon: img1,
  //     path: '/online',
  //     link: 'https://element-plus.gitee.io/zh-CN/component/icon.html'
  //   },
  //   {
  //     id: '3',
  //     name: '推特服务',
  //     icon: img1,
  //     path: '/online',
  //     link: 'https://element-plus.gitee.io/zh-CN/component/link.html'
  //   },
  //   { id: '4', name: '奥集能', icon: img1, path: '/online', link: 'http://anyinone.com:800/' }
  // ]
  // 展示数据
  const appList = ref<ProductType[]>([])
  const getAppList = async () => {
    appList.value = [
      {
        authority: '所属权',
        belongId: '340896682281668608',
        code: '1234',
        createTime: '2022-08-23 17:22:37.222',
        createUser: '340896682281668608',
        endTime: '2022-08-23 17:22:37.222',
        id: '355039216440315904',
        name: '资产内控',
        source: '创建的',
        status: 1,
        icon: img1,
        thingId: '355039216436121600',
        typeName: 'sen名称',
        updateTime: '2022-08-23 17:22:37.222',
        updateUser: '340896682281668608',
        version: '1'
      },
      {
        authority: '所属权',
        belongId: '340896682281668608',
        code: 'sen001',
        createTime: '2022-09-04 15:11:12.821',
        createUser: '340896682281668608',
        endTime: '2022-09-04 15:11:12.821',
        id: '354282259118952448',
        name: '森应用001',
        source: '创建的',
        status: 1,
        icon: img1,
        thingId: '354282259114758144',
        typeName: 'Web应用',
        updateTime: '2022-09-04 15:11:12.821',
        updateUser: '340896682281668608',
        version: '1'
      }
    ]
    // return
    const { data, success } = await $services.product.searchUsefulProduct({
      data: {
        offset: 0,
        limit: 10,
        filter: ''
      }
    })
    debugger
    if (success) {
      const { result = [], total = 0 } = data
      appList.value = result
      console.log('是是是', result)
    }
  }
  onMounted(() => {
    getAppList()
  })
  const emit = defineEmits(['AppChange'])
  const handleChooseItem = async (app: any) => {
    const { data, success } = await $services.product.searchResource({
      data: {
        id: app.id,
        offset: 0,
        limit: 10,
        filter: ''
      }
    })
    if (success) {
      const { result = [], total = 0 } = data
      if (total === 0) {
        return ElMessage({
          type: 'error',
          message: '该应用资源缺失,请联系管理员'
        })
      }
      // TODO:按照权限判断展示哪个资源
      const { id, name, icon, link = 'http://anyinone.com:800/' } = result[0]
      console.log('资源', icon, result)
      emit('AppChange', { id, name, icon:img1, link, path: '/online', })
    }
    // emit('AppChange', app)
  }
</script>

<style lang="scss" scoped>
  .canUseApp-wrap {
  }
</style>
