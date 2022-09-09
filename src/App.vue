<template>
  <Suspense>
    <template #default>
      <el-config-provider :locale="locale">
        <div class="pages" @contextmenu.prevent>
          <router-view />
        </div>
      </el-config-provider>
    </template>
    <template #fallback> Loading ... </template>
  </Suspense>
</template>

<script lang="ts">
  // import 'element-plus/theme-chalk/el-loading.css'
  // import 'element-plus/theme-chalk/el-message.css'

  import { defineComponent } from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import zhCn from 'element-plus/lib/locale/lang/zh-cn'

  export default defineComponent({
    components: {
      ElConfigProvider
    },
    setup() {
      return {
        locale: zhCn
      }
    }
  })
</script>

<style lang="scss">

</style>
