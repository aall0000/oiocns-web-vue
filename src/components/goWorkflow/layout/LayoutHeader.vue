<template>
  <div>
    <div class="layout-header">
      <el-menu :default-active="defaultActive" active-text-color="#409eff" class="el-menu-demo" mode="horizontal"
        :ellipsis="false" @select="handleSelect">
        <!-- <el-menu-item index="baseSetting">① 基础信息</el-menu-item> -->
        <!-- <el-menu-item index="formSetting">②③ 审批表单</el-menu-item> -->
        <el-menu-item index="processDesign">流程设计</el-menu-item>
        <!-- <el-menu-item index="proSetting">④ 扩展设置</el-menu-item> -->
      </el-menu>
      <div class="back">
        <el-button size="default" @click="exit">
          <el-icon>
            <Back />
          </el-icon>退出
        </el-button>
        <span>
          <el-icon :size="20" color="#409EFC">
            <Stamp />
          </el-icon>{{design.name}}
        </span>
        <span>
          版本：<el-select v-model="paramObj.currentVersion" class="m-2" placeholder="请选择版本" size="small">
            <el-option
              v-for="item in paramObj.versionList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- {{design.version}} -->
        </span>
      </div>
      <div class="publish">
        <el-button size="default" @click="preview">
          <el-icon>
            <View />
          </el-icon>预览
        </el-button>
        <el-button size="default" type="primary" @click="publish">
          <el-icon>
            <Promotion />
          </el-icon>发布
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    ref,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance,
    reactive,
    toRefs,
    computed,
  } from 'vue';

  export default defineComponent({
    name: 'LayoutHeader',
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;

      const proxy = appContext.config.globalProperties;
      const design = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.design
      });
      const state = reactive({
        defaultActive: 'processDesign',
      });
      const paramObj = reactive({
        currentVersion: proxy.$pinia.state.value.appwfConfig.design.version,
        versionList: proxy.$pinia.state.value.appwfConfig.designList.map((item:any)=>item.version).concat('新增')
      });
      // 切换页签
      const handleSelect = (path: any) => {
        emit('activeChange', path);
      };

      // 退出
      const exit = () => {
        proxy.$confirm('未发布的内容将不会被保存，是否直接退出 ?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          emit('exit', true);
        })
      };
      // 预览
      const preview = () => {
        emit('preview', true);
      };
      // 发布
      const publish = () => {
        emit('publish');
      };

      return {
        design,
        paramObj,
        handleSelect,
        exit,
        preview,
        publish,
        ...toRefs(state),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .layout-header {
    // min-width: 640px;
    position: relative;
    background: white;

    .el-menu {
      top: 0;
      z-index: 999;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .back {
      display: flex;
      position: absolute;
      z-index: 1000;
      top: 10px;
      left: 20px;
      font-size: small;

      span {
        display: flex;
        margin-left: 10px;
        font-size: 14px;
        align-items: center;
      }

    }

    .publish {
      position: absolute;
      top: 15px;
      right: 20px;
      z-index: 1000;

      i {
        margin-right: 6px;
      }
    }

  }
</style>