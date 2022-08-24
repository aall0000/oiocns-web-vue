<template>
  <div class="info">
    <div class="header">
      <div class="title">集团信息</div>
      <div class="box-btns">
        <el-button small link type="primary" @click="handleUpdate">编辑</el-button>
        <el-button small link type="primary" @click="toAuth">角色管理</el-button>
        <el-button small link type="primary" @click="toIdentity">身份管理</el-button>
      </div>
    </div>
    <div class="tab-list">
      <ul class="next-dept">
        <table class="table-mytable">
          <tr>
            <td class="left">集团名称</td>
            <td class="column">{{selectItem?.data?.name}}</td>
            <td class="left">集团编码</td>
            <td class="column">{{selectItem?.data?.teamCode}}</td>
          </tr>
          <tr>
            <td class="left">描述</td>
            <td class="column" colspan="3">
              <span class="remark">{{selectItem?.data?.teamRemark}}</span>
            </td>
          </tr>
        </table>
      </ul>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="'请编辑集团信息'" width="30%">
    <el-form-item :label="'集团名称'">
      <el-input v-model="formData.name" :placeholder="'请输入集团名称'" clearable />
    </el-form-item>
    <el-form-item :label="'集团编号'">
      <el-input v-model="formData.code" :placeholder="'请输入集团描述'" clearable />
    </el-form-item>
    <el-form-item :label="'集团描述'">
      <el-input v-model="formData.teamRemark" :placeholder="'请输入集团描述'" :autosize="{ minRows: 5 }" type="textarea" clearable />
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
  import { ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import router from '@/router';

  let selectItem = ref<any>({})
  let dialogVisible = ref<boolean>(false)
  let formData: any = ref({})

  // 获取单位树点击的信息
  const selectItemChange = (data: any) => {
    selectItem.value = data;
  };
  defineExpose({ selectItemChange });


  watch(selectItem, () => {
  });


  // 修改信息
  const handleUpdate = ()=> {
    if(!selectItem.value.id){
      ElMessage.warning('请左侧选择部门或者工作组！')
      return
    }
    formData.value = selectItem.value.data
    dialogVisible.value = true
  }

  // 保存
  const update = ()=>{
    const data = {...formData.value, ...selectItem.value.data};
    let url = null;
    if(data.typeName == '集团'){
      url = 'updateGroup'
    } else if(data.typeName == '子集团'){
      url = 'updateSubGroup'
    }
    $services.company[url]({
      data
    }).then((res: ResultType) => {
      if (res.code == 200 && res.success) {
        dialogVisible.value = false
        ElMessage.success('信息修改成功!')
        selectItem.value.data = data
      }
    })
  }

  // 跳转至角色管理页面
  const toAuth = ()=>{
    router.push({ path: '/relation/authority', query: { belongId: selectItem.value.id }})
  }
  // 跳转至身份管理页面
  const toIdentity = ()=>{
    router.push({ path: '/relation/identity', query: { belongId:  selectItem.value.id }})
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
    box-sizing: border-box;
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
    box-sizing: border-box;
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
      box-sizing: border-box;
      background: #fff;
    }

    .remark{
      display: -webkit-box;
      -webkit-line-clamp: 10;
      -webkit-box-orient: vertical;
      width: 100%;
      overflow: hidden;
    }
  }
</style>
