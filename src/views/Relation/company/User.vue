<template>
    <div class="card">
      <div class="header">
        <div class="title">{{props.selectItem.label}}</div>
        <div class="box-btns">
          <div v-if="props.selectItem?.data?.typeName == '公司'">
            <el-button small link type="primary">添加成员</el-button>
            <el-button small link type="primary">查看申请(5)</el-button>
            <el-button small link type="primary">操作离职</el-button>
          </div>
          <div v-if="props.selectItem?.data?.typeName == '部门' || props.selectItem?.data?.typeName == '工作组'">
            <el-button small link type="primary">分配人员</el-button>
            <el-button small link type="primary">移除人员</el-button>
          </div>
        </div>
      </div>

      <el-table
        :data="users"
        stripe
        :border="true"
        style="width: 100%; margin: 0 auto"
        height="280px"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="selection" />
        <el-table-column prop="code" label="账号" />
        <el-table-column prop="trueName" label="姓名" />
        <el-table-column prop="teamCode" label="手机号" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
              <el-button link type="primary" size="small">编辑</el-button>
              <el-popconfirm
                title="确认删除?"
                confirm-button-text="确认"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
        </el-table-column>
      </el-table>

      <el-pagination class="page-pagination" @size-change="(e: any) => handlePaginationChange(e, 'limit')"
        @current-change="(e: any) => handlePaginationChange(e, 'current')" background
        :page-sizes="[10, 20, 50, 100]" v-model:currentPage="pagination.current" v-model:page-size="pagination.limit"
        layout="total,prev, pager, next," :total="pageStore.total" />
    </div>

</template>
<script lang='ts' setup>
import $services from '@/services'
import { onMounted, reactive, toRefs, ref, watch } from 'vue';
import { useUserStore } from '@/store/user'
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';

const props = defineProps<{
  selectItem: any,     // 节点数据
}>()

let users = ref<any>([])

const router = useRouter()
// 表格分页数据
const pagination: { current: number, limit: number } = reactive({ current: 1, limit: 10 })
// 表格数据加载状态
const loading = ref<boolean>(false)
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})

// 处理表格分页操作
const handlePaginationChange = (newVal: number, type: "current" | 'limit') => {
  pagination[type] = newVal
  // 获取数据
}

// 加载用户
const getUsers = ()=>{
  const data = props.selectItem?.data
  if(data){
    let url = '';
    if(data.typeName == '公司'){
      url = 'getPersons'
    } else if(data.typeName == '部门'){
      url = 'getDepartments'
    } else if(data.typeName == '工作组'){
      url = 'getJobPersons'
    }
    $services.company[url]({
      data: {
        id: props.selectItem.id,
        offset: 0,
        limit: 100
      }
    }).then((res: ResultType) => {
      if (res.code == 200 && res.success) {
        users = res.data;
      }
    })
  }
}

onMounted(() => {
  console.log("selectItem.value", props.selectItem)
})

watch(props, () => {
  getUsers()
});

</script>

<style lang='scss' scoped>

.card {
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 10px;

  .header {
    display: flex;

    .title {
      text-align: left;
      font-size: 16px;
      width: 30%;
      font-weight: bold;
    }
    .box-btns {
      text-align: right;
      padding-right: 14px;
      padding-bottom: 10px;
      width: 70%;
    }
  }

  .page-pagination {
    padding: 10px;
    display: flex;
    justify-content: end;
  }
}
</style>
