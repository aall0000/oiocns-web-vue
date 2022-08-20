<template>
  <div class="deptment-info">
    <div class="deptment-info-btns">
      <div class="tabs">
        <!-- <div class="tasTitle">单位列表</div> -->
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="单位列表" name="first"> </el-tab-pane>
          <el-tab-pane label="职权" name="second"> </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
  <template v-if="activeName === 'first'">
  <div class="list">
    <el-table
      :data="state.tableData"
      stripe
      border
      style="border: 1px solid #ccc; width: 95%; margin: 0 auto"
      height="390"
      :cell-style="{ 'text-align': 'center' }"
      header-row-class-name="table_header_class"
      @select="handleSelect"
    >
      <el-table-column type="selection" />
      <el-table-column prop="name" label="序号" />
      <el-table-column prop="thingId" label="单位名称" />
      <el-table-column prop="trueName" label="管理员" />
      <el-table-column label="操作" width="100" />
    </el-table>

  </div>

  <div class="page-pagination">
    <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
  </div>
  </template>
  <template v-else-if="activeName === 'second'">
    <section class="container">
      <div class="treebox">
        <div class="treebox-btns">
          <el-button :icon="Plus" @click="changeDialog1" size="small">创建下级节点</el-button>
        </div>
        <div class="treebox-search">
          <el-input class="search" placeholder="搜索部门或者工作组">
            <template #suffix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <el-tree :props="defaultProps" lazy highlight-current ref="treeRef" @node-click="changeIndexFun" :load="loadNode" />
      </div>
    </section>
  </template>
  <AuthorityEditDialog ref="dialog1" />
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, watch, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  import { Search, Plus } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import AuthorityEditDialog from './authorityEditDialog.vue'
  const router = useRouter()
  let filterHandler = () => {}
  type selectItem = {
    id: string
    level: number
    label: string
    code: string
    type: string
    team?: teamType
  }
  type teamType = {
    name: string
    remark: string
    code?: string
  }
  const state = reactive({
    tableData: []
  })
  const props = defineProps<{
    selectItem: selectItem
    envType: number
    rootElement: selectItem
  }>()
  const activeName = ref('first')
  watch(
    () => props.selectItem,
    (newValue: selectItem) => {
      nextTick(() => {
        getOrgList()
      })
    }
  )
  const changeIndexFun = ()=>{
    
  }
  const getOrgList = () => {
    $services.company
      .getGroupCompanies({
        data: {
          id: props.selectItem.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.tableData = res.data.result
        } else {
          state.tableData = []
        }
      })
  }
  const authName = ref<string>('')
  const authCode = ref<string>('')
  const authRemark = ref<string>('')
  const addAuthDiong = ref<boolean>(false)

  interface ListItem {
    value: string
    label: string
  }
  const options = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event, dialog1.value.dialogVisible)
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
            console.log(res.data.result != undefined, res.data.result)
            if (res.data.result != undefined) {
              let states = res.data.result
              states.forEach((el: any) => {
                let obj = {
                  value: el.id,
                  label: el.name
                }
                arr.push(obj)
              })
              options.value = arr
              loading.value = false
            } else {
              options.value = arr
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
      options.value = []
    }
  }
  const presonName = ref<string>('')
  const presonCode = ref<string>('')
  const presonRemark = ref<string>('')
  const addPresonDialog = ref<boolean>(false)
  //邀请加入单位
  const addPreson = () => {
    $services.company
      .pullPerson({
        data: {
          id: props.rootElement.id,
          targetIds: [value.value]
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
            message: '添加成功',
            type: 'success'
          })
        }

        addPresonDialog.value = false
      })
  }
  //选中人员
  let selectArr = reactive<Array<selectItem>>([])
  const handleSelect = (key: Array<selectItem>) => {
    selectArr = key
    console.log('selectArr', selectArr)
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
  const defaultProps = {
    children: 'children',
    label: 'label'
  }
  const loadNode = (node: any, resolve: (data: any) => void) => {
    if (node.level === 0) {
      getCompanyAuthority(resolve)
    }
    if (node.level >= 1) {
      getSubAuthorities(node, resolve)
    }
  }
  const dialog1 = ref()
  const changeDialog1 = () => dialog1.value.changeVisible()
  // 查询公司职权
  async function getCompanyAuthority(resolve: any) {
    await $services.company.getAuthorities({data: {id: props.selectItem.id, offset: 0, limit: 0}}).then((res: ResultType) => {
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
  // 查询子职权
  async function getSubAuthorities(node: any, resolve: any) {
    let arr: any = []
    await $services.company.getSubAuthorities({data: {id: node.data.id, offset: 0, limit: 0}}).then((res: ResultType) => {
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
  section.container {
    width: 100%;
    background-color: #fff;
    padding: 0 30px;
  }
  .treebox {
    min-height: 300px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 500px;
    &-btns {
      margin-bottom: 10px;
    }
    &-search {
      margin-bottom: 10px;
    }
    .el-tree {
      flex: 1;
      overflow-y: scroll;
    }
  }
</style>
