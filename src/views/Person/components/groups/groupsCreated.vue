<template>
  <div class="created">
    <div class="createdTop">
      <div class="topLeft">
        <el-input


          class="search"
          placeholder="搜索单位名"
          :suffix-icon="Search"
        />
      </div>
      <div class="topRight">
          <el-button type="primary"> 创建集团</el-button>
          <el-button >批量导入/导出</el-button>
          <el-button >查看申请记录</el-button>
      </div>
    </div>
    <div class="createdBody">
      <el-table :data="tableData" stripe style="width: 98%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="序号"  />
        <el-table-column prop="num" label="集团编码"  />
        <el-table-column prop="isMain" label="集团名称" />
        <el-table-column prop="admin" label="集团描述" />
        <el-table-column prop="time" label="管理单位" />
        <el-table-column prop="state" label="加入时间" />
        <el-table-column prop="option" label="操作" >
          <template #default="scope">

            <el-button
              size="small"
              type="danger"

              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="createdBottom">
      <el-pagination
        :page-size="20"
        :pager-count="11"
        layout="prev, pager, next"
        :total="1000"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import $services from '@/services'

let dialogVisible = ref(false)
const form =reactive({
  name:'',
  code:'',
  teamName:'',
  teamCode:'',
  teamRemark:''
})
const create = () =>{
  dialogVisible.value = true
  console.log(dialogVisible)
}
const save = () =>{
  let token = sessionStorage.getItem("TOKEN")
    $services.company.createGroup({
      "data": {
        'name': form.name,
        'code':form.code,
        'teamName':form.teamName,
        'teamCode':form.teamCode,
        'teamRemark':form.teamRemark,
      },
      "headers":{
        "Authorization":token
        }
    }).then(res => {
      console.log('查询该单位详细信息', res);
    })
}

const tableData = [
  {
    name:'1',
    num:'Y0001',
    isMain:'资产云开放协同创新中心集团',
    admin:'这是对集团的描述',
    time:'管理单位名称',
    state:"2022-7-26 :44:37",

  },
  {
    name:'2',
    num:'Y0001',
    isMain:'资产云开放协同创新中心集团',
    admin:'这是对集团的描述',
    time:'管理单位名称',
    state:"2022-7-26 :44:37",

  },
  {
    name:'3',
    num:'Y0001',
    isMain:'资产云开放协同创新中心集团',
    admin:'这是对集团的描述',
    time:'管理单位名称',
    state:"2022-7-26 :44:37",

  },
  {
    name:'4',
    num:'Y0001',
    isMain:'资产云开放协同创新中心集团',
    admin:'这是对集团的描述',
    time:'管理单位名称',
    state:"2022-7-26 :44:37",

  },
  {
    name:'5',
    num:'Y0001',
    isMain:'资产云开放协同创新中心集团',
    admin:'这是对集团的描述',
    time:'管理单位名称',
    state:"2022-7-26 :44:37",

  },
  {
    name:'6',
    num:'Y0001',
    isMain:'资产云开放协同创新中心集团',
    admin:'这是对集团的描述',
    time:'管理单位名称',
    state:"2022-7-26 :44:37",

  },

]
</script>
<style lang="less">
.created{
  width: 100%;
  height: 100vh;

  .createdTop{
    width: 95%;
    margin: 30px;
    display: flex;
    justify-content: space-between;
    .topLeft{

      .search{

      }
    }
  }
  .createdBody{
    margin: 30px;
  }
  .createdBottom{
    position: absolute;
    right: 30px;
    bottom: 30px;

  }
}
</style>
