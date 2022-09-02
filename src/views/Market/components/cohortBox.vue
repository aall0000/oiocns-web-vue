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
          :data="cascaderTree"
          :props="unitProps"
          show-checkbox
          @check-change="handleCheckChange"
        />
      </div>
      <div class="cohortLayout-content-center" style="width: 33%" v-if="radio !== '1'"></div>
      <div
        class="cohortLayout-content-right"
        :style="'width:' + (radio == '1' ? '49%' : '33%')"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import API from '@/services'
  import type { TabsPaneContext } from 'element-plus'
  type createInfo = {
    info: ProductType
  }
  const activeName = ref(0)
  const tabs = ref([])
  const radio = ref('1')
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
    ]
  })
  const unitProps = {
    label: 'label',
    children: 'children'
  }
  const props = defineProps<createInfo>()
  onMounted(() => {
    searchResource()
    getCompanyTree()
  })
  const handleTabClick = (id: string) => {
    resource.value = id
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
      }
      &-center {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
      }
      &-right {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
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
