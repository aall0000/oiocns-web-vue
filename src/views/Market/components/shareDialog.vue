<template>
  <div class="shareComp-wrap">
    <el-card class="app-info">
      <el-descriptions title="当前应用">
        <el-descriptions-item label="应用名称">{{ info.name }}</el-descriptions-item>
        <el-descriptions-item label="应用类型">
          <el-tag size="small">{{ info.typeName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前权限">{{ info.authority }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ info.updateTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="share-box">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="按集团分享" name="first">
          <el-tree
            ref="tree"
            :data="state.treeData"
            node-key="id"
            :props="treeOptions"
            show-checkbox
            @check-change="handleCheckChange"
          />
        </el-tab-pane>
        <!-- <el-tab-pane label="按职权分享" name="second"></el-tab-pane> -->
      </el-tabs>
    </el-card>
    <div class="footer">
      <el-button type="primary" @click="submit">确认</el-button
      ><el-button style="margin-right: 10px" @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import API from '@/services'
  import { ref, onMounted, reactive } from 'vue'
  import { useUserStore } from '@/store/user'
  import { ElMessage } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  const store = useUserStore()
  type PropType = {
    info: ProductType
    selectedValue: string
  }
  const treeOptions = {
    label: 'label',
    children: 'children'
  }
  interface Tree {
    name: string
  }
  const handleCheckChange = (data: Tree, checked: boolean, indeterminate: boolean) => {
    console.log(data, checked, indeterminate)
  }
  const emit = defineEmits(['closeDialog'])
  const props = defineProps<PropType>()
  const tree = ref(null)
  const { info } = props
  const activeName = ref('first')
  const state = reactive({
    treeData: []
  })

  onMounted(() => {
    loadOrgTree()
    // getAuthorityData()
  })

  // 加载集团树
  const loadOrgTree = (id?: string) => {
    API.company
      .getGroupTree({
        data: { id: props.selectedValue }
      })
      .then((res: any) => {
        if (res.success) {
          res.data.data.label = res.data.data.name
          let data = [res.data.data]
          data[0].children = res.data.children
          state.treeData = data
        }
      })
  }
  // const getAuthorityData = () => {
  //   $services.company.getAuthorityTree({ data: { id: belongId.value } }).then((res: any) => {})
  // }
  const submit = () => {
    API.company
      .getGroupTree({
        data: {
          productId: props.info.id,
          teamId: tree.value.getCheckedKeys(),
          targetId: store.workspaceData.id
        }
      })
      .then((res: any) => {
        if (res.success) {
          ElMessage({
            type: 'success',
            message: '分享成功'
          })
          closeDialog()
        }
      })
  }
  const closeDialog = () => {
    emit('closeDialog')
  }
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>

<style lang="scss" scoped>
  .footer {
    display: flex;
    margin-top: 10px;
    flex-direction: row-reverse;
  }
  .share-box > :deep(.el-card__body) {
    overflow: auto;
    height: 400px;
  }
  .shareComp-wrap {
    height: 600px;
  }
</style>
