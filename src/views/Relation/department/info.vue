<template>
  <div class="info">
    <div class="header">
      <div class="title">{{title}}信息</div>
      <div class="box-btns">
        <el-button small link type="primary" :disabled=!selectItem?.data?.authAdmin @click="handleUpdate">编辑</el-button>
        <el-button small link type="primary" :disabled=!selectItem?.data?.authAdmin @click="toAuth">角色管理</el-button>
        <el-button small link type="primary" :disabled=!selectItem?.data?.authAdmin @click="toIdentity">身份管理</el-button>
      </div>
    </div>
    <div class="tab-list">
      <el-descriptions :column="2" border>
        <el-descriptions-item
          :label="title+'名称'"
          label-align="center"
          align="center"
           width="150px"
          label-class-name="my-label"
          class-name="my-content" >{{selectItem?.data?.teamName}}</el-descriptions-item >
        <el-descriptions-item :label="title+'编码'"
          label-align="center"
          align="center"
           width="150px"
          label-class-name="my-label"
          class-name="my-content">{{selectItem?.data?.code}}</el-descriptions-item>
        <el-descriptions-item label="描述"  width="150px" :span="2" label-align="center" align="center">
          <div class="text-remark">
            {{selectItem?.data?.teamRemark}}
          </div>
        </el-descriptions-item>
      </el-descriptions>

    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="'请编辑' + title + '信息'" width="50%">
    <el-form-item :label="title + '名称'">
      <el-input v-model="formData.name" :placeholder="'请输入' + title + '名称'" clearable />
    </el-form-item>
    <el-form-item :label="title + '编号'">
      <el-input v-model="formData.code" :placeholder="'请输入' + title + '描述'" clearable />
    </el-form-item>
    <el-form-item :label="title + '描述'">
      <el-input v-model="formData.teamRemark" :placeholder="'请输入' + title + '描述'" :autosize="{ minRows: 5 }" type="textarea" clearable />
    </el-form-item>
    <el-form-item label="管理角色" style="width: 100%">
        <el-cascader
          :props="authProps"
          :options="authTree"
          v-model="formData.teamAuthId"
          style="width: 100%"
          placeholder="请选择"
        />
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

  let title = ref<string>('单位')
  let selectItem = ref<any>({})
  let dialogVisible = ref<boolean>(false)
  let formData: any = ref({})
  const authProps = {
    checkStrictly: true,
    emitPath:false,
    value: 'id',
    label: 'name',
    children: 'nodes',
  }
  let authTree = ref<any[]>([])
  // 节点ID和对象映射关系
  const parentIdMap: any = {}
  // 加载职权树
  const loadAuthorityTree = () => {
    console.log('selectItem',selectItem.value)
    $services.company.getAuthorityTree({data: {id: selectItem.value.data.belongId}}).then((res: any)=>{
      authTree.value = []
      authTree.value.push(res.data)
      initIdMap(authTree.value)
      authTree.value = authTree.value
    })
  }
  // 初始化ID和对象映射关系
  const initIdMap = (nodes: any[]) => {
    for(const node of nodes){
      parentIdMap[node.id] = node
      if(node.children){
        initIdMap(node.children)
      }
    }
  }
  // 获取父节点到根节点的ID列表
  const getParentIds = (node: any, parentIds: any[]): any[] =>{
    const parentId = node.data.parentId
    if(parentId && parentId != '0'){
      parentIds.push(parentId)
    }
    const parentNode = parentIdMap[parentId]
    if(parentNode){
      parentIds = getParentIds(parentNode, parentIds)
    }
    return parentIds;
  }
  // 获取单位树点击的信息
  const selectItemChange = (data: any) => {
    selectItem.value = data;
    const obj = data.data;
    if(obj.typeName == '公司'){
      title.value = '单位'
    } else {
      title.value = obj.typeName
    }

  };
  defineExpose({ selectItemChange });


  watch(selectItem, () => {
    loadAuthorityTree()
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
    if(data.typeName == '公司'){
      url = 'update'
    } else if(data.typeName == '部门'){
      url = 'updateDepartment'
    } else if(data.typeName == '工作组'){
      url = 'updateJob'
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
    router.push({
      path: '/relation/authority',
      query: {
        title: '单位',
        belongId: selectItem.value.id,
        name: selectItem.value.label,
        code: selectItem.value.data.code,
        teamRemark: selectItem.value.data.teamRemark
      }
    })
  }
  // 跳转至身份管理页面
  const toIdentity = ()=>{
    let persons = 'getPersons'
    switch(selectItem.value.data.typeName){
      case '部门':
        persons = 'getDepartmentPersons'
        break
      case '工作组':
        persons = 'getJobPersons'
        break
    }
    router.push({
      path: '/relation/identity',
      query: {
        belongId: selectItem.value.id,
        name: selectItem.value.label,
        module: 'company',
        persons: persons,
      }
    })
  }

</script>

<style lang="scss" scoped>
  .info {
    height: 100%;
    width: 100%;
    background-color: var(--el-bg-color-overlay);

  }
  .header {
    display: flex;
    padding: 10px 20px;
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
    padding: 10px 20px;
    padding-top: 2px;
    box-sizing: border-box;
  }
  .text-remark{
    max-height: 60px;
    overflow-y: auto;
  }
</style>
