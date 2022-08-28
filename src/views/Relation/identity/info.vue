<template>
  <div class="info">
    <div class="header">
      <div class="title">身份信息</div>
      <div class="box-btns">
        <el-button small link type="primary" @click="handleUpdate">编辑</el-button>
        <el-button small link type="primary" @click="goback">返回</el-button>
      </div>
    </div>
    <div class="tab-list">
      <ul class="next-dept">
        <table class="table-mytable">
          <tr>
            <td class="left">名称</td>
            <td class="column">{{selectItem?.name}}</td>
            <td class="left">编码</td>
            <td class="column">{{selectItem?.code}}</td>
          </tr>
          <tr>
            <td class="left">描述</td>
            <td class="column" colspan="3">
              <span class="remark">{{selectItem?.remark}}</span>
            </td>
          </tr>
        </table>
      </ul>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="修改角色信息" width="40%" center append-to-body @close="dialogHide">
      <div>
        <el-form-item label="角色名称" style="width: 100%">
          <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="角色编号" style="width: 100%">
          <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="上级节点" style="width: 100%">
        <el-cascader
          :props="cascaderProps"
          :options="cascaderTree"
          v-model="formData.parentIds"
          style="width: 100%"
          placeholder="请选择"
        />
        </el-form-item>
        <el-form-item label="角色简介" style="width: 100%">
          <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
        </el-form-item>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogHide">取消</el-button>
          <el-button type="primary" @click="updateIdentity">确认</el-button>
        </span>
      </template>
    </el-dialog>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive,watch,onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import router from '@/router';

  let selectItem = ref<any>({})
  let dialogVisible = ref<boolean>(false)
  let formData: any = ref({
    name:''
  })
  const belongId= ref<any>()
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
      ElMessage.warning('请左侧选择身份')
      return
    }
    formData.value = selectItem.value
    dialogVisible.value = true
    formData.value.parentIds = getParentIds({id: selectItem.value.authId}, [selectItem.value.authId])
  }
  const dialogHide = ()=>{
     dialogVisible.value = false
  }
  // 保存
  const updateIdentity = ()=>{
    const data = {...formData.value};
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

  // 节点ID和父对象映射关系
  const idParentMap: any = {}

  let authorityTree = ref<any[]>([])
  let cascaderTree = ref<any[]>([])

  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
    children: 'nodes',
  }

  // 加载职权树
  const loadAuthorityTree = () => {
    $services.company.getAuthorityTree({data: {id: belongId.value}}).then((res: any)=>{
      authorityTree.value = []
      authorityTree.value.push(res.data)
      initIdParentMap(res.data)
      cascaderTree.value = authorityTree.value
    })
  }
  // 初始化ID和对象映射关系
  const initIdParentMap = (node: any) => {
    console.log(node)
    if(node.nodes){
      for(const n of node.nodes){
        idParentMap[n.id] = node
        initIdParentMap(n)
      }
    }

  }

  // 获取父节点到根节点的ID列表
  const getParentIds = (node: any, parentIds: any[]): any[] =>{
    const parentNode = idParentMap[node.id]
    if(parentNode){
      parentIds.push(parentNode.id)
      parentIds = getParentIds(parentNode, parentIds)
    }
    return parentIds;
  }

  onMounted(() => {
    belongId.value = router.currentRoute.value.query?.belongId
    loadAuthorityTree();
  })

  // 返回
  const goback = () => {
    router.go(-1)
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
      display: block;
      max-height: 60px;
      display: -webkit-box;
      -webkit-line-clamp: 10;
      -webkit-box-orient: vertical;
      width: 100%;
      overflow-y: auto;
    }
  }
</style>
