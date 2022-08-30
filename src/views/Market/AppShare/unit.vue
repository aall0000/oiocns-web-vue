<template>
  <div class="card" ref="cardHeight">
    <!-- <div class="header">
      <div class="title">{{ props.selectItem.label }}</div>
      <div class="box-btns">
        <div v-if="props.selectItem?.data?.typeName == '集团'">
          <el-button small link type="primary" @click="pullCompanysDialog = true"
            >添加单位</el-button
          >
        </div>
        <div
          v-if="
            props.selectItem?.data?.typeName == '子集团' ||
            props.selectItem?.data?.typeName == '工作组'
          "
        >
          <el-button small link type="primary" @click="showAssignDialog">分配单位</el-button>
        </div>
      </div>
    </div>

    <div :style="{ height: tabHeight - 30 + 'px' }">
      <div style="width: 100%; height: 100%">
        <DiyTable
          ref="diyTable"
          :hasTableHead="true"
          :tableData="companies"
          @handleUpdate="handleUpdate"
          :tableHead="tableHead"
        >
          <template #operate="scope">
            <el-button
              link
              type="danger"
              size="small"
              :disabled="scope.row.id == selectItem.data?.belongId"
              @click="removeFrom(scope.row)"
              >移除单位</el-button
            >
          </template>
        </DiyTable>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  onMounted(() => {
    console.log(route.query.id)
    getShareHistory()
  })
  const getShareHistory = () => {}
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

    .search {
      width: 50%;
    }
  }
</style>
