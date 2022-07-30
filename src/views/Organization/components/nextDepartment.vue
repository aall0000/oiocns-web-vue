<template>
  <ul class="next-dept">
    <!-- 头部 -->
    <el-row class="next-dept-con header">
      <el-col :span="4">
        <div class="con">部门名称</div>
      </el-col>
      <el-col :span="4">
        <div class="con">成员人数</div>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <el-row class="next-dept-con body">
      <el-col :span="4">
        <div class="con">子部门1名称</div>
      </el-col>
      <el-col :span="4">
        <div class="con">20</div>
      </el-col>
    </el-row>
    <el-row class="next-dept-con body">
      <el-col :span="4">
        <div class="con">子部门1名称子部门1名称子部门1名称</div>
      </el-col>
      <el-col :span="4">
        <div class="con">20</div>
      </el-col>
    </el-row>
  </ul>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.next-dept-con {
  width: 100%;
  padding: 0 40px;
  background-color: #fff;

  &.header {
    background-color: #f3f3f3;
    border-bottom: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
  }

  &.body {
    border-bottom: 1px solid #ccc;
  }

  .con {
    text-align: left;
    width: 120px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
