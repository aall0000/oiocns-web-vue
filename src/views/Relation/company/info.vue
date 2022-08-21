<template>
  <div class="info">
    <div class="header">
      <div class="title">单位信息</div>
      <div class="box-btns">
        <el-button small link type="primary" @click="dialogVisible = true">编辑</el-button>
      </div>
    </div>
    <div class="tab-list">
      <ul class="next-dept">
        <table class="table-mytable">
          <tr>
            <td class="left">节点名称</td>
            <td class="column">{{selectItem?.class?.name}}</td>
            <td class="left">节点编码</td>
            <td class="column">{{selectItem?.class?.code}}</td>
          </tr>
          <tr>
            <td class="left">节点描述</td>
            <td class="column">{{selectItem?.class?.remark}}</td>
          </tr>
        </table>
      </ul>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="请输入部门名称" width="30%">
    <el-form-item label="部门名称">
      <el-input v-model="formData.name" placeholder="Please input" clearable />
    </el-form-item>
    <el-form-item label="部门编号">
      <el-input v-model="formData.code" placeholder="Please input" clearable />
    </el-form-item>
    <el-form-item label="部门简介">
      <el-input v-model="formData.remark" placeholder="Please input" clearable />
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="update">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  let selectItem = ref<any>({})
  let dialogVisible = ref<boolean>(false)
  let formData: any = ref({})

  // 获取单位树点击的信息
  const selectItemChange = (data: any) => {
    selectItem.value = data;
  };
  defineExpose({ selectItemChange });


  watch(selectItem, () => {
    console.log(selectItem.value)
    console.log("selectItem改变了");
  });


  // 修改信息
  const update = ()=> {

  }
</script>

<style lang="scss" scoped>
  .info {
    height: 100%;
    width: 100%;
    background-color: #fff;
  }
  .header {
    display: flex;
    padding: 10px;
    padding-top: 16px;
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
  .tab-list {
    padding: 10px;
    padding-top: 2px;
  }
  .next-dept {
    tr {
      border: 1px solid #eff2f7;
      color: #666;
      height: 45px;
      text-align: center;
    }
    .left {
      background: #f5f6fc;
      width: 10.4%;
      min-width: 110px;
    }
    .column {
      width: 39.6%;
      text-align: left;
      padding: 0 20px;
      background: #fff;
    }
  }
</style>
