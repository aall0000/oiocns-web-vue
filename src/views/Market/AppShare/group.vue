<template>
  <div class="unitLayout">
    <div class="tableBtn">
      <div class="tableBtn-title">{{ groupName }}</div>
      <el-button small link type="primary" @click="pullGroupDialog = true">分享集团</el-button>
    </div>
    <DiyTable
      class="diytable"
      ref="diyTable"
      :tableData="tableData"
      :tableHead="tableHead"
      :options="state.options"
      @handleLazyTree="handleLazyTree"
    >
      <template #operate="scope">
        <!-- <el-button link type="danger" size="small" @click="removeFrom(scope.row)"
          >移除单位</el-button
        > -->
      </template>
    </DiyTable>
  </div>
  <searchCompany
    v-if="pullGroupDialog"
    :checkList="tableData"
    :tableData="tableData"
    :id="groupId"
    :selectLimit="0"
    :serachType="6"
    @closeDialog="closeDialog"
    @checksSearch="checksSearch"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import $services from '@/services'
  import searchCompany from './components/index.vue'
  const route = useRoute()
  const router = useRoute()
  const diyTable = ref(null)
  const props = defineProps({
    groupId: String,
    appInfo: String,
    groupName: String
  })
  const tableHead = ref([
    {
      prop: 'name',
      label: '名称',
      name: 'name'
    },
    {
      prop: 'code',
      label: '编码'
    },
    {
      prop: 'team.code',
      label: '简介',
      name: 'teamCode'
    }
  ])
  const state = reactive({
    options: {
      expandAll: false,
      checkBox: true,
      order: false,
      noPage: true
    }
  })
  // 表格用户数据
  let tableData = ref<any>([])
  const pullGroupDialog = ref<boolean>(false)
  onMounted(() => {
    getData()
  })

  const shareGroup = () => {
    console.log(diyTable.value.state.multipleSelection)
  }

  // const selectionChange = (data: any) => {
  //   console.log(data)
  // }

  const handleLazyTree = async (tree: any, callback: any) => {
    $services.company
      .getSubgroups({
        data: { id: tree.id, offset: 0, limit: 10000, filter: '' }
      })
      .then((res: ResultType) => {
        callback(res.data.result)
      })
    // callback(res.data.data)
  }

  const getData = () => {
    $services.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      .then((res: ResultType) => {
        if (res.data.result && res.data.result.length > 0) {
          let obj = res.data.result.find((el: any) => {
            return el.id == props.groupId
          })
          obj.hasChildren = true
          tableData.value.push(obj)
        } else {
          tableData = []
        }
      })
  }
  const closeDialog = () => {
    pullGroupDialog.value = false
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
      pullGroupDialog.value = false
    }
  }
  //分享单位
  const pullCompanys = (arr: any) => {
    $services.company
      .pullCompanys({
        data: {
          id: props.groupId,
          targetIds: arr
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
          getShareHistory()
        }
        pullGroupDialog.value = false
      })
  }
  const getShareHistory = () => {}
</script>

<style lang="scss" scoped>
  .tableBtn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    &-title {
      font-weight: 600;
    }
  }
  .diytable {
    flex: 1;
  }
  .unitLayout {
    width: 100%;
    height: 500px;
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
</style>
