<template>
  <div class="created">
    <div class="createdTop">
      <div class="topLeft">
        <el-input class="search" placeholder="搜索单位名" :suffix-icon="Search" />
      </div>
      <div class="topRight">
        <el-button type="primary"> 批量导入/导出</el-button>
        <el-button>查看申请记录</el-button>
      </div>
    </div>
    <div class="createdBody">
      <el-table :data="tableData" stripe style="width: 98%">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="num" label="统一社会信用代码" />
        <el-table-column prop="isMain" label="是否主单位" />
        <el-table-column prop="admin" label="管理员" />
        <el-table-column prop="time" label="创建时间" />
        <el-table-column prop="state" label="申请状态" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-button size="small">设为主单位</el-button>
            <el-button size="small" type="danger">退出组织</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="createdBottom">
      <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  const tableData = [
    {
      name: '杭州电子科技大学',
      num: '1234567891597534862',
      isMain: '是',
      admin: '孙耀',
      time: '2022-7-26 12:44:37',
      state: '已通过'
    },
    {
      name: '杭州电子科技大学',
      num: '1234567891597534862',
      isMain: '是',
      admin: '孙耀',
      time: '2022-7-26 12:44:37',
      state: '已通过'
    },
    {
      name: '杭州电子科技大学',
      num: '1234567891597534862',
      isMain: '是',
      admin: '孙耀',
      time: '2022-7-26 12:44:37',
      state: '已通过'
    }
  ]
</script>
<style lang="less">
  .created {
    width: 100%;
    height: 100vh;

    .createdTop {
      width: 95%;
      margin: 30px;
      display: flex;
      justify-content: space-between;
      .topLeft {
        .search {
        }
      }
    }
    .createdBody {
      margin: 30px;
    }
    .createdBottom {
      position: absolute;
      right: 30px;
      bottom: 30px;
    }
  }
</style>
