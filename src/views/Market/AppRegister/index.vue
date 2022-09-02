<template>
  <div class="app-register-wrap">
    <div class="page-title register-content"> 应用注册 </div>
    <el-divider />
    <div class="app-base-info register-content">
      <p class="custom-title"><span class="custom-span"></span> 基础信息</p>
      <el-form :model="form" label-position="top" class="demo-form-inline">
        <el-row :gutter="40" justify="space-between">
          <el-col :span="12"
            ><el-form-item label="应用名称">
              <el-input v-model="form.name" placeholder="请设置" /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="应用编码">
              <el-input v-model="form.code" placeholder="请设置" /> </el-form-item
          ></el-col>
        </el-row>
        <!-- <el-row :gutter="40" justify="space-between">
          <el-col :span="12"
            ><el-form-item label="负责人">
              <el-input v-model="form.user" placeholder="请设置" /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="联系方式">
              <el-input v-model="form.user" placeholder="请设置" /> </el-form-item
          ></el-col>
        </el-row> -->
        <!-- <el-form-item label="Activity zone">
          <el-select v-model="form.region" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="privateKey">
          <el-input v-model="form.privateKey" placeholder="请设置" />
        </el-form-item>
        <el-form-item label="应用介绍">
          <el-input
            v-model="form.desc"
            :rows="2"
            type="textarea"
            maxlength="120"
            show-word-limit
            placeholder="请输入应用介绍"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-divider />
    <div class="app-base-info register-content">
      <p class="custom-title"><span class="custom-span"></span> 资源信息</p>

      <SetAppMenu :menus="appMenu.menus" />
    </div>
    <div class="app-base-info register-content">
      <el-button type="primary">取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import SetAppMenu from './setAppMenu.vue'
  import { reactive } from 'vue'

  const form = reactive({
    code: '',
    name: '',
    desc: '',
    privateKey: ''
  })

  const appMenu = reactive({
    menus: [
      {
        caption: form.name ?? '系统名称',
        menuType: 'string',
        link: 'www.baidu.com',
        resource: 'sdhja',
        menus: [
          {
            caption: '子菜单1',
            menuType: 'string',
            link: 'www.baidu.com',
            resource: 'sdhja'
          },
          {
            caption: '子菜单2',
            menuType: 'string',
            link: 'www.baidu.com',
            resource: 'sdhja'
          }
        ]
      }
    ]
  })

  const onSubmit = () => {
    console.log('submit!')
  }
</script>

<style lang="scss" scoped>
  .app-register-wrap {
    height: 100%;
    background: var(--el-bg-color-overlay);
    padding: 20px;
    overflow-y: auto;
    height: calc(100vh - 60px);

    .register-content {
      width: 600px;
      margin: 0 auto;
      :deep(.el-input__wrapper),
      :deep(.el-textarea__inner) {
        background-color: #f3f5fa;
        box-shadow: none;
        border: 1px solid var(--el-input-focus-border-color);
      }
      :deep(.el-textarea .el-input__count) {
        background-color: #f3f5fa;
        box-shadow: none;
      }
    }
    .page-title {
      font-size: 16px;
      text-align: center;
    }

    // 自定义标题
    .custom-title {
      display: flex;
      align-items: center;
      height: 26px;
      font-size: 14px;
      margin-bottom: 10px;

      .custom-span {
        display: inline-block;
        width: 4px;
        height: 60%;
        margin-right: 6px;
        background-color: #3e5ed8;
      }
    }
  }
</style>
