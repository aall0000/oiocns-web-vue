<template>
  <div class="department-info">
    <div class="deptment-info">
      <div class="deptment-info-btns">
        <div class="left-name">集团信息</div>
      </div>
    </div>
    <div class="tab-list">
      <ul class="next-dept">
        <table class="table-mytable">
          <tr>
            <td class="left">节点名称</td>
            <td class="column">{{selectItem?.data?.name}}</td>
            <td class="left">节点编码</td>
            <td class="column">{{selectItem?.data?.teamCode}}</td>
          </tr>
          <tr>
            <td class="left">节点描述</td>
            <td class="column" colspan="3">
              <span class="remark">{{selectItem?.data?.teamRemark}}</span>
            </td>
          </tr>
        </table>
      </ul>
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
          <el-button type="primary" @click="updateGroup">确认</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

	const props = defineProps({
		group: Object,
    default: {}
	})
  let dialogVisible = ref<boolean>(false)
  let formData: any = ref({})
  let selectItem = ref<any>({})

  // 获取单位树点击的信息
  const selectItemChange = (data: any) => {
    selectItem.value = data;
  };
  defineExpose({ selectItemChange });


  watch(selectItem, () => {
    console.log(selectItem.value)
    console.log("selectItem改变了");
  });
  
  // 修改集团
  const updateGroup = ()=> {

  }
</script>

<style lang="scss" scoped>
  .department-info {
    box-sizing: border-box;
    padding: 15px 20px;
    background: #fff;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  .deptment-info {
    background: #fff;
    margin-bottom: 15px;
    .deptment-info-name {
      font-size: 18px;
      font-weight: bold;
      .info-num {
        font-size: 14px;
        font-weight: normal;
        padding: 0 10px;
      }
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
