<template>
  <el-row class="page-custom-header">
    <!-- 左侧 -->
    <el-col class="" :span="12">
      <img class="logo" src="@/assets/img/avatar.jpg" alt="logo" />
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link" @click="onClickDrop">
          {{ workspaceData?.name || '' }}
          <el-icon>
            <CaretBottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu
            v-infinite-scroll="load"
            infinite-scroll-immediate="false"
            infinite-scroll-distance="1"
            style="max-height: 300px; overflow: auto"
          >
            <el-dropdown-item
              v-for="item in store.userCompanys"
              :key="item.id"
              @click="switchCompany(item)"
              >{{ item.team.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
          <div class="joinBtn">+ 创建企业/单位/组织</div>
        </template>
      </el-dropdown>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="12" class="flex col-right">
      <el-icon :size="18" class="icon1 right-con">
        <Suitcase />
      </el-icon>
      <el-input
        class="right-con"
        v-model="SearchInfo"
        :style="{ width: '200px' }"
        placeholder="请输⼊想搜索的功能"
      >
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
          {{ queryInfo.name
          }}<el-icon>
            <CaretBottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item> 语言切换 </el-dropdown-item>
            <el-dropdown-item>首页配置</el-dropdown-item>
            <el-dropdown-item @click="Setting">信息设置</el-dropdown-item>
            <el-dropdown-item>帮助中心</el-dropdown-item>
            <el-dropdown-item @click="exitLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import $services from '@/services'

const store = useUserStore()
const SearchInfo = ref('')
const router = useRouter()
let current = ref(0)
const { queryInfo } = storeToRefs(store)
const workspaceData = store.workspaceData

const load = () => {
  current.value++
  store.getCompanyList(current.value, workspaceData.id, true)
}
const onClickDrop = () => {
  if (store.userCompanys.length == 0) {
    current.value = 0
    store.getCompanyList(current.value, workspaceData.id, false)
  }
}
const switchCompany = (data: { id: string }) => {
  $services.person
    .changeWorkspace({
      data: {
        id: data.id
      }
    })
    .then((res) => {
      if (res.code == 200) {
        sessionStorage.setItem('TOKEN', res.data.accessToken)
        store.getQueryInfo(res.data.accessToken)
        store.getWorkspaceData(res.data.workspaceId).then(() => {
          location.reload()
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
}
const Setting = () => {
  router.push('/user')
}
const exitLogin = () => {
  sessionStorage.clear()
  store.resetState()
  router.push('/login')
}
</script>

<style lang='scss' scoped>
.joinBtn {
  margin: 10px;
  display: flex;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  text-align: center;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  padding: 10px;

  color: rgba(0, 0, 0, 0.65);
}
.el-dropdown-link {
  cursor: pointer;
}
.page-custom-header {
  height: 60px;
  line-height: 60px;

  .el-col {
    display: flex;
    align-items: center;
  }

  .logo {
    margin-right: 10px;
  }

  .col-right {
    justify-content: flex-end;

    .right-con {
      margin-right: 18px;
    }
  }
}
</style>
