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
        <!-- <el-button type="primary" @click="addPresonDiong = true">创建职权</el-button> -->
        <el-button type="primary" @click="addPresonDiong = true">邀请成员</el-button>
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
   <el-dialog v-model="addAuthDiong" title="创建职权" width="30%">
      <el-form-item label="职权名称">
        <el-input v-model="authName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="职权编号">
        <el-input v-model="authCode" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="职权简介">
        <el-input v-model="authRemark" placeholder="Please input" clearable />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addPresonDiong = false">取消</el-button>
          <el-button type="primary" @click="addPreson">确认</el-button>
        </span>
      </template>
    </el-dialog>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, watch } from 'vue'
  import { ElMessage } from 'element-plus'

  let filterHandler = () => {}
  type listType = {
    list?: Array<Object>
  }
  type selectItem = {
    name: string
    id: string
  }
  let tableData = reactive<listType>({})
  const props = defineProps<{
    selectItem: selectItem
  }>()

  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  watch(
    () => props.selectItem,
    (newValue: selectItem) => {
      if (newValue.id !== '') {
        getList(newValue.id)
      }
    }
  )
  //获取部门员工
  const getList = (id: string) => {
    $services.company
      .getDepartmentPersons({
        data: {
          id: props.selectItem.id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        console.log('ccc',res)
      })
  }
  const authName = ref<string>('');
  const authCode = ref<string>('');
  const authRemark = ref<string>('');
  const addAuthDiong = ref<boolean>(false)



  const presonName = ref<string>('');
  const presonCode = ref<string>('');
  const presonRemark = ref<string>('');
  const addPresonDiong = ref<boolean>(false)
  //添加员工
  const addPreson = ()=>{
     $services.company
      .createIdentity({
        data: {
          name:presonName.value,
          code: presonCode.value,
          remark: presonRemark.value,
          authId:props.selectItem.id
        }
      })
      .then((res: ResultType) => {
        console.log('ccc',res)
      })
      
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
