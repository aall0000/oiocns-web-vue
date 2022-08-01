<template>
  <ul class='departmentTree-wrap'>
    <li class=" con tree-select">
      <el-select v-model="selectValue"  class="m-2" placeholder="Select" style="margin-left:20px" >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    </li>
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
        <div class="dept-label active">
          <span class="dept-label-name "><img class="dept-label-icon" src="@/assets/img/dept.png" alt="" srcset=""> {{
              `${item.name}(${item.num}人)`
          }}</span>
          <span class="right-icon">
            <el-icon :size="14">
              <ArrowUp />
            </el-icon>
          </span>
        </div>
        <template v-if="item?.children">
          <div class="child-label dept-label" v-for="child in item.children" :key="child.name">
            <span class="dept-label-name "><img class="dept-label-icon" src="@/assets/img/group-next.png" alt=""
                srcset=""> {{
                    `${child.name}(${child.num}人)`
                }}</span>
            <span class="right-icon">
              <img class="dept-label-icon" src="@/assets/img/group-more.png" alt="" srcset="">
            </span>
          </div>
        </template>
      </li>

    </ul>
  </ul>
</template>

<script lang="ts" setup>
import { Search, Plus, User } from '@element-plus/icons-vue'
import { ref } from 'vue';

const selectValue= ref<string>('')
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


const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
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
  width: 230px;
  min-width: 230px;
  padding: 20px 0;
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
  z-index: 2;

  .con {
    margin-bottom: 10px;
  }

  .tree-search {
    padding: 0 24px;

    .search {
      .el-input__inner {
        font-size: 12px;

      }
    }
  }

  .tree-btns {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;

    .el-button--small {
      padding: 12px 6px;
    }
  }

  .tree-dept {
    // padding: 0 0 0 14px;

    .tree-dept-item {
      .dept-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        font-size: 14px;
        padding-left: 24px;


        &-icon {
          width: 14px;
          height: 14px;
        }

        .dept-label-name {
          display: flex;
          align-items: center;
        }

        .dept-label-icon {
          margin-right: 4px;
        }

        &.active {
          .dept-label-name {
            color: $mainColor;
          }

          background-color: #E7ECFB;
          border-right: 2px solid $mainColor;
          // transform: translateX(1px);
        }

        .right-icon {
          margin-right: 10px;
        }

      }



      .label {}

      .child-label {
        padding-left: 38px;
      }
    }
  }
}
</style>
