<template>
  <div class="deptment-info">
    <div class="deptment-info-btns">
      <div class="tabs">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="全部" name="first"> </el-tab-pane>
        </el-tabs>
      </div>
      <div class="edit">
        <el-link class="link" type="primary" @click="addPresonDialog = true">邀请成员</el-link>
        <el-link class="link" type="primary" @click="showChange">变更部门</el-link>
        <el-link class="link" type="primary" @click="viewApplication">查看申请</el-link>
        <el-link class="link" type="primary" @click="showOutput">操作离职</el-link>
      </div>
    </div>
  </div>
  <div class="list">
    <el-table
      :data="tableData.list"
      stripe
      border
      style="width: 95%; margin: 0 auto"
      height="390"
      :cell-style="{ 'text-align': 'center' }"
      header-row-class-name="table_header_class"
      @select="handleSelect"
    >
      <el-table-column type="selection" />
      <el-table-column prop="code" label="账号" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="trueName" label="姓名" />
      <el-table-column prop="teamCode" label="手机号" />
      <el-table-column prop="remark" label="座右铭" />
      <el-table-column label="操作" width="100" />
    </el-table>
  </div>

  <div class="page-pagination">
    <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
  </div>
  <el-dialog v-model="addPresonDialog" @close='hideAddPreson' title="邀请加入单位" width="30%">
    <el-select
      v-model="inviter"
      filterable
      remote
      reserve-keyword
      placeholder="请输入要查的人"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="item in inviterOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="hideAddPreson">取消</el-button>
        <el-button type="primary" @click="addPreson">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="changeDialog" title="分配部门" width="30%">
    <ul class="con tree-dept">
      <el-tree
        :props="defaultProps"
        node-key="id"
        ref="tree"
        lazy
        highlight-current
        show-checkbox
        :load="loadNode"
        @check="addDepartment"
      />
    </ul>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="changeDialog = false">取消</el-button>
        <el-button type="primary" @click="changePreson">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="outputDialog" title="操作离职" width="30%">
    确认操作其离职嘛？
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="outputDialog = false">取消</el-button>
        <el-button type="primary" @click="outputDepartment">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  let filterHandler = () => {}
  type listType = {
    list?: Array<Object>
  }
  type selectItem = {
    name: string
    id: string
    $treeNodeId?: number
  }
  let tableData = reactive<listType>({})
  const props = defineProps<{
    selectItem: selectItem
    envType: number
    rootElement: selectItem
  }>()
  const activeName = ref('first')
  watch(
    () => props.selectItem,
    (newValue: selectItem) => {
      if (newValue.id !== '') {
        if (props.selectItem && props.rootElement) {
          if (props.selectItem.id === props.rootElement.id) {
            getList(newValue.id)
          } else if(props.selectItem.id !== props.rootElement.id) {
            getDepartmentList(newValue.id)
          }else{
            getJobList(newValue.id)
          }
        }
      }
    }
  )
  //获取单位员工
  const getList = (id: string) => {
    $services.company
      .getPersons({
        data: {
          id: props.selectItem.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        tableData.list = res.data.result?.map(
          (item: { team: { remark: any; code: any; name: any } }) => {
            return {
              ...item,
              remark: item.team.remark,
              teamCode: item.team.code,
              trueName: item.team.name
            }
          }
        )
      })
  }
  //获取部门员工
  const getDepartmentList = (id: string) => {
    $services.company
      .getDepartmentPersons({
        data: {
          id: props.selectItem.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.data) {
          tableData.list = res.data.result
        } else {
          tableData.list = []
        }
      })
  }
  //获取工作组员工
  const getJobList = (id: string) => {
    $services.company
      .getJobPersons({
        data: {
          id: props.selectItem.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.data) {
          tableData.list = res.data.result
        } else {
          tableData.list = []
        }
      })
  }
  interface ListItem {
    value: string
    label: string
  }
  const inviterOptions = ref<ListItem[]>([])
  const inviter = ref('')
  const loading = ref(false)

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  //搜索人
  const remoteMethod = (query: string) => {
    if (query) {
      loading.value = true
      $services.person
        .searchPersons({
          data: {
            text: query,
            offset: 0,
            limit: 10
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            let arr: { value: any; label: any }[] = []
            if (res.data.result != undefined) {
              let states = res.data.result
              states.forEach((el: any) => {
                let obj = {
                  value: el.id,
                  label: el.name
                }
                arr.push(obj)
              })
              inviterOptions.value = arr
              loading.value = false
            } else {
              inviterOptions.value = arr
              loading.value = false
            }
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    } else {
      inviterOptions.value = []
    }
  }

  const addPresonDialog = ref<boolean>(false)
  const hideAddPreson = ()=>{
    inviter.value = ''
    addPresonDialog.value = false
  }
  //邀请加入单位
  const addPreson = () => {
    $services.company
      .pullPerson({
        data: {
          id: props.rootElement.id,
          targetIds: [inviter.value]
        }
      })
      .then((res: ResultType) => {
        if (res.code === 500) {
          ElMessage({
            message: res.msg,
            type: 'error'
          })
        } else {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })

          if (props.selectItem.id === props.rootElement.id) {
            getList(props.selectItem.id)
          } else {
            getDepartmentList(props.selectItem.id)
          }
        }
        inviter.value = ''
        addPresonDialog.value = false
      })
  }
  //选中人员
  let selectArr = reactive<Array<selectItem>>([])
  const handleSelect = (key: Array<selectItem>) => {
    selectArr = key
  }
  const showChange = () => {
    if (selectArr.length > 0) {
      changeDialog.value = true
    } else {
      ElMessage({
        message: '请先选中人员',
        type: 'warning'
      })
    }
  }
  //查看申请
  const viewApplication = () => {
    router.push('/cardDetail')
  }
  //操作离职
  const outputDialog = ref<boolean>(false)
  const showOutput = () => {
    if (selectArr.length > 0) {
      outputDialog.value = true
    } else {
      ElMessage({
        message: '请先选中人员',
        type: 'warning'
      })
    }
  }

  const outputDepartment = () => {
    let targetArr = []
    for (let i = 0; i < selectArr.length; i++) {
      targetArr.push(selectArr[i].id)
    }
    console.log(targetArr)
    console.log(props.rootElement.id)

    $services.company
      .removeFromCompany({
        data: {
          id: props.rootElement.id,
          targetIds: targetArr
        }
      })
      .then((res: ResultType) => {
        console.log(res)
        if (res.code === 500) {
          ElMessage({
            message: res.msg,
            type: 'error'
          })
        } else {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
        }

        outputDialog.value = false
      })
  }
  //变更部门
  const assignId = ref<string>('') //tree选中的部门
  const addDepartment = (nodeObj: any) => {
    assignId.value = nodeObj.id
  }
  const changeDialog = ref<boolean>(false)
  const changePreson = () => {
    $services.company
      .assignDepartment({
        data: {
          id: assignId.value,
          targetIds: [selectArr[0].id]
        }
      })
      .then((res: ResultType) => {
        console.log(res)
        if (res.code === 500) {
          ElMessage({
            message: res.msg,
            type: 'error'
          })
        } else {
          ElMessage({
            message: '分配成功',
            type: 'success'
          })
        }
        if (props.selectItem.id === props.rootElement.id) {
          getList(props.selectItem.id)
        } else {
          getDepartmentList(props.selectItem.id)
        }
        changeDialog.value = false
      })
  }
  const defaultProps = {
    children: 'children',
    label: 'label'
  }
  const loadNode = (node: any, resolve: (data: any) => void) => {
    if (node.level === 0) {
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
</script>
<style lang="scss" scoped>
  .deptment-info {
    background: #fff;
    padding: 10px;

    .group-icon {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }

    .deptment-info-btns {
      width: 95%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
      align-items: center;
      .tabs {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        :deep(.el-tabs__nav-wrap::after) {
          height: 0;
        }
      }

      .edit {
        align-items: center;
        font-size: 14px;
        font-weight: bold;

        .link {
          margin-left: 10px;
        }
      }
    }
  }
  .list {
    background: #fff;
    :deep(.table_header_class) th {
      background-color: #f5f6fb !important;
      color: #000;
      text-align: center;
      font-size: 16px;
      font-weight: 900;
      font-family: '黑体';
    }
  }
  .page-pagination {
    background: #fff;
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 20px;
  }
</style>
