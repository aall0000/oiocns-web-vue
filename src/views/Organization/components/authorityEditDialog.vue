<template>
  <el-dialog v-model="dialogVisible" title="请输子集团名称" width="30%">
    <!-- <el-form-item label="职权名称">
      <el-input v-model="departmentName" placeholder="请输入" clearable />
    </el-form-item>
    <el-form-item label="部门编号">
      <el-input v-model="departmentTeamCode" placeholder="请输入" clearable />
    </el-form-item>
    <el-form-item label="职权简介">
      <el-input v-model="departmentTeamRemark" placeholder="请输入" clearable />
    </el-form-item>
    <el-form-item label="上级节点">
      <el-cascader :props="upNode" v-model="upNodeId.list" @change="handleChange" />
    </el-form-item>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createSubgroupFun">确认</el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue"

let dialogVisible = ref<boolean>(false)
const changeVisible = () => dialogVisible.value = !dialogVisible.value
defineExpose({ dialogVisible, changeVisible })
</script>

<style scoped>

</style>