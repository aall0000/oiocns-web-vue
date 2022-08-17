<template>
  <div class="diy-table">
    <div class="diy-table__header" v-if="hasTableHead">
      <div class="diy-table__header--left" style="width: 100%">
        <div class="header-title" v-if="hasTitle">
          {{ tableName }}
          <slot name="slot-title"></slot>
        </div>
        <div class="header-tabs" v-if="hasTabs">
          <slot name="slot-tabs"></slot>
          <slot name="slot-tabsBtn"></slot>
        </div>
      </div>
      <div class="diy-table__header--right">
        <div class="header-buttons">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
    <div class="diy-table__btn">
      <div>
        <slot name="slot-select"></slot>
      </div>
      <div>
        <slot name="slot-buttons"></slot>
      </div>
    </div>
    <div class="diy-table__body">
      <div class="diy-table__body-box">
        <el-table
          ref="diyTable"
          style="width: 100%; height: 100%"
          height="'true'"
          class="table-row-sty"
          tooltip-effect="dark"
          :header-cell-style="{'background:#F5F6FC;color:#333333;font-weight:bold;height:36px;padding:2px 0;'}"
          :row-style="{ height: '44px' }"
          :cell-style="cellStyle"
          :data="tableData"
          row-key="id"
          lazy
          :load="loadNode"
          v-bind="options"
          v-loading="loading"
          border
          stripe
          :default-expand-all="options.expandAll ? options.expandAll : false"
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
          @cell-mouse-enter="handleMouseEnter"
          @cell-dblclick="celldblclick"
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-if="options.checkBox"
            type="selection"
            :selectable="checkSelectable"
            width="50"
            :class="tableData.saleStatus === 3 ? 'tableClass' : ''"
          >
          </el-table-column>
          <el-table-column
            v-if="options.order"
            type="index"
            label="序号"
            width="50"
            :class="tableData.saleStatus === 3 ? 'tableClass' : ''"
          ></el-table-column>
          <template v-for="(item, index) in tableHead">
            <el-table-column
              v-if="item.type === 'slot'"
              :key="index"
              v-bind="item"
              :sortable="item.sortable"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.saleStatus === 3 && item.name == 'operate'"></div>
                <slot v-else :name="item.name" :row="scope.row" :index="scope.$index"></slot>
              </template>
              <template slot="header" slot-scope="scope">
                {{ scope.column.label }}
                <template v-if="item.help">
                  <el-tooltip
                    :aa="scope"
                    class="item"
                    effect="dark"
                    :content="item.help"
                    placement="top-start"
                  >
                    <i class="el-icon-question"> </i>
                  </el-tooltip>
                </template>
                <template v-if="scope.column.label === '操作'"
                  ><svg
                    class="icon"
                    aria-hidden="true"
                    style="cursor: pointer; color: #606266; margin-left: 4px"
                  >
                    <use :xlink:href="'#icon-shezhibiaodan'"></use>
                  </svg>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="'column' + index"
              v-bind="item"
              :show-overflow-tooltip="item.label == '内容摘要' ? false : true"
            ></el-table-column>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    tableName: {
      type: String,
      default: ''
    },
    hasTableHead: {
      type: Boolean,
      default: true
    },
    hasTitle: {
      type: Boolean,
      default: true
    },
    hasTabs: {
      type: Boolean,
      default: false
    },
    tableHead: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    },
    batchOperate: {
      type: Array,
      default: () => []
    },
    queryParams: {
      type: Array,
      default: () => []
    },
    cell: {
      type: Boolean,
      default: false
    }
  })
  const {
    tableName,
    hasTableHead,
    hasTitle,
    hasTabs,
    tableHead,
    tableData,
    options,
    batchOperate,
    queryParams,
    cell
  } = props

  /**
   * el-table 表格配置
   */
  //配置表头背景
  const getRowClass = ({ row: any, column: any, rowIndex: number, columnIndex: number }) => {
    if (rowIndex === 0) {
      return 'background:#F5F6FC;color:#333333;font-weight:bold;height:36px;padding:2px 0;'
    } else {
      return ''
    }
  }
</script>

<style lang="scss" scoped>
  .diy-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;

    &__header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10px;

      .header-title {
        font-size: 16px;
        font-weight: bold;
        color: rgba(48, 49, 51, 1);
        padding: 0 0 10px;

        i {
          font-size: 20px;
          color: rgba(21, 74, 216, 1);
        }
      }

      .header-tabs {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: -5px;
      }

      .header-buttons {
        display: flex;
      }
    }

    &__btn {
      display: flex;
      justify-content: space-between;
    }

    &__body {
      width: 100%;
      height: 100px; //避免el-table无限变高
      display: flex;
      flex: 1;
      margin-top: 10px;

      &-box {
        width: 1vw;
        flex: auto;
      }
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .footer-operate {
        width: 110px;
        height: 40px;
        border: 1px solid rgba(209, 223, 245, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .el-dropdown {
          width: 100%;
          height: 100%;
        }
        .el-dropdown-link {
          width: 100%;
          height: 100%;
          display: block;
          text-align: center;
          height: 38px;
          line-height: 38px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }

      .footer-buttons {
        width: 350px;
        display: flex;
        justify-content: space-between;

        .select-options {
          width: 150px;
        }
      }

      .footer-pagination {
        & :deep(.btn-prev) {
          border-radius: 16px;
        }
        & :deep(.el-pager > .number) {
          border-radius: 4px;
        }
        & :deep(.btn-next) {
          border-radius: 16px;
        }
        & :deep(.el-pagination__sizes .el-input__inner) {
          border-radius: 16px;
          background: rgba(231, 239, 252, 1);
          border-color: transparent;
        }
      }
    }
  }
  .el-dropdown-menu {
    width: 110px;
  }
  .table-row-sty tr:hover,
  .table-row-sty tbody tr.el-table__row.not-read:hover {
    cursor: pointer;
    color: #2da1f8;
  }
  .el-icon-question {
  }
  .tableClass {
    background-color: #edf2fc;
    cursor: no-drop;
  }
  @media screen and (max-width: 1280px) {
    .diy-table__header {
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>
