<template>
    <div class="card">
      <div class="header">
        <div class="title">角色维护</div>
        <div class="box-btns">
          <el-button small link type="primary" @click="goback">返回</el-button>
        </div>
      </div>
      <div>
        <el-table
          :data="orgTree"
          stripe
          row-key="id"
          :border="true"
          lazy
          :tree-props="{ children: 'nodes' }"
          default-expand-all
          class="table"
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column prop="name" label="名称" width="330"/>
          <el-table-column prop="code" label="编码" width="230"/>
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <div class="cell-box">
                <el-button link type="primary" size="small">新增</el-button>
                <el-button link type="primary" size="small" @click="edit(row)">编辑</el-button>
                <el-popconfirm
                  title="确认删除?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="handleDel(row)"
                >
                  <template #reference>
                    <el-button link type="danger" size="small"  style="margin-left:0">删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
<!-- ===============================================部门表单===================================== -->
  <el-dialog
    v-model="createDeptDialogVisible"
    title="请录入部门信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="部门名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="部门编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%"/>
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
      <el-form-item label="部门简介" style="width: 100%">
        <el-input
          v-model="formData.teamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createDept">确认</el-button>
      </span>
    </template>
  </el-dialog>


  <el-dialog
    v-model="editDeptDialogVisible"
    title="请编辑角色信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="部门名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="部门编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%"/>
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
      <el-form-item label="部门简介" style="width: 100%">
        <el-input
          v-model="formData.teamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="editDept">确认</el-button>
      </span>
    </template>
  </el-dialog>

<!-- ===============================================工作组表单===================================== -->
  <el-dialog
    v-model="createJobDialogVisible"
    title="请录入工作组信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="工作组名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="工作组编号" style="width: 100%">
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
      <el-form-item label="工作组简介" style="width: 100%">
        <el-input
          v-model="formData.teamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createJob">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="editJobDialogVisible"
    title="请编辑工作组信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="工作组名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="工作组编号" style="width: 100%">
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
      <el-form-item label="工作组简介" style="width: 100%">
        <el-input
          v-model="formData.teamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="editJob">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup>
  import { ref, onMounted} from 'vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';

  const router = useRouter()
  let createDeptDialogVisible = ref<boolean>(false)
  let editDeptDialogVisible = ref<boolean>(false)
  let createJobDialogVisible = ref<boolean>(false)
  let editJobDialogVisible = ref<boolean>(false)

  let formData = ref<any>({})
  let belongId = ref<any>({})

  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
  }

    // 节点ID和对象映射关系
  const parentIdMap: any = {}

  let orgTree = ref<any[]>([])
  let cascaderTree = ref<any[]>([])

  // 加载单位
  const loadOrgTree = () => {
    $services.company.getAuthorityTree({data: {id: belongId.value}}).then((res: any)=>{
      console.log('res======================', res.data)
      orgTree.value = []
      orgTree.value.push(res.data)
      initIdMap(orgTree.value)
      cascaderTree = orgTree
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


  // 返回
  const goback = () => {
    router.go(-1)
  }

  // 新增
  const create = (row: any, type: string) =>{
    if(type == '工作组'){
      createJobDialogVisible.value = true;
    } else {
      createDeptDialogVisible.value = true;
    }
    let parentIds: any[] = [row.id]
    parentIds = getParentIds(row, parentIds).reverse();
    formData.value.parentIds = parentIds
  }

  // 编辑
  const edit = (row: any) =>{
    if(row.data.typeName == '工作组'){
      editJobDialogVisible.value = true;
    } else {
      editDeptDialogVisible.value = true;
    }
    const parentIds = getParentIds(row, []).reverse();
    const obj = row.data;
    formData.value.parentIds = parentIds

    formData.value = {...formData.value, ...obj}


  }

  // 删除行
  const handleDel = (row: any) =>{
    if(row.data.typeName == '部门'){
      deleteDept(row)
    } else {
      deleteJob(row)
    }
  }

  // 删除部门
  const deleteDept = async (row: any) =>{
    const { success } = await $services.company.deleteDepartment({data: {id: row.id}})
    if (success) {
      ElMessage({
        message: '删除成功!',
        type: 'success'
      })
      loadOrgTree()
    } else {
      ElMessage({
        message: '删除失败!',
        type: 'error'
      })
    }
  }

  // 删除工作组
  const deleteJob = async (row: any) =>{
    const { success } = await $services.company.deleteJob({data: {id: row.id}})
    if (success) {
      ElMessage({
        message: '删除成功!',
        type: 'success'
      })
      loadOrgTree()
    } else {
      ElMessage({
        message: '删除失败!',
        type: 'error'
      })
    }
  }

  //关闭弹窗清空
  const dialogHide = () => {
    formData.value = {parentIds: formData.value.parentIds}
    createDeptDialogVisible.value = false
    editDeptDialogVisible.value = false
    createJobDialogVisible.value = false
    editJobDialogVisible.value = false
  }

  // 创建部门
  const createDept = () => {
    let parentId = null;
    const parentIds = formData.value.parentIds;
    if (parentIds.length > 0) {
      parentId = parentIds[parentIds.length - 1]
    }
    $services.company.createDepartment({
      data: {
        id: formData.value.id,
        code: formData.value.code,
        name: formData.value.name,
        parentId: parentId,
        teamName: formData.value.name,
        teamRemark: formData.value.teamRemark
      }
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
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

  // 编辑部门
  const editDept = ()=>{
    let parentId = null;
    const parentIds = formData.value.parentIds;
    if (parentIds.length > 0) {
      parentId = parentIds[parentIds.length - 1]
    }
    formData.value.parentId = parentId
    $services.company.updateDepartment({
      data: formData.value
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
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

  // 创建工作组
  const createJob  = () => {
    let parentId = null;
    const parentIds = formData.value.parentIds;
    if (parentIds.length > 0) {
      parentId = parentIds[parentIds.length - 1]
    }
    $services.company.createJob({
      data: {
        id: formData.value.id,
        code: formData.value.code,
        name: formData.value.name,
        parentId: parentId,
        thingId: formData.value.thingId,
        teamName: formData.value.name,
        teamRemark: formData.value.teamRemark
      }
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
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

  // 编辑工作组
  const editJob = ()=>{
    let parentId = null;
    const parentIds = formData.value.parentIds;
    if (parentIds.length > 0) {
      parentId = parentIds[parentIds.length - 1]
    }
    formData.value.parentId = parentId
    $services.company.updateJob({
      data: formData.value
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
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
    loadOrgTree()
  })
</script>

<style lang="scss" scoped>

.card {
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 10px;
  .cell-box{
    display: flex;
    align-items: center;
  }
  .header {
    display: flex;

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

  .table {
    width: 100%;
    height: calc(100vh - 150px);
  }
}
</style>
