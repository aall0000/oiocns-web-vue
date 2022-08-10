<template>
  <div class="main-content">
    <!-- 单位管理 -->
    <div class="org-content" v-if="showMenu == true">
      <departmentTree
        :envType="envType"
        @changeIndex="changeIndex"
        class="department-tree"
      />
      <div class="main-dep">
        <departmentDetail :envType="envType" :selectItem="selectItem"  />
        <departmentList :envType="envType" :selectId="selectId" :selectItem="selectItem" :personType="personType"></departmentList>
      </div>
    </div>
    <!-- 个人管理 -->
    <div class="org-content" v-else style="flex-direction: column">
      <organizatList :personType="personType"></organizatList>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted,watch} from 'vue'
  import departmentTree from './components/departmentTree.vue'
  import departmentDetail from './components/departmentDetail.vue'
  import departmentList from './components/departmentList.vue'
  import organizatList from './components/organizatList.vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  import {useRouter } from 'vue-router';

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
  onMounted(() => {
    isShowMenu.value = true
   
  })
  let router = useRouter();
  let envType= ref<number>(1);

  watch(() =>router.currentRoute.value.path,(newValue,oldValue)=> {
    if(router.currentRoute.value.path =='/organization/company'){
      envType.value = 1; //1-单位 2-集团
    }else{
      envType.value = 2; //1-单位 2-集团
    }
  },{ immediate: true })
  // const selectList = reactive<selectType[]>([])
  
  let selectId = ref<string>()
  let selectItem = ref<selectType>({
    id: '',
    name: ''
  })
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
  // const menuIndex = ref<string>('1')
  // const menuCheck = (index:string)=>{
  //   menuIndex.value= index;
  // }
  const changeIndex = (obj: treeItem) => {
    selectItem.value = obj
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
  .subMenu {
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
    .main-dep {
      float: left;
      width: calc(100% - 200px);
    }
    // 右侧列表
    .department-info {
      flex-grow: 1;
    }
  }
</style>
