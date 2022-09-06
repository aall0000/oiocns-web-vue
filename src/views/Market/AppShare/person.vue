<template>
  <div class="unitLayout">
    <div class="tableBtn">
      <div class="tableBtn-title">
        <el-radio-group v-model="shareRadio" @change="shareChange" class="ml-4">
          <el-radio label="1" size="large">分享给好友</el-radio>
          <el-radio label="2" size="large">分享给群组</el-radio>
        </el-radio-group>
      </div>
      <el-button v-if="shareRadio === '1'" small link type="primary" @click="pullGroupDialog = true"
        >分享给好友</el-button
      >
      <el-button v-else small link type="primary" @click="pullGroupDialog = true"
        >分享给群组</el-button
      >
    </div>
    <DiyTable class="diytable" ref="diyTable" :tableData="tableData" :tableHead="tableHead">
      <template #operate="scope">
        <el-button link type="danger" size="small" @click="cancelShare(scope.row.id)"
          >取消分享</el-button
        >
      </template>
    </DiyTable>
  </div>
  <searchCompany
    v-if="pullGroupDialog"
    :checkList="tableData"
    :tableData="tableData"
    :id="groupId"
    :selectLimit="0"
    :serachType="shareRadio === '1' ? 8 : 9"
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
  const groupId = ref<string>('')
  const shareRadio = ref('1')
  const props = defineProps({
    groupId: String,
    appInfo: String
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
      prop: 'remark',
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
    groupId.value = props.groupId
    getPersonShareHistory()
  })
  const shareChange = (val: any) => {
    shareRadio.value = val
    if (val === '1') {
      getPersonShareHistory()
    } else {
      getCohortShareHistory()
    }
  }
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
    console.log('应用id', props.appInfo, '集团id', props.groupId, '所选列表', val.value[0].id)
    $services.product
      .GroupShare({
        data: {
          productId: props.appInfo,
          targetIds: [val.value[0].id]
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '分享成功',
            type: 'success'
          })
          getShareHistory()
        }
        pullGroupDialog.value = false
      })
  }
  //取消分享
  const cancelShare = (id: string) => {
    console.log('取消分享', props.appInfo, props.groupId, id)
    $services.product
      .deleteGroupShare({
        data: {
          productId: props.appInfo,
          teamId: props.groupId,
          targetIds: [id]
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '取消分享成功',
            type: 'success'
          })
          getShareHistory()
        }
        pullGroupDialog.value = false
      })
  }

  //
  const getPersonShareHistory = () => {
    $services.product
      .searchShare({
        data: {
          id: props.appInfo,
          teamId: props.groupId,
          offset: 0,
          limit: 10000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log(res.data.result)

        if (res.success) {
          tableData.value = res.data.result ? res.data.result : []
        }
      })
  }
  const getCohortShareHistory = () => {
    $services.product
      .searchGroupShare({
        data: {
          id: props.appInfo,
          teamId: props.groupId,
          offset: 0,
          limit: 10000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log(res.data.result)
        if (res.success) {
          tableData.value = res.data.result ? res.data.result : []
        }
      })
  }
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
