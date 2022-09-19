<template>
  <el-card style="border: 0" shadow="never" class="container">
    <!-- 组内成员信息 -->

    <div class="card-header">
      <span>我的好友</span>
      <div>
      <el-button small link type="primary" @click="friendShow">添加好友</el-button>
      <el-button small link type="primary" @click="friendApply">查看申请</el-button>
      <el-button small link type="primary" @click="toAuth">角色管理</el-button>
      <el-button small link type="primary" @click="toIdentity">岗位管理</el-button>
      </div>
    </div>
    <DiyTable
      :style="{height:'calc(100vh - 130px)',width:'100%'}"
      ref="diyTable"
      :hasTableHead="true"
      :tableData="state.friendList"
      :options="options"
      @handleUpdate="handleUpdate"
      :tableHead="tableHead"
    >
      <template #options="scope">
        <el-popconfirm title="您确认删除该好友吗?" @confirm="deleteFriend(scope.row.id)">
          <template #reference>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </DiyTable>
    <searchFriend
      v-if="searchDialog"
      @closeDialog="closeDialog"
      :serachType="1"
      @checksSearch="checksSearch"
    />
  </el-card>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import searchFriend from '@/components/searchs/index.vue'
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import orgChat from '@/hubs/orgchat'
  import DiyTable from '@components/diyTable/index.vue'

  const router = useRouter()

  const searchDialog = ref<boolean>(false)

  type arrList = {
    id: string
  }
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const tableHead = ref([
    {
      prop: 'code',
      label: '账号',
      name: 'code'
    },
    {
      prop: 'name',
      label: '昵称',
      name: 'name'
    },
    {
      prop: 'trueName',
      label: '姓名',
      name: 'trueName'
    },
    {
      prop: 'teamCode',
      label: '手机号',
      name: 'teamCode'
    },
    {
      prop: 'remark',
      label: '座右铭',
      name: 'remark'
    },
    {
      type:"slot",
      prop: 'options',
      label: '操作',
      name: 'options'
    }
  ])
  const options = ref<any>({
    checkBox: true,
    order: true,
    selectLimit: 1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
  const addFriends = (arr: Array<arrList>) => {
    console.log('arrr', arr)
    $services.person
      .applyJoin({
        data: {
          id: arr.join(',')
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '申请成功',
            type: 'warning'
          })
          searchDialog.value = false
          getFriendList()
        }
      })
  }
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getFriendList()
  }
  const handleSelect = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
  }
  onMounted(() => {
    getFriendList()
  })

  const state = reactive({ qunList: [], friendList: [] })
  const getFriendList = async () => {
    await $services.person
      .getFriends({ data: {
          limit: pageStore.pageSize,
          offset: (pageStore.currentPage - 1) * pageStore.pageSize, 
        } })
      .then((res: ResultType) => {
        const { result = [] } = res.data
        state.friendList = result?.map((item: { team: { remark: any; code: any; name: any } }) => {
          return {
            ...item,
            remark: item.team.remark,
            teamCode: item.team.code,
            trueName: item.team.name
          }
        })
        pageStore.total = res.data.total
        diyTable.value.state.page.total = pageStore.total
      })
  }
  //删除好友
  const deleteFriend = (id: string) => {
    $services.person
      .remove({
        data: {
          id: id,
          targetIds: [id]
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '删除成功',
            type: 'warning'
          })
          getFriendList()
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<arrList> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      addFriends(arr)
    } else {
      searchDialog.value = false
    }
  }
  const closeDialog = () => {
    searchDialog.value = false
  }
  const friendShow = () => {
    searchDialog.value = true
  }
  const friendApply = () => {
    router.push({ path: '/cardDetail' ,query: {type: 1,id: orgChat.userId.value}})
  }

  // 跳转至角色管理页面
  const toAuth = ()=>{
    router.push({
      path: '/relation/authority',
      query: {
        title: '好友',
        belongId: orgChat.userId.value,
        name: '我的好友',
        code: 'friends',
        teamRemark: '给好友设置角色',
      }
    })
  }

  // 跳转至岗位管理页面
  const toIdentity = () => {
    router.push({
      path: '/relation/identity',
      query: {
        belongId: orgChat.userId.value,
        name: '我的好友',
        module: 'person',
        persons: 'getFriends',
      }
    })
  }
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    // height: 100%;
    margin: 10px;
    // background: #f0f2f5;
    // padding: 5px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      // padding: 10px;
      // background: #fff;
      .edit {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .tab-list{
    height: 80vh;
  }
</style>
