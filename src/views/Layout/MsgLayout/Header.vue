<template>

  <el-row class="custom-header">
    <!-- 左侧 -->
    <el-col class="" :span="12">
      <img class="logo" src="@/assets/img/avatar.jpg" alt="logo" />
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          资产云开放协同创新中⼼<el-icon>
            <CaretBottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item> Action 2 </el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item>Action 4</el-dropdown-item>
            <el-dropdown-item>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="12" class="flex col-right">
      <el-icon :size="18" class="icon1 right-con">
        <Suitcase />
      </el-icon>
      <el-input class="right-con" v-model="SearchInfo" :style="{ width: '200px' }" placeholder="请输⼊想搜索的功能">
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
      <el-icon :size="18" class="icon2 right-con">
        <Postcard />
      </el-icon>
      <el-icon :size="18" class="icon3 right-con">
        <School />
      </el-icon>
      <el-icon :size="18" class="icon4 right-con">
        <Grid />
      </el-icon>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <el-icon>
            <User />
          </el-icon>
          资产云开放协同创新中⼼<el-icon>
            <CaretBottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item> 语言切换 </el-dropdown-item>
            <el-dropdown-item @click="home">首页配置</el-dropdown-item>
            <el-dropdown-item @click="setting">信息设置</el-dropdown-item>
            <el-dropdown-item>帮助中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const SearchInfo = ref('')
const router = useRouter()
const setting = () =>{
  router.push("/user")
}
const home = () =>{
  router.push("/home")
}
</script>

<style lang='scss'>
.custom-header {
  height: 60px;
  line-height: 60px;
  border-bottom: 6px solid #eff0f4;
  .el-col {
    display: flex;
    align-items: center;
  }

  .logo {
    margin-right: 10px;
  }

  .col-right {
    justify-content: flex-end;
    .right-con{
      margin-right: 18px;
    }
  }

}
</style>
