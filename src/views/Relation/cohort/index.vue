<template>
  <el-card class="container" shadow="never">
    <template #header>
      <div class="card-header">
        <span class="title">群组</span>
        <el-radio-group v-model="mode" size="small" class="button">
          <el-radio-button label="list"
            ><el-icon :size="18"><Tickets /></el-icon
          ></el-radio-button>
          <el-radio-button label="card"
            ><el-icon :size="18"><Menu /></el-icon
          ></el-radio-button>
        </el-radio-group>
      </div>
    </template>

    <div class="tab-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="管理的" name="管理的"> </el-tab-pane>
        <el-tab-pane label="加入的" name="加入的"> </el-tab-pane>
        <div v-if="mode === 'list'">
          <List :type="activeName" />
        </div>
        <div v-if="mode === 'card'">
          <Card :type="activeName" />
        </div>
      </el-tabs>
      <div class="button">
        <el-button small link :icon="CirclePlus" type="primary" @click="createCohortDialog = true"
          >创建</el-button
        >
        <el-button small link :icon="Plus" type="primary" @click="searchDialog = true"
          >加入</el-button
        >
      </div>
    </div>
  </el-card>

  <el-dialog v-model="createCohortDialog" title="创建群组" width="35%">
    <el-form-item label="群组名称">
      <el-input v-model="formData.name" placeholder="请输入群组名称" clearable />
    </el-form-item>
    <el-form-item label="群组编号">
      <el-input v-model="formData.code" placeholder="请输入群组编号" clearable />
    </el-form-item>
    <el-form-item label="群组简介">
      <el-input
        v-model="formData.teamRemark"
        placeholder="请输入群组简介"
        type="textarea"
        clearable
        :rows="4"
      />
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createCohortDialog = false">取消</el-button>
        <el-button type="primary" @click="createCohort">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <SearchCohort
    v-if="searchDialog"
    :serachType="2"
    @closeDialog="searchDialog = false"
    @checksSearch="checksSearch"
  />
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import List from './list.vue'
  import Card from './card.vue'
  import $services from '@/services'
  import { ElMessage, TabsPaneContext } from 'element-plus'
  import { Plus, CirclePlus } from '@element-plus/icons-vue'
  import SearchCohort from '@/components/searchs/index.vue'

  const mode = ref('card')
  const activeName = ref('管理的')

  const createCohortDialog = ref(false)
  const formData = ref<any>({})

  const searchDialog = ref<boolean>(false)

  const handleClick = (tab: TabsPaneContext, event: Event) => {}

  // 创建群组
  const createCohort = () => {
    $services.cohort.create({ data: formData.value }).then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: '创建成功',
          type: 'success'
        })
        createCohortDialog.value = false
        let oldModel = mode.value;
        mode.value = '';
        setTimeout(() => {
          mode.value = oldModel
        }, 100);
      }
    })
  }

  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<any> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      applyJoinCohort(arr)
    } else {
      searchDialog.value = false
    }
  }
  // 申请加入群组
  const applyJoinCohort = (arr: Array<any>) => {
    $services.cohort
      .applyJoin({
        data: {
          id: arr.join(',')
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '申请成功，请等待审核通过!',
            type: 'success'
          })
          searchDialog.value = false
        }
      })
  }
  onMounted(() => {})
</script>
<style lang="scss" scoped>
  .container {
    // height: 100%;
    width: 100%;
    margin: 10px;
    border: 0;
  }

  .title {
    text-align: left;
    font-size: 16px;
    width: 30%;
    font-weight: bold;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-container {
    position: relative;
    .button {
      position: absolute;
      font-size: 14px;
      right: 10px;
      top: 4px;
    }
  }
</style>
