<template>
  <div class="organization-wrap">
    <div class="org-head">
      <div class="org-type">群 / 消息 / 组织架构</div>
    </div>
    <div class="main-content">
      <div class="menu-tab" v-if="showMenu == true">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          mode="vertical"
          @select="handleSelect"
        >
          <el-menu-item index="1">单位维护</el-menu-item>
          <el-menu-item index="2">集团维护</el-menu-item>
          <el-menu-item index="3">单位群组</el-menu-item>
          <el-menu-item index="4">我的好友</el-menu-item>
        </el-menu>
      </div>
      <div class="menu-tab" v-if="showMenu == false">
        <el-menu
          :default-active="personType"
          @select="personChange"
          class="el-menu-vertical-demo"
          mode="vertical"
        >
          <el-menu-item index="1">我的好友</el-menu-item>
          <el-menu-item index="2">我的群组</el-menu-item>
        </el-menu>
      </div>
      <!-- 下级部门信息 -->
      <div class="org-content" v-if="showMenu == true">
        <departmentTree
          v-if="showMenu == true"
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
                <el-button type="primary" >创建工作组</el-button>
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
        </div>
      </div>
      <div class="org-content" v-if="showMenu == false">
        <div class="department-info">
          <!-- 组内成员信息 -->
          <div class="deptment-info">
            <div class="deptment-info-btns">
              <div class="edit" v-if="personType == '1'">
                <el-button type="primary" @click="friendDialog = true">添加好友</el-button>
              </div>
              <div class="edit" v-else>
                <el-button type="primary" @click="friendDialog = true">添加群</el-button>
                <el-button type="primary" @click="addQun = true">创建群</el-button>
              </div>
            </div>
          </div>
          <div class="tab-list">
            <el-table
              :data="personType == '1' ? state.friendList : state.qunList"
              stripe
              style="width: 100%"
              height="390"
              @select="handleSelect"
            >
              <el-table-column type="selection" width="50" />
              <el-table-column prop="typeName" label="类型" />
              <el-table-column prop="code" label="成员编码" />
              <el-table-column prop="name" label="成员角色" />
              <el-table-column prop="name" label="操作">
                <template #default="scope">
                  <el-button v-if="personType =='1'" @click="deleteFriend(scope.row.id)" type="primary">删除好友</el-button>
                  <el-button v-if="personType =='2'" @click="deletequn(scope.row.id)" type="primary">退出群</el-button>
                </template>
              </el-table-column>
              
            </el-table>
          </div>
          <div class="page-pagination">
            <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
          </div>
        </div>
      </div>
      <el-dialog
        v-model="friendDialog"
        :title="personType == '1' ? '添加好友' : '添加群'"
        width="30%"
      >
        <el-select
          v-model="value"
          filterable
          remote
          reserve-keyword
          :placeholder="personType == '1' ? '请输入要查找的好友名' : '请输入要查找的群'"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="friendDialog = false">取消</el-button>
            <el-button type="primary" v-if="personType == '1'" @click="addFriends">确认</el-button>
            <el-button type="primary" v-else @click="addCohort">确认</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="addQun" title="创建群" width="30%">
            <el-form-item label="群名称">
              <el-input v-model="qunName" placeholder="Please input" clearable />
            </el-form-item>
            <el-form-item label="群编号">
              <el-input v-model="qunCode" placeholder="Please input" clearable />
            </el-form-item>
            <el-form-item label="群简介">
              <el-input v-model="qunTeamRemark" placeholder="Please input" clearable />
            </el-form-item>
            <template #footer>
              <span class="dialog-footer">
=                <el-button type="primary" @click="addQunFun">确认</el-button>
              </span>
            </template>
          </el-dialog>
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
  import { ElMessage } from 'element-plus'

  const store = useUserStore()
  const { queryInfo } = storeToRefs(store)
  const { workspaceData } = storeToRefs(store)
  let showMenu = ref<boolean>(true)
  if (workspaceData.value.name != '个人空间') {
    showMenu.value = true
  } else {
    showMenu.value = false
  }
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
  let personType = ref<string>('1')
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
      })
  }
  let departmentName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
  const submitFriends = () => {
    $services.company
      .createDepartment({
        data: {
          id: selectId.value,
          name: departmentName.value,
          parentId: treeObj.value.id,
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
    getFriendList()
    getQunList()
  })
  let tableData = reactive<listType>({})

  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const state = reactive({ qunList: [], friendList: [] })
  const getFriendList = async () => {
    await $services.person
      .getFriends({ data: { offset: 0, limit: 10 } })
      .then((res: ResultType) => {
        const { result = [] } = res.data
        state.friendList = result
      })
  }
  // 获取我加入的群列表
  const getQunList = async () => {
    const res = await $services.cohort.getJoinedCohorts({ data: { offset: 0, limit: 10 } })
    const { data, err } = res
    if (!err) {
      const { result = [] } = data
      state.qunList = result
    }
  }
  const personChange = (index: string) => {
    personType.value = index
  }
  interface ListItem {
    value: string
    label: string
  }
  const options = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)
  const friendDialog = ref<boolean>(false)
  const remoteMethod = (query: string) => {
    if (query) {
      loading.value = true
      if (personType.value == '1') {
        $services.person
          .searchPersons({
            data: {
              text: query,
              offset: 0,
              limit: 10
            }
          })
          .then((res: ResultType) => {
            if (res.code == 200) {
              console.log(res)
              let states = res.data.result
              let arr: { value: any; label: any }[] = []
              states.forEach((el: any) => {
                let obj = {
                  value: el.id,
                  label: el.name
                }
                arr.push(obj)
              })
              console.log('====', options.value)
              options.value = arr
              loading.value = false
            } else {
              ElMessage({
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
        $services.cohort
          .searchCohorts({
            data: {
              text: query,
              offset: 0,
              limit: 10
            }
          })
          .then((res: ResultType) => {
            if (res.code == 200) {
              console.log(res)
              let states = res.data.result
              let arr: { value: any; label: any }[] = []
              states.forEach((el: any) => {
                let obj = {
                  value: el.id,
                  label: el.name
                }
                arr.push(obj)
              })
              console.log('====', options.value)
              options.value = arr
              loading.value = false
            } else {
              ElMessage({
                message: res.msg,
                type: 'warning'
              })
            }
          })
      }
    } else {
      options.value = []
    }
  }
  const addFriends = () => {
    $services.person
      .applyJoin({
        data: {
          id: value.value
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '申请成功',
            type: 'warning'
          })
          friendDialog.value = false
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const addCohort = () => {
    $services.cohort
      .applyJoin({
        data: {
          id: value.value
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '申请成功',
            type: 'warning'
          })
          friendDialog.value = false
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  //删除好友
  const deleteFriend = (id:string)=>{
    $services.person.remove({
       data:{
        id:id,
        targetIds:[id]
       }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '申请成功',
            type: 'warning'
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  //删除群
  const deletequn = (id:string)=>{
    $services.cohort.delete({
        data: {
          id: id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '删除成功',
            type: 'warning'
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const addQun = ref<boolean>(false);
  let qunName = ref<string>('');
  let qunCode = ref<string>('');
  let qunTeamRemark = ref<string>('');
  const addQunFun = ()=>{
    $services.cohort.create({
        data: {
          id: selectId.value,
          name: qunName.value,
          code: qunCode.value,
          teamRemark: qunTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '创建成功',
            type: 'success'
          })
          addQun.value = false;
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
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
  :deep(.el-select) {
    width: 100%;
  }
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
  .main-content {
    display: flex;
    height: 100%;
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
  .menu-tab {
    width: 100px;
    height: calc(100% - 15px);
    background: #fff;
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
