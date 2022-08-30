<template>
  <div class="info">
    <div class="header">
      <div class="title">集团信息</div>
      <div class="box-btns">
        <el-button small link type="primary" @click="handleUpdate">编辑</el-button>
        <el-button small link type="primary" @click="handleDelete">删除</el-button>
        <el-button small link type="primary" @click="toAuth">角色管理</el-button>
        <el-button small link type="primary" @click="toIdentity">身份管理</el-button>
      </div>
    </div>
    <div class="tab-list">
      <el-descriptions :column="2" border>
        <el-descriptions-item  width="150px" :label="'集团名称'" label-align="center" align="center" label-class-name="my-label"
          class-name="my-content" >{{selectItem?.data?.name}}</el-descriptions-item >
        <el-descriptions-item  width="150px" :label="'集团编码'"
          label-align="center"
          align="center"
          label-class-name="my-label"
          class-name="my-content">{{selectItem?.data?.teamCode}}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2" label-align="center" align="center">
        <div class="text-remark">
            {{selectItem?.data?.teamRemark}}
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="'请编辑集团信息'" width="50%">
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
  import { ElMessage, ElMessageBox } from 'element-plus'
  import router from '@/router';

  const emit = defineEmits(['refresh'])

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

  // 删除集团信息
  const handleDelete = ()=>{
    if(!selectItem.value.id){
      ElMessage.warning('请左侧选择集团')
      return
    }
    const data = selectItem.value.data
    let url: string = null;
    if(data.typeName == '集团'){
      url = 'deleteGroup'
    } else if(data.typeName == '子集团'){
      url = 'deleteSubgroup'
    }
    ElMessageBox.confirm(
      `确定删除 ${data.name} ${data.typeName}吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      $services.company[url]({
        data: {
          id: data.id,
        }
      }).then((res: ResultType) => {
        selectItem.value = {}
        if (res.success) {
          ElMessage({
            message: '操作成功',
            type: 'success'
          })
          emit('refresh')
        }
      })
    })
    .catch(() => {
      console.log('取消移除!')
    })
  }

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
    router.push({ path: '/relation/authority', query: {
      belongId: selectItem.value.id,
      name: selectItem.value.label,
      code: selectItem.value.data.code,
      teamRemark: selectItem.value.data.teamRemark
    }})
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
  .text-remark{
    max-height: 60px;
    overflow-y: auto;
  }
</style>
