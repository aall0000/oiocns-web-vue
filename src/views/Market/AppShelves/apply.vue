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
        <template #operate="scope"> </template>
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
    tableHead: []
  })

  onMounted(() => {
    starterAppApprovalList()
  })

  //查询上架申请
  const starterAppApprovalList = async () => {
    await $services.appstore
      .searchPublishApply({
        data: {
          offset: 0,
          limit: 10,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          const { result = [], total = 0 } = res.data
          state.applyList = []
          state.applyList = result?.map(
            (item: {
              product: { name: any; code: any; source: any; authority: any; typeName: any }
            }) => {
              return {
                ...item,
                productCode: item.product.code,
                productName: item.product.name,
                productSource: item.product.source,
                productAuthority: item.product.authority,
                productTypeName: item.product.typeName
              }
            }
          )
          state.tableHead = [
            {
              prop: 'productCode',
              label: '应用编号'
            },
            {
              prop: 'productName',
              label: '应用名称'
            },
            {
              prop: 'productSource',
              label: '应用来源'
            },
            {
              prop: 'productAuthority',
              label: '应用权限'
            },
            {
              prop: 'productTypeName',
              label: '应用类型'
            },
            {
              prop: 'price',
              label: '单价/天'
            },
            {
              prop: 'days',
              label: '使用期限'
            },
            {
              prop: 'createTime',
              label: '创建时间',
              width: '200'
            }
          ]
        }
      })
  }
</script>

<style lang="scss" scoped>
  .managerApproval {
    width: 100%;
    height: 100%;
    background-color: var(--el-bg-color);
    .tabList {
      width: 100%;
      height: calc(100vh - 130px);
      padding-left: 16px;
    }
  }
</style>
