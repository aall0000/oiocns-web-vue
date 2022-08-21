<template>
    <div class="card">
      <div class="header">
        <div class="title">单位维护</div>
        <div class="box-btns">
          <el-button small link type="primary" @click="goback">返回</el-button>
        </div>
      </div>
      <div>
        <el-table
          class="box-table"
          :data="orgTree"
          stripe
          row-key="id"
          :border="true"
          lazy
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          default-expand-all
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column prop="label" label="名称" width="330"/>
          <el-table-column prop="class.code" label="编码" width="230"/>
          <el-table-column prop="class.typeName" label="类型"  width="120">
            <template #default="scope">
              <el-tag>{{ scope.row.class.typeName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="class.updateTime" label="更新时间" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">

              <el-button link type="primary" size="small" :disabled="row.class.typeName == '工作组'" @click="create(row)">新增</el-button>
              <el-button link type="primary" size="small" @click="edit(row)">编辑</el-button>
              <el-popconfirm
                title="确认删除?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDel(row)"
              >
                <template #reference>
                  <el-button link type="danger" size="small"  :disabled="row.class.typeName == '公司'">删除</el-button>
                </template>
              </el-popconfirm>

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
          v-model="formData.remark"
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
    title="请编辑部门信息"
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
          v-model="formData.remark"
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
          v-model="formData.remark"
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
          v-model="formData.remark"
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

</template>
<script lang="ts" setup>
  import { ref, onMounted, watch} from 'vue'
  import $services from '@/services'
  import { ElMessage, ElTree } from 'element-plus';
  import { useRouter } from 'vue-router';

  const router = useRouter()
  const emit = defineEmits(['nodeClick'])
  let createDeptDialogVisible = ref<boolean>(false)
  let editDeptDialogVisible = ref<boolean>(false)
  let createJobDialogVisible = ref<boolean>(false)
  let editJobDialogVisible = ref<boolean>(false)

  let formData = ref<any>({})

  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
  }

  let orgTree = ref<OrgTreeModel[]>([])
  let cascaderTree = ref<OrgTreeModel[]>([])

  // 加载单位
  const loadOrgTree = () => {
    $services.company.queryInfo({}).then(async (res: any) => {
      if (res.success) {
        let root = createNode(res.data)
        await loadDepartments(root)
        await loadJobs(root)
        orgTree.value = []
        orgTree.value.push(root)

        console.log("orgTree", orgTree.value)
      }
    })
  }

  // 加载部门
  const loadDepartments = async (node: OrgTreeModel) => {
    let { data, success } = await $services.company.getDepartments({
      data: { id: node.id, offset: 0, limit: 1000000 }
    })
    if (success && data.total && data.total > 0) {
      for (let item: TargetModel of data.result) {
        let leaf = createNode(item)
        await loadDepartments(leaf)
        await loadJobs(leaf)
        node.children.push(leaf)
      }
    }
  }

  // 加载工作组
  const loadJobs = async (node: OrgTreeModel) => {
    let { data, success } = await $services.company.getJobs({
      data: { id: node.id, offset: 0, limit: 1000000 }
    })
    if (success && data.total && data.total > 0) {
      for (let item: TargetModel of data.result) {
        node.children.push(createNode(item))
      }
    }
  }

  const createNode = (data: TargetModel): OrgTreeModel=>{
    return {
      id: data.id,
      label: data.name,
      class: data,
      children: []
    }
  }
  // 返回
  const goback = () => {
    router.go(-1)
  }

  // 新增
  const create = (row: any) =>{
    if(row.class.typeName == '工作组'){
      createJobDialogVisible.value = true;
    } else {
      createDeptDialogVisible.value = true;
    }
  }

  // 编辑
  const edit = (row: any) =>{
    if(row.class.typeName == '工作组'){
      editJobDialogVisible.value = true;
    } else {
      editDeptDialogVisible.value = true;
    }
  }

  // 删除行
  const handleDel = async (row: any) =>{
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

  //关闭弹窗清空
  const dialogHide = () => {
    formData.value = {}
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
        teamRemark: formData.value.remark
      }
    }).then((res: ResultType) => {
      if (res.success) {
        createDeptDialogVisible.value = false
        formData.value = {}
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
        teamName: formData.value.name,
        teamRemark: formData.value.remark
      }
    }).then((res: ResultType) => {
      if (res.success) {
        createJobDialogVisible.value = false
        formData.value = {}
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
    loadOrgTree()
  })
</script>

<style lang="scss" scoped>

.card {
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 10px;

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

  .page-pagination {
    padding: 10px;
    display: flex;
    justify-content: end;
  }
}
</style>
