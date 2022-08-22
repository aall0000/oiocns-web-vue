<template>
  <el-card class="card">

    <div>
      <el-select v-model="selectedValue" @change="changeGroupIndex" value-key="id" placeholder="请选择集团">
        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div>
      <el-input class="search" v-model="filterText" placeholder="搜索集团">
        <template #suffix>
          <el-icon class="el-input__icon">
            <search />
          </el-icon>
        </template>
      </el-input>

      <el-icon color="#154ad8" :size="20" @click="createGroupDialogVisible = true">
        <CirclePlus />
      </el-icon>
    </div>

    <el-tree :data="orgTree" highlight-current ref="treeRef" @node-click="nodeClick"
      :filter-node-method="filterNode" :default-expanded-keys="defaultExpandedKeys">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <div class="tree-box">
            <el-icon>
              <School />
            </el-icon>
            <span class="tree-box__text">{{ node.label }}</span>
          </div>
        </span>
      </template>
    </el-tree>

  </el-card>

  <el-dialog v-model="createGroupDialogVisible" title="请录入子集团信息" width="40%" center append-to-body @close="createGroupDialogHide">
    <div>
      <el-form-item label="节点名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入节点名称" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="节点编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入节点编号" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="上级节点" style="width: 100%">
        <el-cascader :props="cascaderProps" :options="cascaderTree" v-model="formData.parentIds" style="width: 100%"
          placeholder="请选择上级节点" />
      </el-form-item>
      <el-form-item label="节点简介" style="width: 100%">
        <el-input v-model="formData.teamRemark" :autosize="{ minRows: 5 }" placeholder="请输入节点简介" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createGroupDialogHide">取消</el-button>
        <el-button type="primary" @click="createGroup">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import $services from '@/services'
import { ElMessage } from 'element-plus';

const emit = defineEmits(['nodeClick'])

const state = reactive({
  options: [],
})
let formData = ref<any>({})

const cascaderProps = {
  checkStrictly: true,
  // expandTrigger: ExpandTrigger.HOVER,
  value: 'id',
}
let cascaderTree = ref<OrgTreeModel[]>([])

// 当前选中的集团
let selectedValue = ref<string>()

// 当前用户的集团
let groups = reactive([])
let orgTree = ref<OrgTreeModel[]>([])

// 节点ID和对象映射关系
const parentIdMap: any = {}
let defaultExpandedKeys = ref([])

const filterText = ref('')
const treeRef = ref<any>()

// 查询集团列表
const getGroupList = () => {
  $services.company
    .companyGetGroups({
      data: {
        offset: 0,
        limit: 1000
      }
    })
    .then((res: ResultType) => {
      if (res.data.result && res.data.result.length > 0) {
        groups = res.data.result
        state.options = groups.map(g => {
          return { value: g.id, label: g.name }
        })
        selectedValue.value = groups[0].name
        loadOrgTree(groups[0].id)
      } else {
        groups = []
      }
    })
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

const nodeClick = (val: any, nodeAttribute?: any, event?: any) => {
  emit('nodeClick', val)
  let parentIds = getParentIds(val, [val.id]).reverse();
  formData.value.parentIds = parentIds
}


// 树节点搜索
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}

// 切换集团
const changeGroupIndex = (id: string) => {
  loadOrgTree(id)
}

// 加载集团树
const loadOrgTree = (id?: string)=>{
  const group = groups.find(g => g.id == id || g.name == selectedValue.value)
  $services.company.getGroupTree({
    data: { id: group.id }
  }).then((res: any) => {
    orgTree.value = []
    orgTree.value.push(res.data)
    initIdMap(orgTree.value)
    cascaderTree.value = orgTree.value
    defaultExpandedKeys.value = [res.data.id]
    console.log("defaultExpandedKeys", defaultExpandedKeys.value)
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

let createGroupDialogVisible = ref<boolean>(false)
const createGroupDialogHide = () => {
  formData.value = { parentIds: formData.value.parentIds }
  createGroupDialogVisible.value = false
}

const createGroup = ()=>{
  let parentId = null;
  const parentIds = formData.value.parentIds;
  if (parentIds.length > 0) {
    parentId = parentIds[parentIds.length - 1]
  }
  console.log('parentId=========', parentId)
  // return
  $services.company.createSubgroup({
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
      ElMessage({
        message: res.msg,
        type: 'success'
      })
      createGroupDialogHide()
      loadOrgTree()
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  })
}

//获取部门
onMounted(() => {
  // 查询集团
  getGroupList()
})

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

</script>
<style lang="scss" scoped>
.card {
  height: 100%;
}

.search {
  font-size: 12px;
  .el-input__inner {
    font-size: 12px;
  }
}

.custom-tree-node {
  overflow: hidden;
  text-overflow: ellipsis;
  word-spacing: nowrap;
}

.tree-box {
  display: flex;
  align-items: center;

  &__text {
    margin-left: 5px;
  }
}
</style>
