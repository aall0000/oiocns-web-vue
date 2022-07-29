<template>
  <ul class='departmentTree-wrap'>
    <li class="con tree-search">
      <el-input class="search" placeholder="搜索姓名、手机、邮箱">
        <template #suffix>
          <el-icon class="el-input__icon">
            <search />
          </el-icon>
        </template>
      </el-input>
    </li>
    <li class="con tree-btns">
      <el-button :icon="Plus" size="small">新建部门</el-button>
      <el-button :icon="User" size="small">管理部门</el-button>
    </li>
    <ul class="con tree-dept">
      <li class="tree-dept-item" v-for="item in treeDate" :key="item.name">
        <div class="label dept-name active">{{ `${item.name}(${item.num}人)` }}</div>
        <template v-if="item?.children">
          <div class="child-label dept-name" v-for="child in item.children" :key="child.name">{{
              `${child.name}(${child.num}人)`
          }}
          </div>
        </template>
      </li>

    </ul>
  </ul>
</template>

<script lang="ts" setup>
import { Search, Plus, User } from '@element-plus/icons-vue'


const treeDate = [
  {
    name: '名称1',
    num: 20,
    children: [
      { name: '名称1-1', num: 11, },
      { name: '子部门1名称', num: 12, }
    ]
  },
  {
    name: '名称2',
    num: 10,
    children: [
      {
        name: '名称2-1',
        num: 11,
      },
      {
        name: '子部门1名称测试',
        num: 12,
      }]
  }]
</script>

<style lang="scss">
.departmentTree-wrap .tree-search {
  .search {
    .el-input__inner {
      font-size: 12px;

    }
  }
}
</style>
<style lang='scss' scoped>
.departmentTree-wrap {
  padding: 20px 0;
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
  z-index: 2;

  .con {
    margin-bottom: 10px;
  }

  .tree-search {
    padding: 0 14px;

    .search {
      .el-input__inner {
        font-size: 12px;

      }
    }
  }

  .tree-btns {
    display: flex;
    justify-content: space-between;
    padding: 0 14px;

    .el-button--small {
      padding: 12px 6px;
    }
  }

  .tree-dept {
    padding: 0 0 0 14px;
    .tree-dept-item {
      .dept-name {
        height: 32px;
        line-height: 32px;
        font-size: 14px;

        &.active {
          color: $mainColor;
          border-right: 2px solid $mainColor;
          transform: translateX(1px);
        }
      }

      .label {}

      .child-label {
        padding-left: 20px;
      }
    }
  }
}
</style>
