<template>
  <div class="header">返回区域</div>

  <div class='deptDetail-wrap'>
    <div class="detail-box box">
      <ul class="box-btns flex justify-between">
        <li class="box-btns-title">部门列表</li>
        <li class="box-btns-con ">
          <el-button small link type="primary">返回</el-button>
          <el-button small link type="danger">删除</el-button>
          <el-button small link type="primary">新增</el-button>
        </li>
      </ul>
      <el-table class="box-table" :data="list" stripe border header-row-class-name="table_header_class"
        @select="handleSelect">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="序号" />
        <el-table-column prop="thingId" label="部门名称" />
        <el-table-column prop="trueName" label="部门编码" />
        <el-table-column prop="typeName" label="更新时间" />
        <el-table-column label="操作" width="100">

          <template #default>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-pagination" small background layout="prev, pager, next" :total="50" />
    </div>
  </div>
</template>
<script lang='ts' setup>
import API from "@/services"
import { onMounted, reactive, toRefs } from 'vue';
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia';
const store = useUserStore()
const { userUnitInfo } = storeToRefs(store)


onMounted(() => {
  getTableList()

})
const list = [
  {
    name: '1',
    thingId: '编码',
    trueName: '姓名',
    typeName: '角色',
    teamCode: '手机号',
    status: '状态'
  }
]

//选中人员
let selectArr = reactive<Array<any>>([])
const handleSelect = (key: Array<any>) => {
  selectArr = key
  console.log('selectArr', selectArr)
}

const getTableList = async () => {
  const { data, success } = await API.company.getDepartments({
    data: {
      id: userUnitInfo.value.id,
      offset: 0,
      limit: 10
    }
  })

  if (success) {
    console.log('列表', data);

  }
}
</script>

<style lang='scss' scoped>
.header {
  padding: 0 14px;
  height: 40px;
  background-color: #fff;
  margin-bottom: 5px;
  line-height: 40px;
}

.deptDetail-wrap {
  flex-grow: 1;
  padding: 14px;
  background-color: #fff;

  .box-btns {
    padding-bottom: 10px;
  }

  .detail-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .box-table {
      flex-grow: 1;
    }

    .page-pagination {
      padding: 10px 0;
      display: flex;
      justify-content: end;
    }
  }
}
</style>
