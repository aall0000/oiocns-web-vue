<template>
  <div class="created">
    <div class="createdTop">
      <div class="topLeft">
        <el-input class="search" placeholder="搜索单位名" :suffix-icon="Search" />
      </div>
      <div class="topRight">
        <el-button type="primary" @click="create"> 创建集团</el-button>
        <el-button>批量导入/导出</el-button>
        <el-button>查看申请记录</el-button>
      </div>
    </div>
    <div class="createdBody">
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
    <div class="createdBottom">
      <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import $services from '@/services'
  import { onMounted, reactive, ref } from 'vue'

  let dialogVisible = ref(false)
  props: 'type'
  const form = reactive({
    name: '',
    code: '',
    teamName: '',
    teamCode: '',
    teamRemark: ''
  })
  const handleDelete = (id) => {
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
      .then((res) => {
        console.log('删除集团成功', res)
        fetchRequest()
      })
  }
  const create = () => {
    dialogVisible.value = true
    console.log(dialogVisible)
  }
  const save = () => {
    let token = sessionStorage.getItem('TOKEN')
    $services.company
      .createGroup({
        data: {
          name: form.name,
          code: form.code,
          teamName: form.teamName,
          teamCode: form.teamCode,
          teamRemark: form.teamRemark
        },
        headers: {
          Authorization: token
        }
      })
      .then((res) => {
        console.log('成功创建集团', res)
        dialogVisible.value = false
        fetchRequest()
      })
  }

  onMounted(() => {
    fetchRequest()
  })

  const state = reactive({ tableData: [] })

  async function fetchRequest() {
    let token = sessionStorage.getItem('TOKEN')
    const { data, err } = await $services.company.companyGetGroups({
      data: {
        offset: 0,
        limit: 10
      },
      headers: { Authorization: token }
    })
    if (!err) {
      const { result, total } = data
      state.tableData = result.map((item) => {
        return { ...item, remark: item.team.remark }
      })

      console.log('查询集团成功', data)
    }

    // .then(res => {
    //   console.log('查询加入的集团', res);
    //   // for(let i = 0; i < res.data.result.length; i++ ){
    //   //   tableData[i].num=res.data.result[i].id;
    //   //   tableData[i].code=res.data.result[i].code;
    //   //   tableData[i].name=res.data.result[i].name;
    //   //   tableData[i].remark=res.data.result[i].team.remark;
    //   //   tableData[i].admin=res.data.result[i].belongId;
    //   //   tableData[i].time=res.data.result[i].createTime;
    //   // }
    //   state.tableData= res.result.map(item=>{
    //     return {...item,remark:item.team.remark}
    //   })
    //   console.log(state.tableData);

    // })
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
