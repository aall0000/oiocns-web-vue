<template>
  <div class="cohortLayout">
    <div class="cohortLayout-header">
      <div class="cohortLayout-header-text">请选择资源：</div>
      <div class="cohortLayout-header-tabs">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane v-for="(item, index) in tabs" :key="item.id" :name="index">
            <template #label>
              <div slot="label" @click="handleTabClick(item.id)">{{ item.name }}</div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="cohortLayout-header" style="margin-top: 10px">
      <div class="cohortLayout-header-text">请选择分发方式：</div>
      <div class="cohortLayout-header-tabs">
        <el-radio-group v-model="radio">
          <el-radio v-for="item in state.way" :key="item.id" :label="item.id">{{
            item.label
          }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="cohortLayout-content">
      <div class="cohortLayout-content-left" :style="'width:' + (radio == '1' ? '49%' : '33%')">
        <el-tree
          v-if="radio == '1'"
          ref="leftTree"
          node-key="id"
          :data="cascaderTree"
          :props="unitProps"
          :check-strictly="true"
          show-checkbox
          @check-change="handleCheckChange"
        />
        <el-tree
          v-else
          ref="leftTree"
          :data="cascaderTree"
          :props="unitProps"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="cohortLayout-content-center" style="width: 33%" v-if="radio !== '1'">
        <el-tree
          ref="centerTree"
          :data="state.centerTree"
          :check-strictly="true"
          show-checkbox
          :props="authorityProps"
        />
      </div>
      <div class="cohortLayout-content-right" :style="'width:' + (radio == '1' ? '49%' : '33%')">
        <Group v-if="radio == '1'" @delContent="delContent" :orgData="state.orgData"></Group>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="">确认</el-button>
      <el-button class="footer-btn" @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive, toRefs } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import API from '@/services'
  import Group from './components/group.vue'
  import type { TabsPaneContext } from 'element-plus'
  interface Tree {
    id: string
    label: string
    children?: Tree[]
  }
  type createInfo = {
    info: ProductType
  }
  const activeName = ref(0)
  const tabs = ref([])
  const radio = ref('1')
  const leftTree = ref(null)
  const resource = ref<string>('')
  const state = reactive({
    way: [
      {
        id: '1',
        label: '按集团分发'
      },
      {
        id: '2',
        label: '按职权分发'
      },
      {
        id: '3',
        label: '按人员分发'
      },
      {
        id: '4',
        label: '按身份分发'
      }
    ],
    orgData: [], // 集团分发右侧数据
    rightData: [], // 集团分发历史数据
    centerTree: [] // 职权分发中间树形
  })
  const authorityProps = {
    label: 'name',
    children: 'nodes'
  }
  const unitProps = {
    label: 'label',
    children: 'children'
  }
  const props = defineProps<createInfo>()
  onMounted(() => {
    searchResource()
    getCompanyTree()
  })
  const emit = defineEmits(['closeDialog'])
  const closeDialog = () => {
    emit('closeDialog')
  }
  // 左侧树点击事件
  const handleCheckChange = (data: any, checked: boolean, indeterminate: any) => {
    console.log('-----------', data, checked, indeterminate)
    if (checked) {
      if (radio.value == '1') {
        let result = state.rightData.some((item: any) => {
          return item.id == data.id
        })
        for (let i = 0; i < state.orgData.length; i++) {
          if (state.orgData[i].id == data.id) {
            if (data.type == 'add') {
              return
            }
          }
        }
        if (result) {
          data.type = 'has'
          state.orgData.push(data)
        } else {
          data.type = 'add'
          state.orgData.push(data)
        }
      }
    } else {
      if (radio.value == '1') {
        let result = state.rightData.some((item: any) => {
          return item.id == data.id
        })
        state.orgData.forEach((el, index) => {
          if (el.id == data.id) {
            if (result) {
              el.type = 'del'
            } else {
              state.orgData.splice(index, 1)
            }
          }
        })
      }
    }
  }
  const handleNodeClick = (data: Tree) => {
    console.log(data)
    API.company
      .getAuthorityTree({
        data: {
          id: data.id
        }
      })
      .then((res: ResultType) => {
        state.centerTree = res.data
      })
  }
  const handleTabClick = (id: string) => {
    resource.value = id
  }
  const delContent = (item: any) => {
    if (item.type == 'del') {
      return
    } else if (item.type == 'add') {
      state.orgData.forEach((el, index) => {
        if (el.id == item.id) {
          state.orgData.splice(index, 1)
          leftTree.value.setChecked(item.id, false)
        }
      })
    } else {
      state.orgData.forEach((el, index) => {
        if (el.id == item.id) {
          el.type == 'del'
        }
      })
    }
  }
  const searchResource = () => {
    API.product
      .searchResource({
        data: {
          id: props.info.id,
          offset: 0,
          limit: 1000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          tabs.value = res.data.result
          resource.value = res.data.result[0].id
        }
      })
  }

  // 节点ID和对象映射关系
  const parentIdMap: any = {}
  let cascaderTree = ref<OrgTreeModel[]>([])
  const getCompanyTree = () => {
    API.company.getCompanyTree({}).then((res: ResultType) => {
      let orgTree = []
      orgTree.push(res.data)
      initIdMap(orgTree)
      cascaderTree.value = filter(JSON.parse(JSON.stringify(orgTree)))
    })
  }
  // 初始化ID和对象映射关系
  const initIdMap = (nodes: any[]) => {
    for (const node of nodes) {
      parentIdMap[node.id] = node
      if (node.children) {
        initIdMap(node.children)
      }
    }
  }
  // 过滤掉工作组作为表单级联数据
  const filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
    nodes = nodes.filter((node) => node.data?.typeName !== '工作组')
    for (const node of nodes) {
      node.children = filter(node.children)
    }
    return nodes
  }
</script>

<style lang="scss" scoped>
  .footer-btn {
    margin-right: 10px;
  }
  .footer {
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
  }
  .demo-tabs {
    margin-left: 20px;
  }
  .cohortLayout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &-header {
      display: flex;
      align-items: center;
    }
    &-content {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: space-between;
      &-left {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
      &-center {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
      &-right {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
    }
  }
  :deep(.el-tabs__header) {
    margin: unset;
  }
  :deep(.el-tabs__nav-wrap::after) {
    background-color: unset;
  }
  .cohortLayout-header-tabs {
    flex: 1;
  }
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
</style>
