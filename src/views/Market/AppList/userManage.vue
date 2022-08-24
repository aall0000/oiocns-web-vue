<template>
  <div class="userLayout">
    <DiyTable
      ref="diyTable"
      :tableName="tableName"
      :tableData="state.tableData"
      :tableHead="state.tableHead"
    >
      <template #unit="scope">
        <div>{{ scope.row.groupName }}</div>
      </template>
      <template #groupCode="scope">
        <div>{{ scope.row.groupName }}</div>
      </template>
    </DiyTable>
  </div>
</template>

<script setup lang="ts">
  import DiyTable from '@/components/diyTable/index.vue'
  import { onMounted, reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const diyTable = ref(null)
  const tableName = ref('成员列表')
  const state = reactive({
    tableData: [
      {
        createTime: '2021-02-05 13:15:32',
        createUser: -1,
        depth: 6,
        groupCode: 'CJGLJT',
        groupDescription: '超管集团',
        groupName: '超级管理集团',
        id: '1357558453686837250',
        isCreate: 1,
        isDeleted: 0,
        linkMan: '',
        linkPhone: '',
        socialCreditCode: '',
        status: -1,
        tenantCode: '000000',
        type: 1,
        unitName: '',
        updateTime: '',
        updateUser: -1
      }
    ],
    tableHead: [
      {
        prop: 'groupCode',
        label: '集团编码',
        width: '180',
        name: 'groupCode'
      },
      {
        prop: 'groupName',
        label: '集团名称',
        width: '240'
      },
      {
        prop: 'groupDescription',
        label: '集团描述',
        width: '330'
      },
      {
        prop: 'unitName',
        label: '管理单位',
        width: '240',
        type: 'slot',
        name: 'unit'
      },
      {
        prop: 'createTime',
        label: '加入时间',
        minWidth: '180'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '80',
        name: 'operate'
      }
    ]
  })

  onMounted(() => {
    getData()
  })

  const getData = () => {
    $services.appstore
      .member({
        data: {
          id: route.query.data,
          offset: diyTable.value.state.page.current,
          limit: diyTable.value.state.page.pageSize,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
        }
      })
  }
</script>

<style lang="scss" scoped>
  .userLayout {
    padding: 10px;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
