<template>
  <el-row class="page-custom-header">
    <!-- 左侧 -->
    <el-col class="" :span="4">
      <div style="display: flex; align-items: center" @mouseleave="handleClose()">
        <img class="logo" src="@/assets/img/avatar.jpg" alt="logo" />
        <div class="col-box" @click="onClickUnit">
          <div class="col-text">{{ workspaceData?.name || '' }}</div>
          <div class="col-icon"
            ><el-icon
              ><CaretBottom
                :style="
                  btnType
                    ? 'transform: rotate(180deg);transition: all 0.5s;'
                    : 'transform: rotate(0);transition: all 0.5s;'
                " /></el-icon
          ></div>
        </div>
        <div class="select-drop" :style="getDropMenuStyle">
          <div
            class="seletc-drop__box"
            v-for="item in store.userCompanys"
            :key="item.id"
            @click="switchCompany(item)"
          >
            <div class="select-drop__flex">
              <div class="select-item__imgSelect">
                {{ item.team ? item.team.name.slice(0, 1) : item.name.slice(0, 1) }}
              </div>
              <div class="select-item__titleSelect">{{
                item.team ? item.team.name : item.name
              }}</div>
            </div>
          </div>
          <div class="joinBtn" @click="createCompany">+ 创建企业/单位/组织</div>
        </div>
      </div>

      <!-- <el-dropdown trigger="click" placement="bottom-start" ref="dropdown">
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
              >{{ item.team ? item.team.name : item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
          <div class="joinBtn" @click="createCompany">+ 创建企业/单位/组织</div>
        </template>
      </el-dropdown> -->
    </el-col>
    <!-- 右侧 -->
    <el-col :span="12" class="col-center"
      ><el-popover trigger="click" :visible="visible" placement="bottom" :width="950">
        <template #reference>
          <el-input
            ref="searchRef"
            class="right-con"
            v-model="SearchInfo"
            :style="{ width: '100%', height: '40px' }"
            placeholder="请输⼊想搜索的功能"
          >
            <template #prepend>
              <el-button :icon="Search" @click="showSearchInfo" />
            </template>
          </el-input>
        </template>
        <SearchDialog></SearchDialog> </el-popover
    ></el-col>
    <el-col :span="8" class="flex col-right">
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
  <template v-for="item in dialogShow" :key="item.key">
    <CreateUnitDialog
      v-if="item.key == 'unit' && item.value"
      :dialogShow="item"
      @closeDialog="closeDialog"
      @switchCreateCompany="switchCreateCompany"
    ></CreateUnitDialog>
    <SearchDialog
      v-if="item.key == 'search' && item.value"
      :dialogShow="item"
      :search="SearchInfo"
      @closeDialog="closeDialog"
    ></SearchDialog>
  </template>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, reactive, computed } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  import CreateUnitDialog from './createUnitDialog.vue'
  import SearchDialog from './searchDialog.vue'

  const store = useUserStore()
  const SearchInfo = ref('')
  const router = useRouter()
  let current = ref(0)
  const visible = ref(false)
  const showSearch = ref(false)
  const btnType = ref(false)
  const { queryInfo } = storeToRefs(store)
  const workspaceData = store.workspaceData
  const dropdown = ref()

  const getDropMenuStyle = computed(() => {
    if (!btnType.value) {
      return 'height:0px'
    } else {
      let height = store.userCompanys.length < 6 ? store.userCompanys.length : 6
      return store.userCompanys.length ? 'height:' + (height * 45 + 35) + 'px;' : 'height:0px'
    }
  })

  const load = () => {
    current.value++
    store.getCompanyList(current.value, workspaceData.id, true)
  }
  const dialogShow = reactive([
    {
      key: 'unit',
      value: false
    },
    {
      key: 'search',
      value: false
    }
  ])
  const showSearchInfo = () => {
    visible.value = !visible.value
  }
  // const getFocus = () => {
  //   visible.value = true
  // }
  // const getBlur = () => {
  //   if (!showSearch.value) {
  //     visible.value = false
  //   }
  // }
  // const mouseenter = () => {
  //   showSearch.value = true
  // }
  // const mouseleave = () => {
  //   showSearch.value = false
  // }

  const onClickUnit = () => {
    btnType.value = !btnType.value
    if (store.userCompanys.length == 0) {
      current.value = 0
      store.getCompanyList(current.value, workspaceData.id, false)
    }
  }
  const handleClose = () => {
    btnType.value = false
  }
  const createCompany = () => {
    dialogShow.map((el) => {
      if (el.key == 'unit') {
        el.value = true
        dropdown.value.handleClose()
      }
    })
  }
  const closeDialog = (key: string) => {
    dialogShow.map((el) => {
      if (el.key == key) {
        el.value = false
      }
    })
  }
  const onClickDrop = () => {
    if (store.userCompanys.length == 0) {
      current.value = 0
      store.getCompanyList(current.value, workspaceData.id, false)
    }
  }

  const switchCreateCompany = (data: { id: string }) => {
    $services.person
      .changeWorkspace({
        data: {
          id: data.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          sessionStorage.setItem('TOKEN', res.data.accessToken)
          store.getQueryInfo(res.data.accessToken)
          current.value = 0
          store.createUnit(res.data).then(() => {
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
  const switchCompany = (data: { id: string }) => {
    $services.person
      .changeWorkspace({
        data: {
          id: data.id
        }
      })
      .then((res: ResultType) => {
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
    if (store.workspaceData.name === '个人空间') {
      router.push('/user')
    } else {
      router.push('/company')
    }
  }
  const exitLogin = () => {
    sessionStorage.clear()
    store.resetState()
    router.push('/login')
  }
</script>

<style lang="scss" scoped>
  .seletc-drop__box {
    cursor: pointer;
    height: 40px;
    padding-left: 10px;
    &:hover {
      background: rgb(248, 247, 249);
    }
  }
  .select-drop__flex {
    display: flex;
    margin: 10px;
  }
  .select-item__imgSelect {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    background: #154ad8;
    font-size: 15px;
    color: #ffffff;
    line-height: 25px;
    text-align: center;
  }
  .select-item__titleSelect {
    height: 25px;
    line-height: 25px;
    font-size: 16px;
    font-weight: 400;
    margin-right: 12px;
    margin-left: 15px;
  }

  .select-drop {
    width: 400px;
    position: absolute;
    top: 60px;
    left: -20px;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    transition: all 0.5s;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.161);
    border-radius: 0 0 4px 4px;
    z-index: 2;
  }
  .col-box {
    cursor: pointer;
    display: flex;
    .el-icon {
      margin-left: 10px;
    }
  }
  :deep(.el-popover.el-popper) {
    width: 100%;
  }
  .joinBtn {
    margin: 10px;
    display: flex;
    height: 40px;
    background: #ffffff;
    border-radius: 2px;
    border-top: 1px solid #d9d9d9;
    text-align: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    padding: 10px;
    color: rgba(0, 0, 0, 0.65);
    &:hover {
      color: #154ad8;
    }
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
