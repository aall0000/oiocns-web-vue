<template>
  <div class="header">返回区域</div>

  <div class="deptDetail-wrap">
    <div class="detail-box box">
      <ul class="box-btns flex justify-between">
        <li class="box-btns-title">部门列表</li>
        <li class="box-btns-con">
          <el-button small link type="primary" @click="handleGoback">返回</el-button>
          <!-- <el-button small link type="danger">删除</el-button> -->
          <!-- <el-button small link type="primary" @click="dialogVisible = true">新增</el-button> -->
        </li>
      </ul>
      <el-table
        class="box-table"
        :load="load"
        :data="tableData.list"
        stripe
        row-key="id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
        header-row-class-name="table_header_class"
        @select="handleSelect"
      >
        <el-table-column type="selection" width="50" />

        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="thingId" label="部门编码" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" width="100">
          <template #default="{ row  }">
            <el-popconfirm
              title="确认删除?"
              @confirm="handleDelItem(row)"
              confirm-button-text="确认"
              cancel-button-text="取消"
            >
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button link type="primary" @click="showEdit(row)" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination class="page-pagination" @size-change="(e: any) => handlePaginationChange(e, 'limit')"
        @current-change="(e: any) => handlePaginationChange(e, 'current')" small background
        :page-sizes="[10, 20, 50, 100]" v-model:currentPage="pagination.current" v-model:page-size="pagination.limit"
        layout="总数->, total,prev, pager, next," :total="pageStore.total" /> -->
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="修改部门信息"
    width="50%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div class="main-dialog">
      <el-form-item class="main-item" label="部门名称" style="width: 45%">
        <el-input v-model="fromData.departmentName" placeholder="请输入" width="200px" clearable />
      </el-form-item>
      <el-form-item class="main-item" label="部门编号" style="width: 45%">
        <el-input v-model="fromData.departmentTeamCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item class="main-item" label="上级节点" style="width: 100%">
        <el-cascader
          :props="upNode"
          v-model="upNodeId.list"
          style="width: 100%"
          placeholder="请选择"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item class="main-item" label="部门简介" style="width: 100%">
        <el-input
          v-model="fromData.departmentTeamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createDepartment">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import API from '@/services'
  import { onMounted, reactive, toRefs, ref } from 'vue'
  import { useUserStore } from '@/store/user'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { table } from 'console'
  const store = useUserStore()
  const router = useRouter()
  const { userUnitInfo, workspaceData } = storeToRefs(store)
  type selectItem = {
    name: string
    id: string
    leaf: boolean
  }
  const props = defineProps<{
    selectItem: selectItem
    rootElement: selectItem
  }>()
  // 获取表格数据
  const getTableList = () => {
    API.company
      .getDepartments({
        data: {
          id: userUnitInfo.value.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        let arr:any = []
        if(res.data.result){
          res.data.result.forEach((element:any) => {
            let obj = element;
            obj.hasChildren = true;
            obj.parent= [workspaceData.value.id]
            arr.push(obj)
          });
        }
        tableData.list = [...arr]
          API.company
            .getJobs({
              data: {
                id: userUnitInfo.value.id,
                offset: 0,
                limit: 100
              }
            })
            .then((res: ResultType) => {
              let arr:any =[]
               if(res.data.result){
                 res.data.result.forEach((element:any) => {
                  let obj = element;
                  obj.parent= [workspaceData.value.id]
                  arr.push(obj)
                });
                tableData.list = [...tableData.list, ...arr]
               }  
            })
      })
  }

  // 删除表格信息
  const handleDelItem = async (row: any) => {
    const { success } = await API.company.deleteDepartment({
      data: {
        id: row.id
      }
    })

    if (success) {
      getTableList()
    }
  }
  //弹窗信息
  const fromData = reactive({
    departmentName: '',
    departmentTeamName: '',
    departmentTeamCode: '',
    departmentTeamRemark: ''
  })
  //上级节点id
  const upNodeId = ref<any>({ list: [] })
  // 弹窗显示
  const dialogVisible = ref<boolean>(false)
  //显示弹窗
  
  const showEdit = (row: any) => {
    dialogVisible.value = true
    console.log(row.parent,row.id)

  }
  //关闭弹窗
  const dialogHide = () => {
    dialogVisible.value = false
  }
  const tableData = reactive<any>({ list: [] })
  onMounted(() => {
    getTableList()
  })
  const roleType = ref<string>('1')
  const state = reactive({
    isShowCode: false,
    isShowName: true,
    isShowUnit: false,
    nodeData: {
      childNodes: [] as []
    },
    resolveData: Function as (data: any) => void
  })
  const createDepartment = () => {
    let parentId = 0
    if (upNodeId.value.list.length > 0) {
      parentId = upNodeId.value.list[upNodeId.value.list.length - 1]
    }
    if (roleType.value == '1') {
      let requestType = 'createDepartment' //创建部门
    } else {
      let requestType = 'createJob' //创建工作组
    }
    API.company[requestType]({
      data: {
        id: workspaceData.value.id,
        code: fromData.departmentTeamCode,
        name: fromData.departmentName,
        parentId: parentId,
        teamName: fromData.departmentTeamName,
        teamRemark: fromData.departmentTeamRemark
      }
    }).then((res: ResultType) => {
      if (res.code == 200) {
        dialogVisible.value = false
        state.nodeData.childNodes = []
        loadNode(state.nodeData, state.resolveData)
      } else {
      }
    })
  }
  const loadNode = (node: any, resolve: (data: any) => void) => {
      if (node.level === 0) {
        getQueryInfo(resolve)
      }
      if (node.level >= 1) {
        getDepartmentsList(node, resolve)
      }
  }
  //上级切换
  const handleChange = (value:any) => {
    console.log(value)
  }
  //选中人员
  let selectArr = reactive<Array<any>>([])
  const handleSelect = (key: Array<any>) => {
    console.log('selectArr', selectArr)
  }

  // 提交弹窗表单
  const submitFriends = () => {
    API.company
      .createDepartment({
        data: {
          id: workspaceData.value.id,
          code: fromData.departmentTeamCode,
          name: fromData.departmentName,
          parentId: 0,
          teamName: fromData.departmentTeamName,
          teamRemark: fromData.departmentTeamRemark
        }
      })
      .then(() => {
        getTableList()
        dialogVisible.value = false
      })
  }
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
  //根节点数据
  async function getQueryInfo(resolve: any) {
    await API.company.queryInfo({}).then((res: ResultType) => {
      let obj = [
        {
          value: res.data.id,
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
    let arr2: any = []
    const list1 = await API.company
      .getDepartments({
        data: { id: node.data.id, offset: 0, limit: 1000 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = res.data.result
          resData.forEach((element: any) => {
            let obj = {
              id: element.id,
              value: element.id,
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
    const list2 = await API.company
      .getJobs({
        data: {
          id: props.selectItem.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.data) {
          if (res.data.result) {
            let resData = res.data.result
            resData.forEach((element: any) => {
              let obj = {
                id: element.id,
                value: element.id,
                label: element.name,
                code: element.code,
                children: [] as [],
                leaf: true,
                remark: element.team.remark
              }

              arr2.push(obj)
            })
          }
        }
        return arr2
      })
    resolve([...list1, ...list2])
  }
  // 返回上一页
  const handleGoback = () => {
    router.go(-1)
  }
  //table list
  interface User {
    id: number
    date: string
    name: string
    hasChildren?: boolean
    children?: User[]
  }
  //table
  const load = (row: User, treeNode: unknown, resolve: (date: User[]) => void) => {
    loadList(row,treeNode,resolve)
  }
  const loadList = (row:any,treeNode:any,resolve:any) => {
    console.log('ccccc',treeNode)
    let dataList:any = []
    API.company
      .getDepartments({
        data: {
          id: row.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        let arr:any = []
        if(res.data.result){
          res.data.result.forEach((element:any) => {
            let obj = element;
            obj.hasChildren = true;
            if(!row.parent){
              obj.parent = [row.id];
            }else{
              obj.parent = [...row.parent,row.id];
            }
            arr.push(obj)
          });
         
          dataList = [...arr]
        }
          API.company
            .getJobs({
              data: {
                id: row.id,
                offset: 0,
                limit: 100
              }
            })
          .then((res: ResultType) => {
            let arr:any = []
            if(res.data.result){
              res.data.result.forEach((element:any) => {
                let obj = element;
                if(!row.parent){
                  obj.parent = [row.id];
                }else{
                  obj.parent = [...row.parent,row.id];
                }
                arr.push(obj)
              });
              dataList = [...dataList, ...arr]
            }
            resolve(dataList)
          })
      })
  }
</script>

<style lang="scss" scoped>
  .header {
    padding: 0 14px;
    height: 40px;
    background-color: #fff;
    margin-bottom: 5px;
    line-height: 40px;
  }
  .main-dialog {
    display: flex;
    padding: 0 30px;
    flex: 1;
    justify-content: space-between;
    flex-wrap: wrap;
    .main-item :nth-child(2n) {
      padding-left: 5px;
    }
    .main-item {
      :deep(.el-radio.el-radio--large) {
        height: 32px;
      }
    }
  }
  .deptDetail-wrap {
    flex-grow: 1;
    padding: 14px;
    background-color: #fff;

    .box-btns {
      padding-bottom: 10px;
    }

    .detail-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      .box-table {
        flex-grow: 1;
      }

      .page-pagination {
        padding: 10px 0;
        display: flex;
        justify-content: end;
      }
    }
  }
</style>
