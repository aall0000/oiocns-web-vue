<template>
  <div class="managerApproval">
    <MarketCard> </MarketCard>
    <div class="tabList">
      <DiyTable
        ref="diyTable"
        :hasTitle="false"
        :tableData="state.applyList"
        :tableHead="state.tableHead"
      >
        <template #operate="scope">
          <el-button @click="cancelApply(scope.row.id)" type="primary">取消申请</el-button>
        </template>
      </DiyTable>
      <!-- <el-table :data="state.approvalList" stripe>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="marketName" label="市场名称" />
        <el-table-column prop="targetName" label="申请人昵称" />
        <el-table-column prop="targetCode" label="申请人账号" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="name" label="操作" width="600">
          <template #default="scope">
            <el-button @click="approvalSuccess(scope.row.id, 100)" type="primary"
              >审批通过</el-button
            >
            <el-button @click="approvalSuccess(scope.row.id, 200)" type="danger"
              >驳回申请</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { onMounted, reactive, ref } from 'vue'
  import MarketCard from '@/components/marketCard/index.vue'

  import { ElMessage } from 'element-plus'
  import DiyTable from '@/components/diyTable/index.vue'
  const diyTable = ref(null)
  const state = reactive({
    applyList: [],
    tableHead: [
      {
        prop: 'marketName',
        label: '市场名称'
      },

      {
        prop: 'marketCode',
        label: '市场编码'
      },
      {
        prop: 'createTime',
        label: '创建时间'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '400',
        name: 'operate'
      }
    ]
  })

  onMounted(() => {
    searchApplyList()
  })
  const cancelApply = async (index: number) => {
    await $services.appstore
      .cancelJoin({
        data: {
          id: index
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '取消申请成功',
            type: 'success'
          })
          searchApplyList()
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  //查询加入市场申请
  const searchApplyList = async () => {
    await $services.appstore
      .searchJoinApply({
        data: {
          offset: 0,
          limit: 10,

          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log(res)
        if (res.success) {
          const { result = [], total = 0 } = res.data
          state.applyList = result?.map((item: { market: { name: any; code: any } }) => {
            return {
              ...item,

              marketCode: item.market.code,

              marketName: item.market.name
            }
          })
        }
      })
  }
</script>

<style lang="scss" scoped>
  .managerApproval {
    width: 100%;
    height: 100%;
    // background-color: var(--el-bg-color);
    .tabList {
      width: 100%;
      height: calc(100vh - 120px);
      padding: 16px 16px 0;
    }
  }
</style>
