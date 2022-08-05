<template>
  <ul class="departmentTree-wrap">
    <li class="con tree-select">
      <!-- <el-select
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
      </el-select> -->
    </li>
    <li class="con tree-btns">
      <div class="title" @click="getDataDetail">部门管理</div>
      <el-button :icon="Plus" @click="dialogVisible = true" size="small">新建部门</el-button>
      <!-- <el-button :icon="User" size="small">管理部门</el-button> -->
      <!-- /角色(职权)/岗位(身份)
      创建职权需要角色id和组织id
      通过职权列表创建身份
      集团只有职权没有身份，通过职权可以查人
      单位可以创建职权进行虚拟集团查找 -->
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

    <ul class="con tree-dept">
      <el-tree
        :props="defaultProps"
        lazy
        @node-click="handleNodeClick"
        show-checkbox
        :load="loadNode"
      />
    </ul>
    <el-dialog v-model="dialogVisible" title="请输入部门名称" width="30%">
      <el-form-item label="部门名称">
        <el-input v-model="departmentName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input v-model="departmentTeamCode" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门简介">
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
  import { Search, Plus, } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)
  let dialogVisible = ref<boolean>(false)
  defineProps<{
    selectList: any
  }>()
  type selectType = {
    id: string
    name: string
  }
  let selectValue = ref<string>('')

  const changeObj = ref<selectType>()

  const emit = defineEmits(['changeIndex', 'treeItem'])
  let treeItem = ref<any>({})

  const changeIndexFun = (val: any) => {
    changeObj.value = val
    emit('changeIndex', val.id)
    selectValue.value = val.name
    treeItem.value = ''
  }
  onMounted(() => {
    changeIndexFun(workspaceData.value)
  })
  let departmentName = ref<string>('')
  let departmentTeamName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
  const submitFriends = () => {
    $services.company
      .createDepartment({
        data: {
          id: workspaceData.value.id,
          code: departmentTeamCode.value,
          name: departmentName.value,
          parentId: 0,
          teamName: departmentTeamName.value,
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        dialogVisible.value = false
      })
  }
  async function getDepartmentsList(node: any, resolve: any) {
    var data = await $services.company
      .getDepartments({
        data: { id: node, offset: 0, limit: 100 }
      })
      .then((res: ResultType) => {
        let arr: any = []
        if (res.data.result) {
          res.data.result.forEach((element: any) => {
            let obj = {
              id: element.id,
              label: element.name,
              code:element.code,
              children:[] as string[]
            }
            arr.push(obj)
          })
        } else {
          arr = [{}]
        }
        console.log('arr',arr)
        return arr
      })
    return resolve(data)
  }
  const getDataDetail = ()=>{
    getDepartmentsList('340820527880998912',(res:any)=>{
      console.log(res)
    })
  }
  const defaultProps = {
    children: 'children',
    label: 'label',
    id: 'id',
    code: 'code'
  }
  const loadNode = (node: any, resolve: (data: any) => {}) => {
    console.log(resolve)
    if (node.level === 0) {
      getQueryInfo(resolve)
    }
    if (node.level >= 1) {
      getDepartmentsList(node, resolve([{
          "id": "341994577416294400",
          "label": "帅帅俱乐部",
          "code": "914403001922038216",
          "children": []
      }]))
      getDepartmentsList(node, resolve)
    }
  }
  const handleNodeClick = (data: any) => {
    console.log(data)
  }
  //根节点数据
  async function getQueryInfo(resolve: any) {
    await $services.company.queryInfo({}).then((res: ResultType) => {
      let obj = [
        {
          children: [] as string[],
          label: res.data.name,
          id: res.data.id
        }
      ]
      console.log(obj)
      return resolve(obj)
    })
  }
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
