<template>
  <el-card class="card">
    <div>
      <el-select
        v-model="selectedValue"
        @change="changeGroupIndex"
        value-key="id"
        placeholder="请选择集团"
      >
        <el-option
          v-for="item in state.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
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
    <el-tree
      :props="defaultProps"
      lazy
      highlight-current
      ref="treeRef"
      @node-click="nodeClick"
      :load="load"
      :filter-node-method="filterNode"
      >
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

  const defaultProps = {
    children: 'children',
    label: 'label',
    isLeaf: 'leaf'
  }

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
  let groupIndex = ref<number>(0);

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
            return {value: g.id, label: g.name}
          })
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

  const load = (node: any, resolve: (data: any) => void) => {
    if (node.level === 0) {
      state.nodeData = node
      state.resolveData = resolve
      getGroupsInfo(resolve)
    }
    if (node.level >= 1) {
      getSubGroups(node, resolve)
    }
  }

  //切换集团
  const changeGroupIndex = (val: any) => {
  }


  //获取集团信息
  async function getGroupsInfo(resolve: any) {
    let arr: any = []
    $services.company
      .companyGetGroups({
        data: {
          offset: 0,
          limit: 1000
        }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = [res.data.result[groupIndex.value]]
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              value:element.id,
              label: element.name,
              code: element.code,
              children: [] as []
            }
            arr.push(obj)
          })
        }
        return resolve(arr)
      })
  }
  //获取子集团
  async function getSubGroups(node: any, resolve: any) {
    let arr: any = []
    await $services.company
      .getSubgroups({
        data: { id: node.data.id, offset: 0, limit: 1000 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = JSON.parse(JSON.stringify(res.data.result))
          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              value:element.id,
              label: element.name,
              code: element.code,
              children: [] as [],
              team: element.team,
              type: 'org'
            }
            arr.push(obj)
          })
        }
        return resolve(arr)
      })
  }

    //获取部门
  onMounted(() => {
    //查询集团
    getGroupList()
  })

</script>
<style lang="scss" scoped>
    .card{
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

