<template>
  <div class="department-tree-wrap">
    <ul class="departmentTree-wrap">
      <li class="con tree-btns">
        <div class="title">部门管理</div>
        <el-icon color="#154ad8" :size="20" v-if="selectItem.leaf != true" @click="showDialog">
          <CirclePlus />
        </el-icon>
      </li>
      <li class="con tree-search">
        <el-input class="search" v-model="filterText" placeholder="搜索部门或者工作组">
          <template #suffix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
      </li>

      <ul class="con tree-dept">
        <el-tree
          :props="defaultProps"
          lazy
          highlight-current
          ref="treeRef"
          @node-click="changeIndexFun"
          :load="loadNode"
          :filter-node-method="filterNode"
        />
      </ul>
      <el-dialog
        v-model="dialogVisible"
        title="请录入部门信息"
        width="50%"
        center
        append-to-body
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
          <el-form-item class="main-item" label="上级节点" style="width: 100%">
            <el-cascader :props="upNode" v-model="upNodeId.list" style="width: 100%" placeholder="请选择" @change="handleChange" />
          </el-form-item>
          <el-form-item class="main-item" label="部门简介" style="width: 100%">
            <el-input v-model="departmentTeamRemark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
          </el-form-item>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogHide">取消</el-button>
            <el-button type="primary" @click="createDepartment">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </ul>

    <div class="weihu-wrap" @click="handlePageChange" >
      <span class="weihu-wrap-txt">部门维护</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import $services from '@/services'
  import { Search } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted, watch } from 'vue'
  import { useUserStore } from '@/store/user'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { ElTree } from 'element-plus'
  import type Node from 'element-plus/es/components/tree/src/model/node'

const filterText = ref('')
  const treeRef = ref<InstanceType<typeof ElTree>>()

  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)
  let dialogVisible = ref<boolean>(false)
  const emit = defineEmits(['changeIndex'])
  type selectItem = {
    name: string
    id: string
    leaf:boolean
  }
  const props = defineProps<{
    selectItem: selectItem
    rootElement: selectItem
  }>()
  let parentIdArray:any = []
  let curNodeVal:any = {}
  const changeIndexFun = (val: any, nodeAttribute?:any, event?:any) => {
    emit('changeIndex', val)
    // 设置表单上级节点
    if(nodeAttribute){
      let parentIdArr:any = [];
      const level = nodeAttribute.level;
      for(let i = 0; i<level; i++){
        parentIdArr = [...[nodeAttribute.data.value], ...parentIdArr]
        nodeAttribute = nodeAttribute.parent
      }
      parentIdArray = parentIdArr;
      upNodeId.value.list = parentIdArr;
      // 赋值当前节点
      curNodeVal = val;
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
    changeIndexFun(workspaceData.value)
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

  watch(filterText, (val) => {
    console.log("filterText===========", val)
    treeRef.value!.filter(val)
  })
  // 树节点搜索
  const filterNode = (value: string, data: Tree) => {
    if (!value) return true
    return data.label.includes(value)
  }

  //关闭弹窗清空
  const dialogHide = ()=>{
     departmentName.value = ''
     departmentTeamName.value = ''
     departmentTeamCode.value = ''
     departmentTeamRemark.value = ''
     roleType.value='1'
     upNodeId.value.list = parentIdArray || [];
     dialogVisible.value = false;
  }
  //默认节点类型
  const defaultProps = {
    children: 'children',
    label: 'label',
    isLeaf: 'leaf'
  }
  const loadNode = (node: any, resolve: (data: any) => void) => {
      if (node.level === 0) {
        state.nodeData = node
        state.resolveData = resolve
        getQueryInfo(resolve)
      }
      if (node.level >= 1) {
        getDepartmentsList(node, resolve)
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
  }
  async function getDepartmentsList(node: any, resolve: any) {
    let arr1: any = []
    let arr2 :any =[]
    const list1 = await $services.company
      .getDepartments({
        data: { id: node.data.id, offset: 0, limit: 1000 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = res.data.result
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              value:element.id,
              label: element.name,
              code: element.code,
              children: [] as [],
              remark: element.team.remark
            }

            arr1.push(obj)
          })
        }
        return arr1
      })
    const list2= await $services.company.getJobs({
      data:{
        id:props.selectItem.id,
        offset:0,
        limit:100
      }
    }).then((res: ResultType) => {
        if (res.data) {
         if(res.data.result){
           let resData = res.data.result
            resData.forEach((element: any) => {
              var obj = {
                id: element.id,
                value:element.id,
                label: element.name,
                code: element.code,
                children: [] as [],
                leaf:true,
                remark: element.team.remark
              }

              arr2.push(obj)
            })
         }
        }
        return arr2
      })
    resolve([...list1,...list2])
  }
  const handleChange = (value:any) => {
    console.log(value)
  }
  const roleType = ref<string>('1')

  //上级节点
  const upNode = {
    checkStrictly: true,
    lazy: true,
    lazyLoad(node: any, resolve: any) {
      if (node.level === 0) {
        getQueryInfo(resolve)
      }
      if (node.level >= 1) {
        getDepartmentsList(node, resolve)
      }
    }
  }
  //上级节点id
  const upNodeId = ref<any>({list:[]})

  const showDialog = () => {
    dialogVisible.value = true
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
