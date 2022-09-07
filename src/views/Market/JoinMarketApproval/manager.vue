//加入市场审批
<template>
  <div class="managerApproval">
    <MarketCard> </MarketCard>
    <div class="tabList">
      <DiyTable
        ref="diyTable"
        :hasTitle="false"
        :tableData="state.approvalList"
        :tableHead="state.tableHead"
      >
        <template #operate="scope">
          <el-button @click="approvalSuccess(scope.row.id, 100)" type="primary">审批通过</el-button>
          <el-button @click="approvalSuccess(scope.row.id, 200)" type="danger">驳回申请</el-button>
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
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()
  const diyTable = ref(null)
  const state = reactive({
    approvalList: [],
    tableHead: [
      {
        prop: 'marketName',
        label: '市场名称'
      },
      {
        prop: 'targetName',
        label: '申请人昵称'
      },
      {
        prop: 'targetCode',
        label: '申请人账号'
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
    searchApprovalList()
  })
  const approvalSuccess = async (index: number, status: number) => {
    await $services.appstore
      .approvalJoin({
        data: {
          id: index,
          status: status
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '审批完成',
            type: 'success'
          })
          searchApprovalList()
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  //查询加入市场申请
  const searchApprovalList = async () => {
    await $services.appstore
      .searchJoinApplyManager({
        data: {
          offset: 0,
          limit: 10,

          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log(route.query.marketId)
        if (res.success) {
          const { result = [], total = 0 } = res.data
          state.approvalList = []
          result?.forEach(
            (item: {
              marketId: any
              market: { name: any }
              target: { name: any; code: any; createTime: any }
            }) => {
              if (item.marketId === route.query.marketId) {
                console.log(item.marketId)
                state.approvalList.push({
                  ...item,
                  createTime: item.target.createTime,
                  targetCode: item.target.code,
                  targetName: item.target.name,
                  marketName: item.market.name
                })
              }
            }
          )
          console.log(state.approvalList)
        }
      })
  }
</script>

<style lang="scss" scoped>
  .managerApproval {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .tabList {
      width: 100%;
      height: calc(100vh - 130px);
      padding-left: 16px;
    }
  }
</style>
