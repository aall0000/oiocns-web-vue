<template>
  <div class="userLayout">
    <DiyTable
      ref="diyTable"
      :tableName="tableName"
      :tableData="state.tableData"
      :tableHead="state.tableHead"
      @handleUpdate="handleUpdate"
    >
      <template #unit="scope">
        <div>{{ scope.row.groupName }}</div>
      </template>
      <template #groupCode="scope">
        <div>{{ scope.row.groupName }}</div>
      </template>
      <template #operate="scope">
        <TheTableButton :data="scope.row" @update="getData"></TheTableButton>
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
  import TheTableButton from './components/theTableButton.vue'

  const route = useRoute()
  const diyTable = ref(null)
  const tableName = ref('成员列表')
  const state = reactive({
    tableData: [],
    tableHead: [
      {
        prop: 'typeName',
        label: '类型'
      },
      {
        prop: 'code',
        label: '编码'
      },
      {
        prop: 'name',
        label: '名称'
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
        width: '80',
        name: 'operate'
      }
    ]
  })

  onMounted(() => {
    getData()
  })

  type page = {
    currentPage: number
    layout: string
    pageSize: number
    pageSizes: Array<number>
    total: number
  }

  const handleUpdate = (val: page) => {
    getData()
  }

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
          state.tableData = res.data.result
          diyTable.value.state.page.total = res.data.total
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
