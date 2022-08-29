<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :before-close="closeDialog"
    :title="title"
    width="60%"
  >
    <el-input v-model="value" @input="remoteMethod" placeholder="请输入" />
    <diytab
      ref="diyTable"
      :hasTableHead="true"
      :tableData="list"
      :options="options"
      @handleUpdate="handleUpdate"
      @selectionChange="selectionChange"
      :tableHead="tableHead"
    >
    </diytab>
    <div class="foot">
      <el-button  @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="checksSearch">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import diytab from '@components/diyTable/index.vue'
  import $services from '@/services'
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { ElMessage } from 'element-plus'

  const dialogVisible = ref<boolean>(true)
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  const emit = defineEmits(['checksSearch', 'closeDialog'])
  const props = defineProps({
    selectLimit: {},
    serachType:{
      type: Number,
      default: '1'
    },//1 人 2群 3单位 4集团
  })
  interface ListItem {
    code: string
    name: string
    trueName: string
    teamCode: string
    remark: string
  }

  const list = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)
  const space = ref<string>()
  const url = ref<string>()
  const title = ref<string>()
  onMounted(() => {
    remoteMethod()
    if (props.selectLimit === 0) {
      options.value.selectLimit = 0
    }
    if (props.serachType == 1) {
      space.value = 'person'
      tableHead.value = tableHead1.value
      url.value = 'searchPersons'
      title.value = '搜索人员'
    } else if (props.serachType == 2) {
      space.value = 'cohort'
      tableHead.value = tableHead2.value
      url.value = 'searchCohorts'
      title.value = '搜索群组'
    } else if (props.serachType == 3) {
      space.value = 'company'
      tableHead.value = tableHead3.value
      url.value = 'searchCompany'
      title.value = '搜索单位'
    } else if (props.serachType == 4) {
      space.value = 'company'
      tableHead.value = tableHead4.value
      url.value = 'searchGroups'
      title.value = '搜索集团'
    } else {
      space.value = 'person'
      tableHead.value = tableHead1.value
      url.value = 'searchPersons'
      title.value = '搜索人员'
    }
  })
  const remoteMethod = () => {
    if (value.value) {
      $services[space.value][url.value]({
        data: {
          filter: value.value,
          offset: (pageStore.currentPage - 1) * pageStore.pageSize,
          limit: pageStore.pageSize
        }
      }).then((res: ResultType) => {
        let arr: any = []

        if (res.code == 200) {
          if (res.data.result != undefined) {
            let states = res.data.result
            if (states) {
              states.forEach((el: any) => {
                let obj = {
                  id: el.id,
                  code: el.code,
                  name: el.name,
                  trueName: el.team.name,
                  teamCode: el.team.code,
                  remark: el.team.remark
                }
                arr.push(obj)
              })
              pageStore.total = res.data.total
              diyTable.value.state.page.total = pageStore.total
            } else {
            }
          }
          list.value = arr
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
        // diyTable.value.state.loading = false
      })
    } else {
      list.value = []
      nextTick(() => {
        console.log(diyTable.value)
        // diyTable.value.state.loading = false
      })
    }
  }

  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    remoteMethod()
  }
  const checkList = reactive<any>([])
  const selectionChange = (val: any) => {
    checkList.value = val
  }
  const checksSearch = () => {
    emit('checksSearch', checkList)
  }

  const closeDialog = () => {
    emit('closeDialog', false)
  }
  const tableHead = ref([])
  const tableHead1 = ref([
    {
      prop: 'code',
      label: '账号',
      width: '100'
    },
    {
      prop: 'name',
      label: '昵称',
      width: '100',
      name: 'name'
    },
    {
      prop: 'trueName',
      label: '姓名',
      width: '150',
      name: 'trueName'
    },
    {
      prop: 'teamCode',
      label: '手机号',
      width: '150',
      name: 'teamCode'
    },
    {
      prop: 'remark',
      label: '座右铭',
      name: 'reamrk'
    }
  ])
  const tableHead2 = ref([
    {
      prop: 'trueName',
      label: '群名称',
      width: '150',
      name: 'trueName'
    },
    {
      prop: 'teamCode',
      label: '群编号',
      width: '150',
      name: 'teamCode'
    },
    {
      prop: 'remark',
      label: '群简介',
      name: 'reamrk'
    }
  ])
  const tableHead3 = ref([
    {
      prop: 'name',
      label: '单位名称',
      width: '200',
      name: 'name'
    },

    {
      prop: 'code',
      label: '统一社会信用代码',
      width: '200',
      name: 'code'
    },
    {
      prop: 'remark',
      label: '单位简介',
      name: 'remark'
    },
  ])
  const tableHead4 = ref([
    {
      prop: 'name',
      label: '单位名称',
      width: '200',
      name: 'name'
    },
    {
      prop: 'remark',
      label: '集团简介',
      name: 'remark'
    },
  ])
  const options = ref<any>({
    checkBox: true,
    order: true,
    selectLimit: 1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
</script>

<style lang="scss" scoped>
  .foot {
    display: flex;
    width: 100%;
    margin-top: 30px;
    justify-content: flex-end;
  }
</style>
