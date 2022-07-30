<template>
  <div class="UnitMsg">
    <div class="pageHeader">
      <el-breadcrumb separator="/" class="header">
        <el-breadcrumb-item :to="{ path: '/userMsg' }">己</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/userMsg">信息设置</a></el-breadcrumb-item>

      </el-breadcrumb>
      <div class="title">单位信息</div>
    </div>
    <div class="body">
      <div class="bodyLeft">
        <el-form
          class="form1"
          :inline="true"
          :label-position="labelPosition"
          label-width="100px"
          style="max-width:1500px"
          :model="formLabelAlign"

        >
          <el-form-item label="单位名称">
            <el-input v-model="formLabelAlign.name" />
          </el-form-item>
          <el-form-item label="单位类型">
            <el-select class="select" v-model="formLabelAlign.type"  placeholder="Select">
              <el-option

                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="统一社会信用代码">
            <el-input v-model="formLabelAlign.jobId" />
          </el-form-item>
          <el-form-item label="单位编码">
            <el-input v-model="formLabelAlign.tel" />
          </el-form-item>
          <el-form-item label="区划名称">
            <el-input v-model="formLabelAlign.email" />
          </el-form-item>
          <el-form-item label="区划编码">
            <el-input v-model="formLabelAlign.email" />
          </el-form-item>
          <el-form-item label="单位联系人">
            <el-input v-model="formLabelAlign.email" />
          </el-form-item>
          <el-form-item label="法人代表">
            <el-input v-model="formLabelAlign.email" />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="formLabelAlign.email" />
          </el-form-item>
          <el-form-item label="单位地址" prop="selectedOptions">
            <el-cascader
              style="width: 400px;"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            >
            </el-cascader>
          </el-form-item>
        </el-form>

        <div class="button">
          <el-button> + 新增更多描述</el-button>
          <el-button>导出单位信息</el-button>
          <el-button type="primary">更新信息</el-button>
        </div>
      </div>

    </div>
    <div class="bottom">
      <span class="content">Copyright @2021 资产云开放协同创新中心 主办单位：浙江省财政厅</span>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { regionData, CodeToText } from 'element-china-area-data'
import { onMounted, reactive, ref } from 'vue'
import { onBeforeMount } from 'vue'
import $services from '@/services'
const labelPosition = ref('top')

const formLabelAlign = reactive({
  name: '',
  idCardNum: '',
  jobId: '',
  tel: '',
  type:'',
  email: '',
  country: '',
  Profile: '',
})

onBeforeMount(()=>{
  fetchRequest()
})
function fetchRequest(){
    let token = sessionStorage.getItem("WorkTOKEN")
    $services.company.queryInfo({
      "data": {},"headers":{"Authorization":token}
    }).then(res => {
      console.log('查询该单位详细信息', res);
      // formLabelAlign.name=res.data.team.name
      // formLabelAlign.idCardNum=res.data.id
      // formLabelAlign.jobId=res.data.thingId
      // formLabelAlign.tel=res.data.team.code

      // formLabelAlign.Profile=res.data.team.remark
    })
}


const options = regionData
const selectedOptions:Array<number> = []
const handleChange = () =>{
  var loc = "";
  for (let i = 0; i < selectedOptions.length; i++) {
    loc += CodeToText[selectedOptions[i]];
  }
  alert(loc);
}
</script>
<style lang="less" scoped  >
.UnitMsg{
  height: calc(100vh - 70px);
  .pageHeader{
    width: 100%;
    height: 70px;
    background-color: #fff;
    .header{
      margin-top: 20px;
      margin-left: 30px;
    }
    .title{
      padding-top: 10px;
      margin-left: 30px;
      font-size: 25px;
      font-weight: 600;
    }
  }
  .body{
    height: 600px;
    width: 100%;
    border-left: 10px solid #eff0f4 ;
    border-top: 16px solid #eff0f4 ;
    border-right: 16px solid #eff0f4 ;
    display: flex;
    .bodyLeft{

      height: 100%;
      width: 100%;

      .form1{
        width: 100%;
        margin-left:80px;
        margin-top: 20px;
        font-weight: 600;
        .el-input {

          width: 400px;

        }
        .select{
          width: 400px;
        }
      }

      .button{
        margin-top: 150px;
        margin-left:80px;
      }
    }

  }
  .bottom{
    height: calc(100vh - 760px);
    background-color: #eff0f4;
    display: flex;
    .content{
      margin: auto;
      color: #aaa;
    }
  }
}
</style>
