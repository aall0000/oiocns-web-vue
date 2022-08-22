<template>
  <el-card class="card">
    <li class="con tree-btns">
      <div class="title">部门管理</div>
      <el-dropdown>
        <el-icon color="#154ad8" :size="20">
          <CirclePlus />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="deptDialogVisible = true">
              <el-icon class="el-icon--right">
                <plus />
              </el-icon>
              新增部门
            </el-dropdown-item>
            <el-dropdown-item @click="jobDialogVisible = true">
              <el-icon class="el-icon--right">
                <plus />
              </el-icon>
              新增工作组
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </li>
    <div>
      <el-input class="search" v-model="filterText" placeholder="搜索部门">
        <template #suffix>
          <el-icon class="el-input__icon">
            <search />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="tree">
        <el-tree :data="orgTree"  ref="treeRef" @node-click="nodeClick" node-key="id"
          :default-expanded-keys="defaultExpandedKeys" :filter-node-method="filterNode">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <div class="tree-box">
                <img src="@/assets/img/zuzhijiagou.jpg" class="tree-icon" />
                <span>{{ data.label }}</span>
                <el-tag size="small">{{ data.data.typeName }}</el-tag>
              </div>
            </span>
          </template>
        </el-tree>
    </div>
    <div class="weihu-wrap" @click="modifyOrgTree">
        <span class="weihu-wrap-txt">部门维护</span>
      </div>
  </el-card>

  <el-dialog v-model="deptDialogVisible" title="请录入部门信息" width="40%" center append-to-body @close="dialogHide">
    <div>
      <el-form-item label="部门名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="部门编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="上级节点" style="width: 100%">
        <el-cascader :props="cascaderProps" :options="cascaderTree" v-model="formData.parentIds" style="width: 100%"
          placeholder="请选择" />
      </el-form-item>
      <el-form-item label="部门简介" style="width: 100%">
        <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createDept">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="jobDialogVisible" title="请录入工作组信息" width="40%" center append-to-body @close="dialogHide">
    <div>
      <el-form-item label="工作组名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="工作组编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="上级节点" style="width: 100%">
        <el-cascader :props="cascaderProps" :options="cascaderTree" v-model="formData.parentIds" style="width: 100%"
          placeholder="请选择" />
      </el-form-item>
      <el-form-item label="工作组简介" style="width: 100%">
        <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
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
  import { ElMessage} from 'element-plus';
  import { useRouter } from 'vue-router';


  const router = useRouter()
  const emit = defineEmits(['nodeClick'])
  let deptDialogVisible = ref<boolean>(false)
  let jobDialogVisible = ref<boolean>(false)

  let formData = ref<any>({})
  const cascaderProps = {
    checkStrictly: true,
    // expandTrigger: ExpandTrigger.HOVER,
    value: 'id',
  }
  // 节点ID和对象映射关系
  const parentIdMap: any = {}

  let defaultExpandedKeys = ref([])
  let filterText = ref('')
  const treeRef = ref<any>()
  let orgTree = ref<OrgTreeModel[]>([])
  let cascaderTree = ref<OrgTreeModel[]>([])

  // 加载单位
  const loadOrgTree = () => {
    $services.company.getCompanyTree({}).then((res: any)=>{
      orgTree.value = []
      orgTree.value.push(res.data)
      initIdMap(orgTree.value)
      cascaderTree.value = filter(JSON.parse(JSON.stringify(orgTree.value)))
      defaultExpandedKeys.value = [res.data.id]
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

  // 过滤掉工作组作为表单级联数据
  const filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
    nodes = nodes.filter(node => node.data?.typeName !== '工作组')
    for (const node of nodes) {
      node.children = filter(node.children)
    }
    return nodes;
  }

  // 树点击事件
  const nodeClick = (val: any, nodeAttribute?: any, event?: any) => {
    emit('nodeClick', val)
    let parentIds: any[] = val.data.typeName == '工作组'? [] : [val.id]
    parentIds = getParentIds(val, parentIds).reverse();
    formData.value.parentIds = parentIds
  }
  // 树节点搜索
  const filterNode = (value: string, data: any) => {
    if (!value) return true
    return data.label.includes(value)
  }

  watch(filterText, (val) => {
    treeRef.value!.filter(val)
  })

  //关闭弹窗清空
  const dialogHide = () => {
    formData.value = {parentIds: formData.value.parentIds}
    deptDialogVisible.value = false
    jobDialogVisible.value = false
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
        teamName: formData.value.name,
        teamRemark: formData.value.remark
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

  // 修改组织树维护
  const modifyOrgTree = () => {
    router.push({ path: '/relation/org' })
  }
  //获取部门
  onMounted(() => {
    loadOrgTree()
  })

</script>

<style lang="scss">
.tree .el-tree-node__content {
  height: 30px;
  font-size: 16px;
}
.tree .el-tag{
  margin-left: 5px;
}
</style>
<style lang="scss" scoped>
.card {
  height: 100%;
  position: relative;
}

.tree-btns {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;

  .el-button--small {
    padding: 12px 6px;
  }
}

.search {
  font-size: 12px;
  padding: 12px;

  .el-input__inner {
    font-size: 12px;
  }
}

.custom-tree-node {
  overflow: hidden;
  text-overflow: ellipsis;
  word-spacing: nowrap;
  display: flex;
  cursor: pointer;
}

.tree {
  position: relative;
  max-height: 70%;
  .tree-icon{
    width: 14px;
    height: 14px;
    display: block;
    margin-top: -3px;
    margin-right: 3px;
  }
  .weihu-wrap {
    text-align: center;
    background-color: #fff;
    border-top: 1px solid #ccc;
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    width:100%;
    height: 30px;
    line-height: 30px;
    left:0;
    &-txt {
      color: $mainColor;
      font-size: 16px;
    }
  }
}

  .tree-box {
    display: flex;
    align-items: center;
    &__text {
      margin-left: 5px;
    }
    &span{
      font-size: 16px;
    }
  }

.bottom {
  position: fixed;
  bottom: 0; //这里换成top:0;就悬浮在头部
  width: 100%;
  z-index: 100;
}
</style>

