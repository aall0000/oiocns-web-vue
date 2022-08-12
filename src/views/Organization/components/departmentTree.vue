<template>
  <div class="department-tree-wrap">
    <ul class="departmentTree-wrap">
      <li class="con tree-select">
        <el-select v-if="envType == 2" v-model="selectValue" @change="changeGroupIndex" class="m-2" value-key="id"
          placeholder="Select" style="margin-left: 20px; width: 155px">
          <el-option v-for="item in selectList.list" :key="item.id" :label="item.name"
            :value="{ id: item.id, item: item }" />
        </el-select>
      </li>
      <li class="con tree-btns" v-if="envType == 1">
        <div class="title">部门管理</div>
        <el-popover placement="bottom" :width="150" trigger="hover">
          <template #reference>
            <el-icon color="#154ad8" :size="18">
              <View />
            </el-icon>
          </template>
          <el-checkbox v-model="state.isShowName" label="部门名称" />
          <el-checkbox v-model="state.isShowCode" label="部门编码" />
        </el-popover>

        <el-icon color="#154ad8" :size="20" @click="dialogVisible = true">
          <CirclePlus />
        </el-icon>
        <!-- <el-button :icon="Plus"size="small">新建部门</el-button> -->
      </li>
      <li class="con tree-btns" v-else>
        <div class="title">组织</div>
        <el-button :icon="Plus" @click="dialogVisible = true" size="small">创建下级节点</el-button>
      </li>
      <li class="con tree-search">
        <el-input class="search" placeholder="搜索姓名、手机、邮箱">
          <template #suffix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
      </li>

    <ul class="con tree-dept" v-if="envType == 1">
      <el-tree
        :props="defaultProps"
        lazy
        highlight-current
        ref="TreeDom"
        @node-click="changeIndexFun"
        :load="loadNode"
      />
    </ul>
    <ul class="con tree-dept" v-else>
      <el-tree
        :props="defaultProps"
        lazy
        highlight-current
        @node-click="changeIndexFun"
        :load="loadNode"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <div class="tree-box">
              <el-icon v-if="data.type == 'org'"><School /></el-icon>
              <el-icon v-else><OfficeBuilding /></el-icon>
              <span class="tree-box__text" @click="a(node, data)">{{ node.label }}</span>
            </div>
          </span>
        </template>
      </el-tree>
    </ul>
    <el-dialog v-model="dialogVisible" v-if="envType == 1" title="请输入部门名称" width="30%">
      <el-form-item label="部门名称">
        <el-input v-model="departmentName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input v-model="departmentTeamCode" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门简介">
        <el-input v-model="departmentTeamRemark" placeholder="Please input" clearable />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFriends">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible" v-if="envType == 2" title="请输子集团名称" width="30%">
      <el-form-item label="节点名称">
        <el-input v-model="departmentName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input v-model="departmentTeamCode" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门简介">
        <el-input v-model="departmentTeamRemark" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="上级节点">
        <el-cascader :props="upNode" v-model="upNodeId" />
      </el-form-item>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="createSubgroupFun">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </ul>
</template>

<script lang="ts" setup>
import $services from '@/services'
import { Search, Plus } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage, ElMessageBox } from 'element-plus'

  import { storeToRefs } from 'pinia'
  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)
  let dialogVisible = ref<boolean>(false)
  const emit = defineEmits(['changeIndex'])
  const props = defineProps<{
    envType: number
  }>()
  const changeIndexFun = (val: any) => {
    console.log('val', val)
    emit('changeIndex', val)
  }
  const a = (node: any, data: any) => {
    console.log('333', node, data)
  }
  //获取部门
  onMounted(() => {
    if (props.envType == 1) {
      changeIndexFun(workspaceData.value)
    } else {
      //查询集团
      getGroupList()
    }
  })
  let departmentName = ref<string>('')
  let departmentTeamName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
  const submitFriends = () => {
    $services.company
      .createDepartment({
        data: {
          id: workspaceData.value.id,
          code: departmentTeamCode.value,
          name: departmentName.value,
          parentId: 0,
          teamName: departmentTeamName.value,
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        dialogVisible.value = false
      })
  }
  const defaultProps = {
    children: 'children',
    label: 'label',
    isLeaf: 'leaf'
  }
  const loadNode = (node: any, resolve: (data: any) => void) => {
    if (props.envType == 1) {
      if (node.level === 0) {
        getQueryInfo(resolve)
      }
      if (node.level >= 1) {
        getDepartmentsList(node, resolve)
      }
    } else {
      if (node.level === 0) {
        getGroupsInfo(resolve)
      }
      if (node.level >= 1) {
        getSubGroups(node, resolve)
      }
    }
  }
  //根节点数据
  async function getQueryInfo(resolve: any) {
    await $services.company.queryInfo({}).then((res: ResultType) => {
      let obj = [
        {
          children: [] as string[],
          label: res.data.name,
          id: res.data.id
        }
      ]
      return resolve(obj)
    })
  }
  async function getDepartmentsList(node: any, resolve: any) {
    let arr: any = []
    await $services.company
      .getDepartments({
        data: { id: node.data.id, offset: 0, limit: 100 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = JSON.parse(JSON.stringify(res.data.result))

        resData.forEach((element: any) => {
          var obj = {
            id: element.id,
            label: element.name,
            code: element.code,
            children: [] as []
          }

            arr.push(JSON.parse(JSON.stringify(obj)))
          })
        }
        return resolve(arr)
      })
  }
  type listItem = {
    list: any
  }
  const selectValue = ref<string>(null)
  const selectList = reactive<listItem>({ list: [] })
  //当前选中的集团
  type groupType = {
    id?: string
    name?: string
    children?: Array<any>
  }
  const checkGroup = ref<groupType>({})
  // 查询集团
  const getGroupList = () => {
    $services.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          selectList.list = res.data.result
        } else {
          selectList.list = []
        }
      })
  }
  //切换集团
  const changeGroupIndex = (val: object) => {
    checkGroup.value = val
  }
  const upNode = {
    checkStrictly: true,
    lazy: true,
    lazyLoad(node: any, resolve: any) {
      const { level } = node
      if (node.level === 0) {
        getGroupsInfo(resolve)
      }
      if (node.level >= 1) {
        getSubGroups(node, resolve)
      }
    }
  }
  async function getGroupsInfo(resolve: any) {
    let arr: any = []
    $services.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = [res.data.result[0]]
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              label: element.name,
              code: element.code,
              children: [] as [],
              value: element.id
            }
            arr.push(obj)
          })
        }
        return resolve(arr)
      })
  }
  async function getSubGroups(node: any, resolve: any) {
    let arr: any = []
    let level = node.level
    await $services.company
      .getSubgroups({
        data: { id: node.data.id, offset: 0, limit: 100 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = JSON.parse(JSON.stringify(res.data.result))
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              label: element.name,
              code: element.code,
              value: element.id,
              children: [] as [],
              type: 'org'
            }
            arr.push(obj)
          })
          if (level > 1) {
            getUnitChildData(node, resolve, arr)
          } else {
            getUnitData(node, resolve, arr)
          }
        } else {
          return resolve([])
        }
        // return resolve(arr)
      })
  }
  // 查询子集团单位
  const getUnitChildData = (node: any, resolve: any, arr: Array<any>) => {
    $services.company
      .getSubgroupCompanies({
        data: {
          id: node.data.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = [res.data.result[0]]
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              label: element.name,
              code: element.code,
              children: [] as [],
              value: element.id,
              leaf: true,
              type: 'unit'
            }
            arr.push(obj)
          })
        }
        return resolve(arr)
      })
  }

  // 查询集团单位
  const getUnitData = (node: any, resolve: any, arr: Array<any>) => {
    $services.company
      .getGroupCompanies({
        data: {
          id: node.data.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = [res.data.result[0]]
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              label: element.name,
              code: element.code,
              children: [] as [],
              value: element.id,
              leaf: true,
              type: 'unit'
            }
            arr.push(obj)
          })
        }
        return resolve(arr)
      })
  }
  const upNodeId = ref<any>([])
  //创建子集团
  const createSubgroupFun = () => {
    $services.company
      .createSubgroup({
        data: {
          code: departmentTeamCode.value,
          name: departmentName.value,
          parentId: upNodeId.value[0],
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        if (res.data.code == 200) {
          ElMessage({
            message: res.msg,
            type: 'success'
          })
        }
      })
  }
</script>
<style lang="scss">
.departmentTree-wrap .tree-search {
  .search {
    .el-input__inner {
      font-size: 12px;
    }
  }
}
</style>
<style lang="scss" scoped>
.main-dialog{
  display: flex;
  padding: 0 30px;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  .main-item :nth-child(2n){
    padding-left: 5px;
  }
}
.department-tree-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  float: left;
  height: 100%;
  .weihu-wrap {
    text-align: center;
    padding: 8px 10px 12px;
    background-color: #fff;
    border-top: 1px solid #ccc;

    &-txt {
      color: $mainColor;
      font-size: 16px;
    }
  }
  .custom-tree-node{
    overflow: hidden;
    text-overflow: ellipsis;
    word-spacing: nowrap;
  }
}

  .tree-box {
    display: flex;
    align-items: center;
    &__text {
      margin-left: 5px;
    }
  }
.departmentTree-wrap {
  padding: 20px 0;
  background-color: #fff;
  border-right: 1px solid #e8e8e8;

  height: 100%;

  .con {
    margin-bottom: 10px;
  }

  .tree-search {
    padding: 0 24px;

    .search {
      .el-input__inner {
        font-size: 12px;
      }
    }
  }

  .tree-btns {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;

      .el-button--small {
        padding: 12px 6px;
      }
    }

  .tree-dept {
    // padding: 0 0 0 14px;

    .tree-dept-item {
      .dept-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        font-size: 14px;
        padding-left: 24px;

        &-icon {
          width: 14px;
          height: 14px;
        }

        .dept-label-name {
          display: flex;
          align-items: center;
        }

        .dept-label-icon {
          margin-right: 4px;
        }

        &.active {
          .dept-label-name {
            color: $mainColor;
          }

          background-color: #e7ecfb;
          border-right: 2px solid $mainColor;
          // transform: translateX(1px);
        }

        .right-icon {
          margin-right: 10px;
        }
      }

      .label {}

      .child-label {
        padding-left: 38px;
      }
    }
  }
}
</style>
