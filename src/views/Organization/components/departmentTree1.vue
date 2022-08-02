<template>
  <ul class="departmentTree-wrap">
    <li class="con tree-select">
      <el-select
        v-model="selectValue"
        @change="changeIndexFun"
        class="m-2"
        placeholder="Select"
        style="margin-left: 20px"
      >
        <el-option
          v-for="item in selectList"
          :key="item.name"
          :label="item.name"
          :value="{ id: item.id, item: item }"
        />
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
      <el-button :icon="Plus" @click="dialogVisible = true" size="small">新建部门</el-button>
      <el-button :icon="User" size="small">管理部门</el-button>
    </li>
    <ul class="con tree-dept">
      <li class="tree-dept-item" v-for="item in treeDate.list" :key="item.name">
        <div
          class="dept-label"
          :class="treeIndex == item.id ? 'active' : ''"
          @click="checkIndex(item.id)"
        >
          <span class="dept-label-name"
            ><img class="dept-label-icon" src="@/assets/img/dept.png" alt="" srcset="" />
            {{ `${item.name}` }}
            <!-- {{`(${item.num}人)`}} -->
          </span>
          <span class="right-icon">
            <el-icon :size="14">
              <ArrowUp />
            </el-icon>
          </span>
        </div>
        <template v-if="item?.children">
          <div class="child-label dept-label" v-for="child in item.children" :key="child.name">
            <span class="dept-label-name"
              ><img class="dept-label-icon" src="@/assets/img/group-next.png" alt="" srcset="" />
              {{ `${child.name}(${child.num}人)` }}</span
            >
            <span class="right-icon">
              <img class="dept-label-icon" src="@/assets/img/group-more.png" alt="" srcset="" />
            </span>
          </div>
        </template>
      </li>
    </ul>
    <el-dialog v-model="dialogVisible" title="请输入部门名称" width="30%">
      <el-form-item label="部门名称">
        <el-input v-model="departmentName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="团队名称">
        <el-input v-model="departmentTeamName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="团队code">
        <el-input v-model="departmentTeamCode" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="团队Remark">
        <el-input v-model="departmentTeamRemark" placeholder="Please input" clearable />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFriends">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </ul>
</template>

<script lang="ts" setup>
  import $services from '@/services'
  import { Search, Plus, User } from '@element-plus/icons-vue'
  import { ref, reactive } from 'vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  const store = useUserStore()
  const { queryInfo } = storeToRefs(store)
  let dialogVisible = ref<boolean>(false)
  defineProps<{
    selectList: any
  }>()
  type selectType = {
    id: string
    item: {
      id: string
      code: number
      name: string
    }
  }
  type treeDateType = {
    list?: any
  }
  let treeDate = reactive<treeDateType>({ list: [] })

  let selectValue = ref<string>('')

  const changeObj = ref<selectType>()

  const emit = defineEmits(['changeIndex', 'treeIndex'])

  const changeIndexFun = (val: selectType) => {
    changeObj.value = val
    emit('changeIndex', val.id)
    selectValue.value = val.item.name
    getDepartmentsList(val.id)
  }
  let treeIndex = ref<string>('')
  const checkIndex = (id: string) => {
    treeIndex.value = id
    emit('treeIndex', id)
  }
  let departmentName = ref<string>('')
  let departmentTeamName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
  const submitFriends = () => {
    console.log(changeObj)
    $services.company
      .createDepartment({
        data: {
          id: changeObj.value.item.id,
          code: changeObj.value.item.code,
          name: departmentName.value,
          parentId: 0,
          teamName: departmentTeamName.value,
          teamCode: departmentTeamCode.value,
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: any) => {
        dialogVisible.value = false
        getDepartmentsList(changeObj.value.item.id)
      })
  }
  let departmentsList = reactive({})
  const getDepartmentsList = (id: string) => {
    $services.company
      .getDepartments({
        data: {
          id: id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: any) => {
        departmentsList = res.data
        let arr: any = []
        res.data.result.forEach((element: any) => {
          let obj = {
            id: element.id,
            code: element.code,
            name: element.name,
            children: {}
          }
          arr.push(obj)
        })
        treeDate.list = arr
      })
  }
  // watch(
  //   selectList,
  //   (val) => {
  //     console.log('valval', val)
  //   },
  //   {
  //     immediate: true,
  //     deep: true
  //   }
  // )
  // onMounted(() => {
  //   getDepartmentsList('')
  // });

  const options = [
    {
      value: 'Option1',
      label: 'Option1'
    },
    {
      value: 'Option2',
      label: 'Option2'
    },
    {
      value: 'Option3',
      label: 'Option3'
    },
    {
      value: 'Option4',
      label: 'Option4'
    },
    {
      value: 'Option5',
      label: 'Option5'
    }
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
<style lang="scss" scoped>
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

            background-color: #e7ecfb;
            border-right: 2px solid $mainColor;
            // transform: translateX(1px);
          }

          .right-icon {
            margin-right: 10px;
          }
        }

        .label {
        }

        .child-label {
          padding-left: 38px;
        }
      }
    }
  }
</style>
