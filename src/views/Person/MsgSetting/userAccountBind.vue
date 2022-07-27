<template>
  <div class="userAccountBind">
    <div class="pageHeader">
      <el-breadcrumb separator="/" class="header">
        <el-breadcrumb-item :to="{ path: '/userMsg' }">己</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/userMsg">信息设置</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/userMsg">账号绑定</a></el-breadcrumb-item>
      </el-breadcrumb>
      <div class="title">账号绑定</div>
    </div>
    <div class="body">
      <Account/>
    </div>
    <div class="bottom">
      <span class="content">Copyright @2021 资产云开放协同创新中心 主办单位：浙江省财政厅</span>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import Account from "../../../components/Personal/Account.vue";
import { reactive, ref } from 'vue'
const formLabelAlign = reactive({
  dd: '',

})
</script>
<style lang="less" scoped  >
.userAccountBind{
  height: calc(100vh - 70px);

  .pageHeader{
    width: 100%;
    height: 70px;
    background-color: #fff;
    .header{
      margin-top: 20px;
      margin-left: 30px;
    }
    .title{
      padding-top: 20px;
      margin-left: 30px;
      font-size: 20px;
      font-weight: 600;
    }
  }
  .body{
    height: 600px;
    width: 100%;
    border-left: 10px solid #eff0f4 ;
    border-top: 16px solid #eff0f4 ;
    border-right: 16px solid #eff0f4 ;
    display: flex;

  }
  .bottom{
    height: calc(100vh - 760px);
    background-color: #eff0f4;
    display: flex;
    .content{
      margin: auto;
      color: #aaa;
    }
  }
}
</style>
