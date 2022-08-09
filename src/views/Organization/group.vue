<template>
<teleport v-if="isShowMenu" to="#menu-teleport-target">
  <div class="subMenu">
  <subMenu
  :showMenu="showMenu"
  :personType="personType"
  @personTypeChange="personTypeChange"
></subMenu>
</div>
</teleport>
  <div class="main-content">
    <!-- 单位管理 -->
    <div class="org-content" v-if="showMenu == true">
      <departmentTree
        @changeIndex="changeIndex"
        :menuIndex="menuIndex"
        class="department-tree"
      />
      <div class="main-dep">
        <departmentDetail :selectItem="selectItem" />
        <departmentList :selectId="selectId" :selectItem="selectItem" :personType="personType"></departmentList>
      </div>
    </div>
    <!-- 个人管理 -->
    <div class="org-content" v-else style="flex-direction: column">
      <organizatList :personType="personType"></organizatList>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, onMounted } from 'vue'
  import departmentTree from './groupComponents/departmentTree.vue'
  import departmentDetail from './groupComponents/departmentDetail.vue'
  import departmentList from './groupComponents/departmentList.vue'
  import organizatList from './groupComponents/organizatList.vue'
  import subMenu from './groupComponents/menu.vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'

  const store = useUserStore()
  const { queryInfo } = storeToRefs(store)
  const { workspaceData } = storeToRefs(store)
  let showMenu = ref<boolean>(true)
  if (workspaceData.value.name != '个人空间') {
    showMenu.value = true
  } else {
    showMenu.value = false
  }
  const isShowMenu = ref<boolean>(false)
  type selectType = {
    name: string
    id: string
  }
  onMounted(()=>{
    isShowMenu.value = true
  })
  // const selectList = reactive<selectType[]>([])
  let selectId = ref<string>()
  let selectItem = ref<selectType>(
    {
      id:'',
      name:''
    }
  )
  let personType = ref<string>('1')
  //获取当前账号的所有单位
  // $services.company
  //   .getJoinedCompany({
  //     data: {
  //       id: queryInfo.value.id,
  //       offset: 0,
  //       limit: 100
  //     }
  //   })
  //   .then((res: ResultType) => {
  //     selectList.push(...res.data.result)
  //     console.log(selectList)
  //   })
  type treeItem = {
    id: string
    name: string
  }
  const menuIndex = ref<string>('1')
  const menuCheck = (index:string)=>{
    menuIndex.value= index;
  }
  const changeIndex = (obj: treeItem) => {
    selectItem.value = obj;
    selectId.value = obj.id
  }
  const personTypeChange = (index: string) => {
    personType.value = index
  }
</script>

<style lang="scss">
  .organization-wrap {
    .el-menu--horizontal > .el-menu-item {
      font-size: 18px;

      &:hover,
      &.is-active {
        background-color: none !important;
        color: $mainColor !important;
      }

      &.is-active {
        border-bottom: 2px solid $mainColor;
      }
    }

    .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
    .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
      background: none !important;
    }
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  :deep(.el-select) {
    width: 100%;
  }
  .subMenu{
    height: 100%;
    width: 100px;
    float: left;
  }
  .main-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 0;
  }

  .org-content {
    background: #f0f2f5;
    padding: 15px;
    float: left;
    width: 100%;
    // overflow-y: scroll;
    //左侧组织架构 树
    .department-tree {
      width: 200px;
      min-width: 200px;
    }
    .main-dep{
      float: left;
      width: calc( 100% - 200px);
    }
    // 右侧列表
    .department-info {
      flex-grow: 1;
    }
  }
</style>
