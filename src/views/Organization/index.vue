<template>
  <div class="organization-wrap">
    <div class="org-head">
      <span class="org-type">群 / 消息 / 组织架构</span>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">单位</el-menu-item>
      <!-- <el-menu-item index="2">集团</el-menu-item> -->
    </el-menu>
    <!-- 下级部门信息 -->
    <div class="org-content">
      <departmentTree
        :selectList="selectList"
        @changeIndex="changeIndex"
        @treeItem="treeItem"
        class="department-tree"
      />
      <div class="department-info" v-if="showInfo == true">
        <div class="deptment-info">
          <p class="deptment-info-name">
            <span>{{ treeObj.name }}</span>
            <!-- <span class="info-num">20人</span> -->
            <el-button size="small" style="margin-left: 15px">编辑</el-button>
          </p>

          <div class="deptment-info-btns">
            <div class="left-name">
              <el-icon :size="20">
                <Connection />
                <img class="group-icon" src="@/assets/img/group-next.png" alt="" /> </el-icon
              >下级部门
            </div>
            <div class="edit">
              <el-button type="primary" @click="dialogVisible = true">创建子部门</el-button>
              <el-button>调整排序</el-button>
            </div>
          </div>
        </div>
        <div class="tab-list">
          <nextDepartmentVue />
        </div>
        <!-- 组内成员信息 -->
        <div class="deptment-info">
          <div class="deptment-info-btns">
            <div class="left-name">
              <el-icon :size="20">
                <img class="group-icon" src="@/assets/img/group-user.png" alt="" /> </el-icon
              >组内成员
            </div>
            <div class="edit">
              <el-button type="primary">添加成员</el-button>
              <el-button>批量导入/导出</el-button>
              <el-button>变更部门</el-button>
              <el-button>调整排序</el-button>
              <el-button type="danger">操作离职</el-button>
            </div>
          </div>
        </div>
        <div class="tab-list">
          <el-table
            :data="tableData.list"
            stripe
            style="width: 100%"
            height="390"
            @select="handleSelect"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column prop="date" label="姓名" width="180" />
            <el-table-column prop="name" label="成员编码" width="180" />
            <el-table-column prop="name" label="成员角色" width="180" />
            <el-table-column
              prop="name"
              label="手机"
              width="180"
              :filters="[
                { text: '2016-05-01', value: '2016-05-01' },
                { text: '2016-05-02', value: '2016-05-02' },
                { text: '2016-05-03', value: '2016-05-03' },
                { text: '2016-05-04', value: '2016-05-04' }
              ]"
            />
            <el-table-column prop="address" label="邮箱" :filter-method="filterHandler" />
          </el-table>
        </div>
        <div class="page-pagination">
          <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
        </div>
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
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, onMounted } from 'vue'
  import departmentTree from './components/departmentTree1.vue'
  import nextDepartmentVue from './components/nextDepartment.vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  const store = useUserStore()
  const { queryInfo } = storeToRefs(store)

  type listType = {
    list?: Array<Object>
  }
  type selectType = {
    name: string
    id: string
  }
  let dialogVisible = ref<boolean>(false)
  const activeIndex = ref<string>('1')
  const selectList = reactive<selectType[]>([])
  let selectId = ref<string>()
  let showInfo = ref<boolean>(false)
  let treeObj = ref<any>({})
  $services.company
    .getJoinedCompany({
      data: {
        id: queryInfo.value.id,
        offset: 0,
        limit: 100
      }
    })
    .then((res: ResultType) => {
      selectList.push(...res.data.result)
      console.log(selectList)
    })
  const changeIndex = (id: string) => {
    selectId.value = id
    showInfo.value = false
    selectChange(id)
  }
  const treeItem = (item: any) => {
    treeObj.value = item
    getDepPerson(item.id)
  }
  const getDepPerson = (id: string) => {
    $services.company
      .getDepartmentPersons({
        data: {
          id: id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        showInfo.value = true
        console.log('resres', res)
      })
  }
  let departmentName = ref<string>('')
  let departmentTeamName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
  const submitFriends = () => {
    console.log('aaaaa')
    $services.company
      .createDepartment({
        data: {
          id: selectId.value,
          name: departmentName.value,
          parentId: treeObj.value.id,
          teamName: departmentTeamName.value,
          code: departmentTeamCode.value,
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        dialogVisible.value = false
      })
  }
  const getQueryInfo = () => {
    $services.company
      .queryInfo({
        data: {}
      })
      .then((res: ResultType) => {
        console.log('获取单位详情', res)
      })
  }
  const selectChange = (id: string) => {
    $services.company
      .getDepartments({
        data: {
          id: id,
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        console.log(res)
      })
  }
  onMounted(() => {
    getQueryInfo()
  })
  let tableData = reactive<listType>({})

  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  let filterHandler = () => {}
</script>

<style lang="scss">
  .organization-wrap {
    .el-menu--horizontal > .el-menu-item {
      font-size: 18px;

      &:hover,
      &.is-active {
        background-color: none !important;
        color: $mainColor !important;
      }

      &.is-active {
        border-bottom: 2px solid $mainColor;
      }
    }

    .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
    .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
      background: none !important;
    }
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .organization-wrap {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .group-icon {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
  }

  .org-head {
    padding: 20px 20px 10px;
    background: #fff;

    .org-type {
      font-size: 16px;
      color: #8d8d8d;
      margin-bottom: 15px;
    }

    .org-mian {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      display: flex;
      justify-content: space-between;
    }
  }

  .org-content {
    background: #f0f2f5;
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    padding: 15px;

    //左侧组织架构 树
    // .department-tree {
    //   width: 200px;
    //   min-width: 200px;
    // }

    // 右侧列表
    .department-info {
      flex-grow: 1;
    }

    .deptment-info {
      background: #fff;
      padding: 20px;

      .deptment-info-name {
        font-size: 18px;
        font-weight: bold;

        .info-num {
          font-size: 14px;
          font-weight: normal;
          padding: 0 10px;
        }
      }

      .deptment-info-btns {
        display: flex;
        justify-content: space-between;
        padding-top: 10px;

        .left-name {
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
        }

        .edit {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }

    .page-pagination {
      background: #fff;
      height: 50px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-right: 20px;
    }
  }
</style>
