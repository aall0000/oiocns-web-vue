<template>
  <div class="department-tree-wrap">
    <ul class="departmentTree-wrap">
      <li class="con tree-select">
        <el-select
          v-if="envType == 2"
          v-model="selectValue"
          @change="changeGroupIndex"
          class="m-2"
          value-key="id"
          placeholder="Select"
          style="margin-left: 20px; width: 155px"
        >
          <el-option
            v-for="item in selectList.list"
            :key="item.id"
            :label="item.name"
            :value="{ id: item.id, item: item }"
          />
        </el-select>
      </li>
      <li class="con tree-btns" v-if="envType == 1">
        <div class="title">部门管理</div>
        <!-- <el-popover placement="bottom" :width="150" trigger="hover">
          <template #reference>
            <el-icon color="#154ad8" :size="18">
              <View />
            </el-icon>
          </template>
          <el-checkbox v-model="state.isShowName" label="部门名称" />
          <el-checkbox v-model="state.isShowCode" label="部门编码" />
        </el-popover> -->

        <el-icon color="#154ad8" :size="20" @click="showDialog">
          <CirclePlus />
        </el-icon>
        <!-- <el-button :icon="Plus"size="small">新建部门</el-button> -->
      </li>
      <li class="con tree-btns" v-else>
        <div class="title">组织</div>
        <el-button :icon="Plus" @click="dialogVisible = true" size="small">创建下级节点</el-button>
      </li>
      <li class="con tree-search">
        <el-input class="search" placeholder="搜索部门或者工作组">
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
          ref="treeRef"
          @node-click="changeIndexFun"
          :load="loadNode"
        />
      </ul>
      <ul class="con tree-dept" v-else>
        <el-tree
          :props="defaultProps"
          lazy
          highlight-current
          ref="treeRef"
          @node-click="changeIndexFun"
          :load="loadNode"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <div class="tree-box">
                <el-icon>
                  <School />
                </el-icon>
                <span class="tree-box__text">{{ node.label }}</span>
              </div>
            </span>
          </template>
        </el-tree>
      </ul>
      <el-dialog
        v-model="dialogVisible"
        v-if="envType == 1"
        title="请录入部门信息"
        width="50%"
        center
        @close="dialogHide"
      >
        <div class="main-title">部门信息</div>
        <div class="main-dialog">
          <el-form-item class="main-item" label="创建类型" style="width: 100%">
            <el-radio-group v-model="roleType" class="ml-4" >
              <el-radio label="1" size="large">创建子部门</el-radio>
              <el-radio label="2" size="large">创建工作组</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="main-item" label="部门名称" style="width: 45%">
            <el-input v-model="departmentName" placeholder="请输入" width="200px" clearable />
          </el-form-item>
          <el-form-item class="main-item" label="部门编号" style="width: 45%">
            <el-input v-model="departmentTeamCode" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item class="main-item" label="部门简介" style="width: 45%">
            <el-input v-model="departmentTeamRemark" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item class="main-item" label="上级节点">
            <el-cascader :props="upNode" v-model="upNodeId.list" placeholder="请选择" @change="handleChange" />
          </el-form-item>
        </div>
        <div class="main-transfer">
          <div class="main-title">分配人员</div>
          <el-transfer
            v-model="transferList"
            :data="transferData"
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['全部', '选中的']"
          >
          </el-transfer>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogHide">取消</el-button>
            <el-button type="primary" @click="createDepartment">确认</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog v-model="dialogVisible" v-if="envType == 2" title="请输子集团名称" width="30%">
        <el-form-item label="节点名称">
          <el-input v-model="departmentName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="部门编号">
          <el-input v-model="departmentTeamCode" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="部门简介">
          <el-input v-model="departmentTeamRemark" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="上级节点">
          <el-cascader :props="upNode" v-model="upNodeId.list" @change="handleChange" />
        </el-form-item>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="createSubgroupFun">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </ul>

    <div class="weihu-wrap" @click="handlePageChange">
      <span class="weihu-wrap-txt">部门维护</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import $services from '@/services'
  import { Search, Plus } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted, watch } from 'vue'
  import { useUserStore } from '@/store/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { ElTree } from 'element-plus'
  import type Node from 'element-plus/es/components/tree/src/model/node'

  const treeRef = ref<InstanceType<typeof ElTree>>()

  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)
  let dialogVisible = ref<boolean>(false)
  const emit = defineEmits(['changeIndex'])
  type selectItem = {
    name: string
    id: string
  }
  const props = defineProps<{
    envType: number
    selectItem: selectItem
    rootElement: selectItem
  }>()
  const changeIndexFun = (val: any, nodeAttribute?, event?) => {
    emit('changeIndex', val)
    // 清空表单人员分配信息
    transferList.value = []
    // 设置表单上级节点
    if(nodeAttribute){
      let parentIdArr = [];
      const level = nodeAttribute.level;
      for(let i = 0; i<level; i++){
        parentIdArr = [...[nodeAttribute.data.value], ...parentIdArr]
        nodeAttribute = nodeAttribute.parent
      }
      upNodeId.value.list = parentIdArr;
    }
  }
  const state = reactive({
    isShowCode: false,
    isShowName: true,
    isShowUnit: false,
    nodeData: {
      childNodes: [] as []
    },
    resolveData: Function as (data: any) => void
  })
  //获取部门
  onMounted(() => {
    if (props.envType == 1) {
      changeIndexFun(workspaceData.value)
    } else {
      //查询集团
      getGroupList()
    }
  })
  //提交表单数据
  let departmentName = ref<string>('')
  let departmentTeamName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
  const createDepartment = () => {
    let parentId = 0
    if (upNodeId.value.list.length > 0) {
      parentId = upNodeId.value.list[upNodeId.value.list.length - 1]
    }
    if(roleType.value =='1'){
      var requestType ='createDepartment' //创建部门
    }else{
       var requestType ='createJob' //创建工作组
    }
    $services.company[requestType]
      ({
        data: {
          id: workspaceData.value.id,
          code: departmentTeamCode.value,
          name: departmentName.value,
          parentId: parentId,
          teamName: departmentTeamName.value,
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        if(res.code ==200){
          dialogVisible.value = false
          state.nodeData.childNodes = []
          loadNode(state.nodeData, state.resolveData)
          if (transferList.value.length > 0) {
            if(roleType.value =='1'){
               changePreson(res.data.id)
            }else{
              changeJobPreson(res.data.id)
            }
          }
          ElMessage({
            message: res.msg,
            type: 'success'
          })
        }else{
          ElMessage({
              message: res.msg,
              type: 'error'
            })
        }
      })
  }
  //关闭弹窗清空
  const dialogHide = ()=>{
     departmentName.value = ''
     departmentTeamName.value = ''
     departmentTeamCode.value = ''
     departmentTeamRemark.value = ''
     roleType.value='1'
     upNodeId.value.list = []
     dialogVisible.value = false;
  }
  //默认节点类型
  const defaultProps = {
    children: 'children',
    label: 'label',
    isLeaf: 'leaf'
  }
  const loadNode = (node: any, resolve: (data: any) => void) => {
    if (props.envType == 1) {

      if (node.level === 0) {
        state.nodeData = node
        state.resolveData = resolve
        getQueryInfo(resolve)
      }
      if (node.level >= 1) {
        getDepartmentsList(node, resolve)
      }
    } else {
      if (node.level === 0) {
        state.nodeData = node
        state.resolveData = resolve
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
          value:res.data.id,
          children: [] as string[],
          label: res.data.name,
          id: res.data.id,
          remark: res.data.team.remark
        }
      ]
      return resolve(obj)
    })
    await $services.company.getJobs({
      data:{
        id:props.selectItem.id,
        offset:0,
        limit:100
      }
    }).then((res: ResultType) => {
      // let obj = [
      //   {
      //     value:res.data.id,
      //     children: [] as string[],
      //     label: res.data.name,
      //     id: res.data.id,
      //     remark: res.data.team.remark
      //   }
      // ]
      // return resolve(obj)
      console.log('resssss',res)
    })
  }
  async function getDepartmentsList(node: any, resolve: any) {
    let arr: any = []
    await $services.company
      .getDepartments({
        data: { id: node.data.id, offset: 0, limit: 1000 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = JSON.parse(JSON.stringify(res.data.result))

          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              value:element.id,
              label: element.name,
              code: element.code,
              children: [] as [],
              remark: element.team.remark
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
  const handleChange = (value:any) => {
    console.log(value)
  }
  const selectValue = ref<string>(null)
  const selectList = reactive<listItem>({ list: [] })
  const roleType = ref<string>('1')
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
          limit: 1000
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
  const groupIndex = ref<number>(0);
  const showTreeStatus = ref<boolean>(true)
  //切换集团
  const changeGroupIndex = (val: any) => {
    checkGroup.value = val

    for (let i = 0; i < selectList.list.length; i++) {
      if (val.id === selectList.list[i].id) {
        showTreeStatus.value = false

        groupIndex.value = i
        setTimeout(() => {
          showTreeStatus.value = true
        }, 10)
      }
    }
  }
  const upNode = {
    checkStrictly: true,
    lazy: true,
    lazyLoad(node: any, resolve: any) {
      const { level } = node
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
  }
  async function getGroupsInfo(resolve: any) {
    let arr: any = []
    $services.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = [res.data.result[groupIndex.value]]
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              value:element.id,
              label: element.name,
              code: element.code,
              children: [] as []
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
        data: { id: node.data.id, offset: 0, limit: 1000 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = JSON.parse(JSON.stringify(res.data.result))
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              value:element.id,
              label: element.name,
              code: element.code,
              children: [] as [],
              team: element.team,
              type: 'org'
            }
            arr.push(obj)
          })
          // if (level > 1) {
          //   getUnitChildData(node, resolve, arr)
          // } else {
          //   getUnitData(node, resolve, arr)
          // }
        }
        return resolve(arr)
      })
  }
  // 查询子集团单位
  const getUnitChildData = (node: any, resolve: any, arr: Array<any>) => {
    $services.company
      .getSubgroupCompanies({
        data: {
          id: node.data.id,
          offset: 0,
          limit: 1000
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
              team: element.team,
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
          limit: 1000
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
              team: element.team,
              type: 'unit'
            }
            arr.push(obj)
          })
        }
        return resolve(arr)
      })
  }
  const upNodeId = ref<any>({list:[]})
  //创建子集团
  const createSubgroupFun = () => {
    $services.company
      .createSubgroup({
        data: {
          code: departmentTeamCode.value,
          name: departmentName.value,
          parentId: upNodeId.value.list[upNodeId.value.list.length-1],
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: res.msg,
            type: 'success'
          })
          dialogVisible.value = false
          state.nodeData.childNodes = []
          loadNode(state.nodeData, state.resolveData)
        }else{
          ElMessage({
            message: res.msg,
            type: 'error'
          })
        }
      })
  }
  interface Option {
    key: string
    label: string
  }
  const showDialog = () => {
    getPersons()
  }

  const transferData = ref<Option[]>() //总人
  const transferList = ref([]) //选中的人
  //获取单位员工
  const getPersons = () => {
    $services.company
      .getPersons({
        data: {
          id: props.rootElement.id,
          offset: 0,
          limit: 1000
        }
      })
      .then((res: ResultType) => {
        let arr: any = []
        if (res.data.result) {
          res.data.result.forEach((element: any) => {
            let obj = {
              value:element.id,
              key:element.id,
              label: element.name
            }
            arr.push(obj)
          })
        }
        transferData.value = arr
        dialogVisible.value = true
      })
  }
 
  const router = useRouter()
  const handlePageChange = () => {
    router.push({ path: '/organization/deptDeatil' })
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
  .main-dialog {
    display: flex;
    padding: 0 30px;
    flex: 1;
    justify-content: space-between;
    flex-wrap: wrap;
    .main-item :nth-child(2n) {
      padding-left: 5px;
    }
    .main-item{
      :deep(.el-radio.el-radio--large){
        height: 32px;
      }
    }
  }
  .main-title {
    margin-left: 30px;
    font-weight: bold;
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
  }
  .main-transfer {
    margin: 0 auto;
    display: flex;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 20px;
    margin: 0 30px;
    .main-title {
      width: 100%;
    }
    justify-content: center;
    flex-direction: column;
    align-items: center;
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
    .custom-tree-node {
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

        .label {
        }

        .child-label {
          padding-left: 38px;
        }
      }
    }
  }
</style>
