<template>
  <div class="card" ref="cardHeight">
    <div class="header">
      <div class="title">{{ props.selectItem.label }}</div>
      <div class="box-btns">
        <div v-if="props.selectItem?.data?.typeName == '集团'">
          <el-button small link type="primary" :disabled=!selectItem?.data?.authAdmin @click="pullCompanysDialog = true"
            >添加单位</el-button
          >
          <el-button small link type="primary" :disabled=!selectItem?.data?.authAdmin @click="viewApplication">查看申请</el-button>
        </div>
        <div
          v-if="
            props.selectItem?.data?.typeName == '子集团' ||
            props.selectItem?.data?.typeName == '工作组'
          "
        >
          <el-button small link type="primary" :disabled=!selectItem?.data?.authAdmin @click="showAssignDialog">分配单位</el-button>
        </div>
      </div>
    </div>

    <div :style="{ height: tabHeight - 30 + 'px' }">
      <div style="width: 100%; height: 100%">
        <DiyTable
          ref="diyTable"
          :hasTableHead="false"
          :tableData="companies"
          @handleUpdate="handleUpdate"
          :tableHead="tableHead"
        >
          <template #operate="scope">
            <el-button
              link
              type="danger"
              size="small"
              :disabled="scope.row.id == selectItem.data?.belongId||(scope.row.id != selectItem.data?.belongId&&!selectItem?.data?.authAdmin)"
              @click="removeFrom(scope.row)"
              >移除单位</el-button
            >
          </template>
        </DiyTable>
      </div>
    </div>
  </div>
  <searchCompany
    v-if="pullCompanysDialog"
    :checkList="companies"
    :selectLimit="0"
    :serachType="3"
    @closeDialog="closeDialog"
    @checksSearch="checksSearch"
  />
  <searchCompany
    v-if="assignDialog"
    :checkList="companies"
    :id="rootGroup.id"
    :selectLimit="0"
    :serachType="6"
    @closeDialog="hideAssignDialog"
    @checksSearch="checksCompanySearch"
  />
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import DiyTable from '@/components/diyTable/index.vue'
  import { onMounted, reactive, ref, watch, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import searchCompany from '@/components/searchs/index.vue'

  const props = defineProps<{
    selectItem: any // 节点数据
    tabHeight:any
  }>()
  const rootGroup = ref<any>({})
  // 表格用户数据
  let companies = ref<any>([])

  const router = useRouter()
  // 表格数据加载状态
  const loading = ref<boolean>(false)
  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  const diyTable = ref(null)

  const tableHead = ref([
    {
      prop: 'name',
      label: '简称',
      name: 'name'
    },
    {
      prop: 'code',
      label: '信用代码'
    },
    {
      prop: 'team.name',
      label: '全称',
      name: 'teamName'
    },
    {
      prop: 'team.code',
      label: '代码'
    },
    {
      prop: 'team.code',
      label: '简介',
      name: 'teamCode'
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      name: 'operate'
    }
  ])

  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getCompanies()
  }

  // 加载单位
  const getCompanies = () => {
    const data = props.selectItem?.data
    if (data) {
      let url = ''
      if (data.typeName == '集团') {
        url = 'getGroupCompanies'
        rootGroup.value = JSON.parse(JSON.stringify(data))
      } else if (data.typeName == '子集团') {
        url = 'getSubgroupCompanies'
      }
      $services.company[url]({
        data: {
          id: props.selectItem.id,
          offset: (pageStore.currentPage - 1) * pageStore.pageSize,
          limit: pageStore.pageSize
        }
      }).then((res: ResultType) => {
        if (res.code == 200 && res.success) {
          companies.value = res.data.result
          pageStore.total = res.data.total
          diyTable.value.state.loading = false
          diyTable.value.state.page.total = pageStore.total
        }
      })
    }
  }
  const pullCompanysDialog = ref<boolean>(false)
  const closeDialog = () => {
    pullCompanysDialog.value = false
  }
  type arrList = {
    id: string
  }
  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<arrList> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      pullCompanys(arr)
    } else {
      pullCompanysDialog.value = false
    }
  }
  const checksCompanySearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<arrList> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      assign(arr)
    } else {
      assignDialog.value = false
    }
  }

  //拉单位进集团
  const pullCompanys = (arr: any) => {
    $services.company
      .pullCompanys({
        data: {
          id: props.selectItem.id,
          targetIds: arr
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
          getCompanies()
        }
        pullCompanysDialog.value = false
      })
  }

  //查看申请
  const viewApplication = (row: any) => {
    router.push({ path: '/cardDetail' ,query: {type: 1,id: props.selectItem.id}})
  }

  // 移除n
  const removeFrom = (row: any) => {
    let url: string
    let title: string
    if (props.selectItem?.data?.typeName == '集团') {
      url = 'removeFromGroup'
      title = `确定把 ${row.name} 从集团移除吗？`
    } else if (props.selectItem?.data?.typeName == '子集团') {
      url = 'removeFromSubgroup'
      title = `确定把 ${row.name} 从子集团移除吗？`
    }
    ElMessageBox.confirm(title, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        $services.company[url]({
          data: {
            id: props.selectItem.id,
            targetIds: [row.id]
          }
        }).then((res: ResultType) => {
          getCompanies()
          if (res.success) {
            ElMessage({
              message: '操作成功',
              type: 'success'
            })
          }
        })
      })
      .catch(() => {
        console.log('移除成功!')
      })
  }

  const assignDialog = ref<boolean>(false)
  const hideAssignDialog = () => {
    assignDialog.value = false
  }

  const showAssignDialog = () => {
    assignDialog.value = true
  }

  // 分配单位到子集团
  const assign = (arr: any) => {
    const companyIds = arr
    const data = { id: props.selectItem.id, targetIds: companyIds }
    $services.company.assignSubgroup({ data }).then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '分配成功',
          type: 'success'
        })
        hideAssignDialog()
      }
      getCompanies()
    })
  }

  const cardHeight = ref(null)
  const tabHeight = ref<number>(100)
  onMounted(() => {
    getCompanies()
    nextTick(() => {
      let headerHeight = cardHeight.value?.clientHeight
      tabHeight.value = headerHeight
    })
  })

  watch(props, () => {
    getCompanies()
    nextTick(() => {
      let headerHeight = cardHeight.value?.clientHeight
      tabHeight.value = headerHeight
    })
  })
  watch(props.tabHeight, () => {
    console.log('props.tabHeight',props.tabHeight)
      let headerHeight = cardHeight.value?.clientHeight
      tabHeight.value = headerHeight
  });

</script>

<style lang="scss" scoped>
  .card {
    height: 100%;
    width: 100%;
    // background-color: #fff;
    padding: 10px 0;

    .header {
      display: flex;

      .title {
        text-align: left;
        font-size: 16px;
        width: 50%;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        font-weight: bold;
      }
      .box-btns {
        text-align: right;
        padding-right: 14px;
        padding-bottom: 10px;
        width: 70%;
      }
    }

    .search {
      width: 50%;
    }
  }
</style>
