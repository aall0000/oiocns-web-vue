<template>
  <!-- 组内成员信息 -->
  <div class="deptment-info">
    <div class="deptment-info-btns">
      <div class="left-name">
        <el-icon :size="20">
          <img class="group-icon" src="@/assets/img/group-user.png" alt="" /> </el-icon
        >组内成员
      </div>
      <div class="edit">
        <el-button type="primary">添加成员</el-button>
        <el-button>批量导入/导出</el-button>
        <el-button>变更部门</el-button>
        <el-button>调整排序</el-button>
        <el-button type="danger">操作离职</el-button>
      </div>
    </div>
  </div>
  <div class="tab-list">
    <el-table :data="tableData.list" stripe style="width: 100%" height="390" @select="handleSelect">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="date" label="姓名" width="180" />
      <el-table-column prop="name" label="成员编码" width="180" />
      <el-table-column prop="name" label="成员角色" width="180" />
      <el-table-column
        prop="name"
        label="手机"
        width="180"
        :filters="[
          { text: '2016-05-01', value: '2016-05-01' },
          { text: '2016-05-02', value: '2016-05-02' },
          { text: '2016-05-03', value: '2016-05-03' },
          { text: '2016-05-04', value: '2016-05-04' }
        ]"
      />
      <el-table-column prop="address" label="邮箱" :filter-method="filterHandler" />
    </el-table>
  </div>
  <div class="page-pagination">
    <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'

  let filterHandler = () => {}
  type listType = {
    list?: Array<Object>
  }

  let tableData = reactive<listType>({})
  const props = defineProps<{
    personType: any
    selectId: any
  }>()
  
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
</script>
<style lang="scss" scoped>
  .deptment-info {
    background: #fff;
    padding: 20px;
    .group-icon {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }

    .deptment-info-btns {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;

      .left-name {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
      }

      .edit {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .page-pagination {
    background: #fff;
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 20px;
  }
</style>
