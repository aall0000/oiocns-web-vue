<template>
  <div class="created">
    <div class="createdTop">
      <div class="topLeft">
        <el-input class="search" placeholder="搜索单位名" :suffix-icon="Search" />
      </div>
      <div class="topRight">
        <el-button type="primary" @click="create"> 创建集团</el-button>
        <el-button type="primary" @click="create"> 邀请加入集团</el-button>
      </div>
    </div>
    <div class="createdBody" v-if="types === '全部'">
      <el-table :data="state.tableData" stripe style="width: 98%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="code" label="集团编码" />
        <el-table-column prop="name" label="集团名称" />
        <el-table-column prop="remark" label="集团描述" />
        <el-table-column prop="belongId" label="管理单位" />
        <el-table-column prop="createTime" label="加入时间" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="createdBody" v-if="types === '创建的'">
      <el-table :data="state1.tableData" stripe style="width: 98%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="code" label="集团编码" />
        <el-table-column prop="name" label="集团名称" />
        <el-table-column prop="remark" label="集团描述" />
        <el-table-column prop="belongId" label="管理单位" />
        <el-table-column prop="createTime" label="加入时间" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="createdBody" v-if="types === '已加入'">
      <el-table :data="state2.tableData" stripe style="width: 98%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="code" label="集团编码" />
        <el-table-column prop="name" label="集团名称" />
        <el-table-column prop="remark" label="集团描述" />
        <el-table-column prop="belongId" label="管理单位" />
        <el-table-column prop="createTime" label="加入时间" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="createdBottom">
      <el-pagination
        :page-size="pageSize"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        :total="totals"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogVisible" title="提示" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="集团名称">
          <el-input v-model="form.name" style="width: 80%" />
        </el-form-item>
        <el-form-item label="集团编码">
          <el-input v-model="form.code" style="width: 80%" />
        </el-form-item>
        <el-form-item label="集团简称">
          <el-input v-model="form.teamName" style="width: 80%" />
        </el-form-item>
        <el-form-item label="集团代码">
          <el-input v-model="form.teamCode" style="width: 80%" />
        </el-form-item>
        <el-form-item label="集团简介">
          <el-input v-model="form.teamRemark" style="width: 80%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import $services from '@/services'
  import { onMounted, reactive } from 'vue'
  import { ref } from 'vue'
  import { useUserStore } from '@/store/user'
  import { ElMessage } from 'element-plus'
  const store = useUserStore()
  const state = reactive({ tableData: [] })
  const state1 = reactive({ tableData: [] })
  const state2 = reactive({ tableData: [] })
  // const states = ref([])
  let currentPage = ref<number>(1)
  let pageSize = ref<number>(5)
  let offset = ref<number>(0)
  let totals = ref<any>(5)
  let dialogVisible = ref(false)
  const props = defineProps({
    types: String
  })

  const handleCurrentChange = (val: number) => {
    // console.log(val)
    // console.log(pageSize.value)

    offset.value = (val - 1) * pageSize.value
    // console.log(offset.value)
    fetchRequest(offset.value, pageSize.value)
    // currentPage.value = val
  }

  const form = reactive({
    name: '',
    code: '',
    teamName: '',
    teamCode: '',
    teamRemark: ''
  })
  const handleDelete = (id: any) => {
    let token = sessionStorage.getItem('TOKEN')
    $services.company
      .deleteGroup({
        data: {
          id: id
        },
        headers: {
          Authorization: token
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const create = () => {
    dialogVisible.value = true
    // console.log(dialogVisible)
  }
  const save = () => {
    let token = sessionStorage.getItem('TOKEN')
    $services.company
      .createGroup({
        data: {
          name: form.name,
          code: form.code,
          belongId: store.workspaceData.id,
          teamName: form.teamName,
          teamCode: form.teamCode,
          teamRemark: form.teamRemark
        },
        headers: {
          Authorization: token
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '创建成功',
            type: 'success'
          })
          dialogVisible.value = false
          fetchRequest(offset.value, pageSize.value)
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }

  onMounted(() => {
    fetchRequest(offset.value, pageSize.value)
    // console.log(offset.value, pageSize.value)
  })

  async function fetchRequest(offset: number, pageSize: number) {
    let token = sessionStorage.getItem('TOKEN')
    // console.log(offset, pageSize)

    const { data, success } = await $services.company.companyGetGroups({
      data: {
        offset: offset,
        limit: pageSize
      },
      headers: { Authorization: token }
    })
    if (success) {
      const { result = [], total = 0 } = data
      state.tableData = result?.map((item: { team: { remark: any } }) => {
        return { ...item, remark: item.team.remark }
      })
      totals.value = total
      for (let i = 0; i < state.tableData.length; i++) {
        if (state.tableData[i].belongId === store.workspaceData.id) {
          state1.tableData.push(state.tableData[i])
        } else {
          state2.tableData.push(state.tableData[i])
        }
      }
    }
  }
</script>
<style lang="scss">
  .created {
    width: 100%;
    height: 100vh;

    .createdTop {
      width: 95%;
      margin: 30px;
      display: flex;
      justify-content: space-between;
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
