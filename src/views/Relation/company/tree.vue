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
      <el-tree :data="orgTree" ref="treeRef" @node-click="nodeClick" node-key="id" :highlightCurrent="true"
        :default-expanded-keys="defaultExpandedKeys" :filter-node-method="filterNode">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <div class="tree-box">
              <el-icon>
                <School />
              </el-icon>
              <span>{{ data.label }}</span>
              <el-tag size="small">{{ data.data.typeName }}</el-tag>
            </div>
          </span>
        </template>
      </el-tree>

      <div class="weihu-wrap" @click="updateNode">
        <span class="weihu-wrap-txt">部门维护</span>
      </div>
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
import { ref, reactive, onMounted, watch } from 'vue'
import $services from '@/services'
import { ElMessage, ElTree, ExpandTrigger } from 'element-plus';
import { update } from 'lodash';

const emit = defineEmits(['nodeClick'])
let deptDialogVisible = ref<boolean>(false)
let jobDialogVisible = ref<boolean>(false)

let formData = ref<any>({})

const state = reactive({
})

const cascaderProps = {
  checkStrictly: true,
  // expandTrigger: ExpandTrigger.HOVER,
  value: 'id',
}

const defaultExpandedKeys = ref([])
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
let orgTree = ref<OrgTreeModel[]>([])
let cascaderTree = ref<OrgTreeModel[]>([])

// 加载单位
const loadOrgTree = () => {
  $services.company.getCompanyTree({}).then((res: any)=>{
    orgTree.value.push(res.data)
  })
}

// 过滤掉工作组作为表单级联数据
const filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
  nodes = nodes.filter(node => node.class?.typeName !== '工作组')
  for (const node of nodes) {
    node.children = filter(node.children)
  }
  return nodes;
}

// 树点击事件
const nodeClick = (val: any, nodeAttribute?: any, event?: any) => {
  // 设置表单上级节点
  if (nodeAttribute) {
    let parentIdArr: any = []
    const level = nodeAttribute.level
    for (let i = 0; i < level; i++) {
      console.log("nodeAttribute.data.value", nodeAttribute.data)
      parentIdArr = [...[nodeAttribute.data.value], ...parentIdArr]
      nodeAttribute = nodeAttribute.parent
    }
    formData.value.parentIds = parentIdArr
    console.log('parentIds', formData.value)
  }
  console.log('nodeAttribute.parent', nodeAttribute.parent)
  console.log('val', val)
  console.log('nodeAttribute', nodeAttribute)
  console.log('event', event)
  emit('nodeClick', val)
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
  formData.value = {}
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
      deptDialogVisible.value = false
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
const createJob = () => {
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
      deptDialogVisible.value = false
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

// 修改组织树节点
const updateNode = () => {

}

//获取部门
onMounted(() => {
  loadOrgTree()
})



</script>
<style lang="scss" scoped>
.card {
  height: 100%;
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
  height: 100%;

  .weihu-wrap {
    padding-bottom: 10px;
    text-align: center;
    background-color: #fff;
    border-top: 1px solid #ccc;
    cursor: pointer;

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
}

.bottom {
  position: fixed;
  bottom: 0; //这里换成top:0;就悬浮在头部
  width: 100%;
  z-index: 100;
}
</style>

