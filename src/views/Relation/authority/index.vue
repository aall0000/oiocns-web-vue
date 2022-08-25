<template>
    <div class="container">
      <el-card>
        <el-descriptions
          title="组织信息"
          :column="2"
          :border="true"
        >
          <template #extra>
            <a small class="goback" link type="primary" @click="goback">返回</a>
          </template>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                名称
              </div>
            </template>
            {{org?.name}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                编码
              </div>
            </template>
            {{org?.code}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                描述
              </div>
            </template>
            {{org?.teamRemark}}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>角色维护</span>
            <!-- <el-button class="button" type="primary" text @click="goback">返回</el-button> -->
          </div>
        </template>

        <div>
          <el-table
            :data="authorityTree"
            stripe
            row-key="id"
            :border="true"
            lazy
            :tree-props="{ children: 'nodes'}"
            default-expand-all
            class="table"
          >
            <el-table-column type="selection" width="50"/>
            <el-table-column prop="name" label="名称" width="330"/>
            <el-table-column prop="code" label="编码" width="230"/>
            <el-table-column prop="belong.name" label="所属" width="230">
              <template #default="belong">
                {{ belong.row.belong?.name }}
                <el-tag v-if="belong.row.belong?.typeName">{{ belong.row.belong?.typeName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <div class="cell-box">
                  <el-button link type="primary" size="small" @click="create(row)">新增</el-button>
                  <el-button link type="primary" size="small" @click="edit(row)"  :disabled="!row.parentId">编辑</el-button>
                  <el-button link type="danger" size="small" @click="handleDel(row)" :disabled="!row.parentId">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

  <el-dialog
    v-model="createDialogVisible"
    title="请录入角色信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="角色名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="角色编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable  style="width: 100%"/>
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
        <el-input
          v-model="formData.remark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span>
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createAuth">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="editDialogVisible"
    title="请编辑角色信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="角色名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="角色编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable  style="width: 100%"/>
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
        <el-input
          v-model="formData.remark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span>
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="editAuth">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup>
  import { ref, onMounted} from 'vue'
  import $services from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useRouter } from 'vue-router';

  // 1. 组织职权； 2. 个人职权；3. 群组职权  Todo
  const router = useRouter()
  let createDialogVisible = ref<boolean>(false)
  let editDialogVisible = ref<boolean>(false)

  let org = ref<any>({})
  let formData = ref<any>({})
  let belongId = ref<any>({})

  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
    children: 'nodes',
  }

  // 节点ID和对象映射关系
  const parentIdMap: any = {}

  let authorityTree = ref<any[]>([])
  let cascaderTree = ref<any[]>([])

  // 加载职权树
  const loadAuthorityTree = () => {
    $services.company.getAuthorityTree({data: {id: belongId.value}}).then((res: any)=>{
      authorityTree.value = []
      authorityTree.value.push(res.data)
      initIdMap(authorityTree.value)
      cascaderTree.value = authorityTree.value
    })
  }

  // 初始化ID和对象映射关系
  const initIdMap = (nodes: any[]) => {
    for(const node of nodes){
      parentIdMap[node.id] = node
      if(node.nodes){
        initIdMap(node.nodes)
      }
    }
  }
  // 获取父节点到根节点的ID列表
  const getParentIds = (node: any, parentIds: any[]): any[] =>{
    const parentId = node.parentId
    if(parentId && parentId != '0'){
      parentIds.push(parentId)
    }
    const parentNode = parentIdMap[parentId]
    if(parentNode){
      parentIds = getParentIds(parentNode, parentIds)
    }
    return parentIds;
  }


  // 返回
  const goback = () => {
    router.go(-1)
  }

  // 新增
  const create = (row: any) =>{
    createDialogVisible.value = true;
    let parentIds: any[] = [row.id]
    parentIds = getParentIds(row, parentIds).reverse();
    formData.value.parentIds = parentIds
  }

  // 编辑
  const edit = (row: any) =>{
    editDialogVisible.value = true;
    const parentIds = getParentIds(row, []).reverse();
    formData.value.parentIds = parentIds
    formData.value = {...formData.value, ...row}
  }


  // 删除行
  const handleDel = async (row: any) =>{
    let title: string;
    title = `确定把 ${row.name} 删除吗？`
    ElMessageBox.confirm(
      title,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      deleteCompanyAuthority(row)
    })
    .catch(() => {
    })
  }

  // 删除组织职权
  const deleteCompanyAuthority = async (row: any)=>{
    const { success } = await $services.company.deleteAuthority({data: {id: row.id}})
    if (success) {
      ElMessage({
        message: '删除成功!',
        type: 'success'
      })
      loadAuthorityTree()
    } else {
      ElMessage({
        message: '删除失败!',
        type: 'error'
      })
    }
  }

  // 删除群组职权
  const deleteCohortAuthority = (row: any)=>{

  }

  // 删除个人职权
  const deletePersonAuthority = (row: any)=>{

  }


  // 关闭弹窗清空
  const dialogHide = () => {
    formData.value = {parentIds: formData.value.parentIds}
    createDialogVisible.value = false
    editDialogVisible.value = false
  }

  // 创建组织员工职权
  const createAuth = () => {
    let parentId = null;
    const parentIds = formData.value.parentIds;
    if (parentIds.length > 0) {
      parentId = parentIds[parentIds.length - 1]
    }
    $services.company.createAuthority({
      data: {
        id: formData.value.id,
        code: formData.value.code,
        name: formData.value.name,
        parentId: parentId,
        public: true,
        remark: formData.value.remark,
        belongId: belongId.value,
      }
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadAuthorityTree()
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
  }

  // 编辑职权
  const editAuth = ()=>{
    let parentId = null;
    const parentIds = formData.value.parentIds;
    if (parentIds.length > 0) {
      parentId = parentIds[parentIds.length - 1]
    }
    formData.value.parentId = parentId
    $services.company.updateAuthority({
      data: formData.value
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadAuthorityTree()
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
  }

  // 获取树
  onMounted(() => {
    belongId.value = router.currentRoute.value.query?.belongId
    org.value = router.currentRoute.value.query
    loadAuthorityTree()
  })
</script>

<style lang="scss" scoped>
.goback{
  cursor: pointer;
}
.container {
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 5px;
  .cell-box{
    display: flex;
    align-items: center;
  }
  .table {
    width: 100%;
    height: calc(100vh - 350px)
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.box-card {
  width: 100%;
}
</style>
