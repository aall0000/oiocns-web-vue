<template>
  <div class="unitLayout">
    <div class="tableBtn">
      <div class="tableBtn-title">{{ route.query.name }}</div>
      <el-button small link type="primary" @click="pullCompanysDialog = true">添加单位</el-button>
    </div>
    <DiyTable class="diytable" ref="diyTable" :tableData="tableData" :tableHead="tableHead">
      <template #operate="scope">
        <!-- <el-button link type="danger" size="small" @click="removeFrom(scope.row)"
          >移除单位</el-button
        > -->
      </template>
    </DiyTable>
  </div>
  <searchCompany
    v-if="pullCompanysDialog"
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
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import $services from '@/services'
  import searchCompany from './components/index.vue'
  const route = useRoute()
  const diyTable = ref(null)
  const groupId = ref<string>('')
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
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      name: 'operate'
    }
  ])
  // 表格用户数据
  let tableData = ref<any>([])
  const pullCompanysDialog = ref<boolean>(false)
  onMounted(() => {
    groupId.value = route.query.id.toString()
    getShareHistory()
  })
  const closeDialog = () => {
    pullCompanysDialog.value = false
  }
  type arrList = {
    id: string
  }
  const checksSearch = (val: any) => {
    console.log('应用id', route.query.appInfo, '集团id', route.query.id, '所选列表', val)
  }
  //分享单位
  const pullCompanys = (arr: any) => {
    $services.company
      .pullCompanys({
        data: {
          id: route.query.id,
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
        pullCompanysDialog.value = false
      })
  }
  const getShareHistory = () => {
    $services.product
      .searchShare({
        data: {
          id: route.query.appInfo,
          teamId: route.query.id,
          offset: 0,
          limit: 10000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
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
    height: 100%;
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
</style>
