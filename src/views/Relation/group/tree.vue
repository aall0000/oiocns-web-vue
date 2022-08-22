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
    </div>
    <el-tree :data="orgTree" highlight-current ref="treeRef" @node-click="nodeClick" :filter-node-method="filterNode">
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
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import $services from '@/services'

const emit = defineEmits(['groupNodeClick'])

const state = reactive({
  options: [],
  isShowCode: false,
  isShowName: true,
  isShowUnit: false,
  nodeData: {
    childNodes: [] as []
  },
  resolveData: Function as (data: any) => void
})

// 当前选中的集团
let selectedValue = ref<string>()
// 当前用户的集团
let groups = reactive([])
let orgTree = ref<OrgTreeModel[]>([])

const filterText = ref('')

// 查询集团
const getGroupList = () => {
  $services.company
    .companyGetGroups({
      data: {
        offset: 0,
        limit: 1000
      }
    })
    .then((res: ResultType) => {
      if (res.data.result) {
        groups = res.data.result
        state.options = groups.map(g => {
          return { value: g.id, label: g.name }
        })
        selectedValue.value = groups[0].name
        changeGroupIndex(groups[0].id)
      } else {
        groups = []
      }
    })
}

const nodeClick = (val: any, nodeAttribute?: any, event?: any) => {
  console.log("groupNodeClick===", val)
  emit('groupNodeClick', val)
}
// 树节点搜索
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}

//切换集团
const changeGroupIndex = (id: string) => {
  $services.company.getGroupTree({
    data: { id }
  }).then((res: any) => {
    orgTree.value = [res.data]
  })
}
//获取部门
onMounted(() => {
  //查询集团
  getGroupList()
})

</script>
<style lang="scss" scoped>
.card {
  height: 100%;
}

.search {
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

