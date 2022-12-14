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
          :style="{ width: '100%', height: '100%' }"
          class="table-row-sty"
          tooltip-effect="dark"
          :header-cell-style="getRowClass"
          :row-style="{ height: '44px' }"
          :cell-style="cellStyle"
          :data="tableData"
          row-key="id"
          lazy
          :load="loadNode"
          v-bind="options"
          v-loading="loading"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          border
          stripe
          :default-expand-all="options.expandAll ? options.expandAll : false"
          @select="select"
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
          @cell-mouse-enter="handleMouseEnter"
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-if="options.checkBox"
            type="selection"
            highlight-current-row
            :selectable="checkSelectable"
            width="50"
          >
          </el-table-column>
          <el-table-column
            v-if="options.order"
            type="index"
            label="??????"
            width="70"
          ></el-table-column>
          <template v-for="(item, index) in tableHead" :key="'column' + index">
            <el-table-column
              v-if="item.type === 'slot'"
              v-bind="item"
              :sortable="item.sortable"
            >
              <template #default="scope">
                <div v-if="scope.row.saleStatus === 3 && item.name == 'operate'"></div>
                <slot v-else :name="item.name" :row="scope.row" :index="scope.$index"></slot>
              </template>
              <template slot="header" #header="scope">
                {{ scope.column.label }}
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type === 'expand'" type="expand">
              <template #default="scope">
                <slot :name="item.name" :row="scope.row" :index="scope.$index"></slot>
              </template>
            </el-table-column>
            <el-table-column v-else  v-bind="item"></el-table-column>
          </template>
        </el-table>
      </div>
    </div>
    <div class="diy-table__footer">
      <div class="footer-buttons">
        <slot name="footer-left"></slot>
        <div class="footer-operate" v-if="batchOperate.length">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              ????????????
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in batchOperate" :command="item.key" :key="item.key">{{
                item.value
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="footer-pagination" v-if="!options.noPage">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-bind="page"
          :pager-count="5"
          style="text-align: right; margin-top: 10px"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { stubFalse } from 'lodash'
  import { ref, reactive, toRefs, computed, onMounted, watch } from 'vue'
  import { useUserStore } from '@/store/user'

  const store = useUserStore()

  interface User {
    id: number
    date: string
    name: string
    hasChildren?: boolean
    children?: User[]
  }
  type Props = {
    tableName?: string
    hasTableHead?: boolean
    hasTitle?: boolean
    hasTabs?: boolean
    tableHead: any[]
    tableData?: any[]
    checkList?: any[]
    pageSizes?: any[]
    total?: number
    loading?: boolean
    options?: {
      expandAll?: boolean
      checkBox?: any
      order?: any
      noPage?: boolean
      selectLimit?: number //???????????????????????????20
    }
    batchOperate?: any[]
    queryParams?: any[]
    cell?: boolean,
  }
  const props = withDefaults(defineProps<Props>(), {
    tableName: '',
    hasTableHead: false,
    hasTitle: true,
    hasTabs: false,
    total: 0,
    loading: false,
    pageSizes: () => [20, 30, 50],
    tableHead: () => [],
    tableData: () => [],
    options: () => {
      return {
        expandAll: false,
        checkBox: false,
        order: true,
        noPage: false,
        selectLimit: 0
      }
    },
    batchOperate: () => [],
    queryParams: () => [],
    cell: false,
  })

  const {
    tableName,
    hasTableHead,
    hasTitle,
    hasTabs,
    tableHead,
    tableData,
    options,
    batchOperate
    // queryParams,
    // cell
  } = toRefs(props)

  const handleCurrent: any = computed(() => {
    return (state.page.currentPage - 1) * state.page.pageSize
  })

  const state = reactive({
    loading: false,
    multipleSelection: [], //??????
    //????????????
    page: {
      total: 0, // ?????????
      currentPage: 1, // ?????????
      current: handleCurrent, // ??????????????????????????????
      pageSize: 20, // ????????????
      pageSizes: [20, 30, 50], // ??????????????????
      layout: 'total, prev, pager, next, sizes'
    },
    isAllSelect: false
  })

  defineExpose({
    state
  })

  const { loading, multipleSelection, page, isAllSelect } = toRefs(state)

  const diyTable = ref(null)

  const emit = defineEmits([
    'handleLazyTree',
    'handleCommand',
    'hideDrop',
    'handleSortChange',
    'handleRowClick',
    'handleUpdate',
    'select',
    'selectionChange'
  ])

  watch(
    () => props.total,
    (val, old) => {
      state.page.total = val
    }
  )
  watch(
    () => props.pageSizes,
    (val, old) => {
      state.page.pageSizes = val
    }
  )

  const cellStyle = ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: any
    column: any
    rowIndex: number
    columnIndex: number
  }) => {
    if (row.saleStatus === 3) {
      return {
        backgroundColor: 'var(--el-color-primary-light-9)', //  'rgb(245, 246, 252)',
        cursor: 'no-drop',
        color: 'gainsboro'
      }
    } else {
      return { padding: '0px' }
    }
  }
  const loadNode = (row: User, treeNode: unknown, resolve: (date: User[]) => void) => {
    emit('handleLazyTree', row, (res: any) => {
      res.forEach((el: any) => {
        checkSelectable(el)
      })
      resolve(res)
    })
  }

  const checkSelectable = (row: any) => {
    if (props.checkList) {
      if (props.checkList.find((v) => v.id == row.id)) {
        console.log('row', row)
        return false
      }
    }
    if (props.options.selectLimit > 0) {
      if (props.options.selectLimit < multipleSelection.value.length) {
        var obj = multipleSelection.value[multipleSelection.value.length - 1]
        diyTable.value.clearSelection()
        diyTable.value!.toggleRowSelection(obj, undefined)
      }
      return true
    } else {
      if (row.children && !row.below) {
        if (row.children.length !== 0) {
          return false
        } else {
          return true
        }
      } else if (row.below == true) {
        return false
      } else if (row.saleStatus === 3) {
        return false
      } else {
        return true
      }
    }
  }

  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
    emit('selectionChange', multipleSelection.value)
  }

  const select = (selection: any, row: any) => {
    emit('select', selection, row)
  }

  /**
   * el-pagination ????????????
   */
  const handleSizeChange = (val: any) => {
    diyTable.value.clearSelection()
    isAllSelect.value = true
    selectAll(false, false)
    page.value.pageSize = val
    page.value.currentPage = 1
    emit('handleUpdate', {pageSize:page.value.pageSize,current: page.value.current})
  }
  const handleCurrentChange = (val: any) => {
    diyTable.value.clearSelection()
    isAllSelect.value = true
    selectAll(false, false)
    page.value.currentPage = val
    emit('handleUpdate',  {pageSize:page.value.pageSize,current: page.value.current})
  }
  onMounted(() => {
    // console.log('props.options.selectLimit', props.options.selectLimit)
  })
  /**
   * ???????????????????????????groupselect???drop
   */
  const handleMouseEnter = () => {
    emit('hideDrop')
  }

  const handleRowClick = (row: any) => {
    emit('handleRowClick', row)
  }

  /**
   * ????????????
   */
  const handleSortChange = (e: any) => {
    emit('handleSortChange', e)
  }

  /**
   * handleCommand ????????????
   */
  const handleCommand = (command: any) => {
    emit('handleCommand', command)
  }
  /**
   * ???????????????
   */
  const initPage = () => {
    page.value.currentPage = 1
  }
  /**
   * el-table ????????????
   */
  //??????????????????
  const getRowClass = ({
    row,
    column,
    rowIndex,
    columnIndex
  }: {
    row: any
    column: any
    rowIndex: number
    columnIndex: number
  }) => {
    if (rowIndex === 0) {
      return {
        background: 'var(--el-color-primary-light-9)', // '#F5F6FC',
        color: 'var(--el-text-color-primary)', // '#333333',
        height: '36px',
        padding: '2px 0'
      }
    } else {
      return {}
    }
  }
  /**
   * ????????????
   */
  const selectAll = (selection: any, first: any) => {
    if (!first) {
      isAllSelect.value = !isAllSelect
    }
    if (isAllSelect) {
      if (selection) {
        selection.map((el: any) => {
          if (el.children) {
            el.children.map((j: any) => {
              toggleSelection(j, isAllSelect)
            })
            if (el.children.length > 0) {
              selectAll(el.children, true)
            }
          }
        })
      }
    } else {
      diyTable.value.clearSelection()
    }
  }
  const toggleSelection = (rows: any, select: any) => {
    if (select) {
      diyTable.value.toggleRowSelection(rows, select)
    } else {
      diyTable.value.clearSelection()
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
      height: 100px; //??????el-table????????????
      display: flex;
      flex: 1;
      // margin-top: 10px;

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
          // background: rgba(231, 239, 252, 1);
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
      display: none;
      flex-wrap: wrap;
    }
  }
  :deep(.el-table__header-wrapper .el-checkbox) {
    display: none;
  }
</style>
