<template>
  <div class="organization-wrap">
    <div class="org-head">
      <div class="org-type">群 / 消息 / 组织架构</div>
    </div>
    <div class="main-content">
      <subMenu
        :showMenu="showMenu"
        :personType="personType"
        @personTypeChange="personTypeChange"
      ></subMenu>
      <!-- 单位管理 -->
      <div class="org-content" v-if="showMenu == true">
        <departmentTree
          :selectList="selectList"
          @changeIndex="changeIndex"
          @treeItem="treeItem"
          class="department-tree"
        />
        <div style="flex: 1">
          <departmentDetail :selectId="selectId" />
          <departmentList :selectId="selectId" :personType="personType"></departmentList>
        </div>
      </div>
      <!-- 个人管理 -->
      <div class="org-content" v-else style="flex-direction: column">
        <organizatList :personType="personType"></organizatList>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive } from 'vue'
  import departmentTree from './components/departmentTree.vue'
  import departmentDetail from './components/departmentDetail.vue'
  import departmentList from './components/departmentList.vue'
  import organizatList from './components/organizatList.vue'
  import subMenu from './components/menu.vue'
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

  type selectType = {
    name: string
    id: string
  }
  const selectList = reactive<selectType[]>([])
  let selectId = ref<string>()
  let selectItem = ref<selectType>()
  let showInfo = ref<boolean>(false)
  let personType = ref<string>('1')
  $services.company
    .getJoinedCompany({
      data: {
        id: queryInfo.value.id,
        offset: 0,
        limit: 100
      }
    })
    .then((res: ResultType) => {
      selectList.push(...res.data.result)
      console.log(selectList)
    })
    type treeItem = {
      id:string,
      name:string
    }
  const changeIndex = (obj: treeItem) => {
    selectId.value = obj.id
    getDepPerson(obj.id)
  }
  const personTypeChange = (index: string) => {
    personType.value = index
  }
  const getDepPerson = (id: string) => {
    $services.company
      .getDepartmentPersons({
        data: {
          id: id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        showInfo.value = true
      })
  }
  let departmentName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
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
  .organization-wrap {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    display: flex;
    height: 100%;
  }
  .org-head {
    padding: 20px 20px 10px;
    background: #fff;

    .org-type {
      font-size: 16px;
      color: #8d8d8d;
      margin-bottom: 15px;
    }

    .org-mian {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      display: flex;
      justify-content: space-between;
    }
  }

  .org-content {
    background: #f0f2f5;
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    padding: 15px;

    //左侧组织架构 树
    // .department-tree {
    //   width: 200px;
    //   min-width: 200px;
    // }

    // 右侧列表
    .department-info {
      flex-grow: 1;
    }
  }
</style>
