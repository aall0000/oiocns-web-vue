<template>
  <div class="created">
    <div class="createdTop">
      <div class="topLeft">
        <el-input class="search" placeholder="搜索单位名" :suffix-icon="Search" />
      </div>
      <div class="topRight">
        <el-button type="primary"> 批量导入/导出</el-button>
        <el-button>查看申请记录</el-button>
      </div>
    </div>
    <div class="createdBody" v-if="types === '全部'">
      <el-table :data="state.tableData" stripe style="width: 98%">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="code" label="统一社会信用代码" />
        <el-table-column prop="isMain" label="是否主单位" />
        <el-table-column prop="belongId" label="管理员" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="state" label="申请状态" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger">退出单位</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="createdBottom">
        <el-pagination
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="totals"
          :current-page="currentPage1"
          @current-change="handleCurrentChange1"
        />
      </div>
    </div>
    <div class="createdBody" v-if="types === '创建的'">
      <el-table :data="state1.tableData" stripe style="width: 98%">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="code" label="统一社会信用代码" />
        <el-table-column prop="isMain" label="是否主单位" />
        <el-table-column prop="belongId" label="管理员" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="state" label="申请状态" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger">退出单位</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="createdBottom">
        <el-pagination
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="totals"
          :current-page="currentPage2"
          @current-change="handleCurrentChange2"
        />
      </div>
    </div>
    <div class="createdBody" v-if="types === '已加入'">
      <el-table :data="state2.tableData" stripe style="width: 98%">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="code" label="统一社会信用代码" />
        <el-table-column prop="isMain" label="是否主单位" />
        <el-table-column prop="belongId" label="管理员" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="state" label="申请状态" />
        <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger">退出单位</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="createdBottom">
        <el-pagination
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="totals"
          :current-page="currentPage3"
          @current-change="handleCurrentChange3"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import { onMounted, reactive, ref } from 'vue'
  import { onBeforeMount } from 'vue'
  import $services from '@/services'
  import { useUserStore } from '@/store/user'
  const store = useUserStore()
  let currentPage1 = ref<number>(1)
  let currentPage2 = ref<number>(1)
  let currentPage3 = ref<number>(1)
  let pageSize = ref<number>(5)
  let offset1 = ref<number>(0)
  let offset2 = ref<number>(0)
  let offset3 = ref<number>(0)
  let totals = ref<any>(5)
  const state = reactive({ tableData: [] })
  const state1 = reactive({ tableData: [] })
  const state2 = reactive({ tableData: [] })

  onBeforeMount(() => {
    fetchRequest(offset1.value, pageSize.value)
  })
  const props = defineProps({
    types: String
  })
  const handleCurrentChange1 = (val: number) => {
    console.log(val)
    console.log(pageSize.value)

    offset1.value = (val - 1) * pageSize.value
    console.log(offset1.value)
    fetchRequest(offset1.value, pageSize.value)
    currentPage1.value = val
  }
  const handleCurrentChange2 = (val: number) => {
    console.log(val)
    console.log(pageSize.value)

    offset2.value = (val - 1) * pageSize.value
    console.log(offset2.value)
    fetchRequest(offset2.value, pageSize.value)
    currentPage2.value = val
  }
  const handleCurrentChange3 = (val: number) => {
    console.log(val)
    console.log(pageSize.value)

    offset3.value = (val - 1) * pageSize.value
    console.log(offset3.value)
    fetchRequest(offset3.value, pageSize.value)
    currentPage3.value = val
  }
  async function fetchRequest(offset: number, pageSize: number) {
    let token = sessionStorage.getItem('TOKEN')
    const { data, err } = await $services.company.getJoinedCompany({
      data: {
        offset: offset,
        limit: pageSize
      },
      headers: { Authorization: token }
    })
    if (!err) {
      const { result, total } = data
      state.tableData = result.map((item: { team: { remark: any } }) => {
        return { ...item, remark: item.team.remark }
      })
      totals.value = total
      console.log(state.tableData[0].belongId)
      for (let i = 0; i < state.tableData.length; i++) {
        if (state.tableData[i].belongId === store.workspaceData.id) {
          state1.tableData.push(state.tableData[i])
        } else {
          state2.tableData.push(state.tableData[i])
        }
      }
      console.log('创建的：', state1.tableData, '加入的：', state2.tableData)

      console.log('查询单位成功', data)
    }
  }
  const handleDelete = (id: any) => {
    let token = sessionStorage.getItem('TOKEN')
    $services.company
      .companyDelete({
        data: {
          id: id
        },
        headers: {
          Authorization: token
        }
      })
      .then((res: any) => {
        console.log('删除单位成功', res)
        fetchRequest(offset1.value, pageSize.value)
      })
  }

  // function handleSizeChange(pageSize) {
  //   //改变当前每页的个数
  //   pageSize4 = pageSize

  // }
  // function handleCurrentChange(pageNum) {
  //   //改变当前页码
  //   currentPage4 = pageNum

  // }
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
      .createdBottom {
        position: absolute;
        right: 30px;
        bottom: 30px;
      }
    }
  }
</style>
