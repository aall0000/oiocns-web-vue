<template>
  <div class="UnitMsg">
    <div class="pageHeader">
      <div class="title">单位信息</div>
    </div>
    <el-scrollbar class="scrollbar">
      <div class="body">
        <el-form
          class="form1"
          :inline="true"
          :label-position="labelPosition"
          label-width="100px"
          style="max-width: 1400px"
          :model="formLabelAlign"
        >
          <el-form-item label="单位名称">
            <el-input v-model="formLabelAlign.name" />
          </el-form-item>
          <!-- <el-form-item label="单位类型">
            <el-select class="select" v-model="formLabelAlign.type" placeholder="股份有限公司">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="单位名称">
            <el-input v-model="formLabelAlign.code" />
          </el-form-item>
          <el-form-item label="社会信用代码">
            <el-input v-model="formLabelAlign.code" />
          </el-form-item>
          <el-form-item label="单位简称">
            <el-input v-model="formLabelAlign.teamName" />
          </el-form-item>
          <el-form-item label="单位标识代码">
            <el-input v-model="formLabelAlign.teamCode" />
          </el-form-item>
          <el-form-item label="单位简介">
            <el-input v-model="formLabelAlign.teamRemark" />
          </el-form-item>
        </el-form>

        <div class="button">
          <el-button> + 新增更多描述</el-button>
          <el-button>导出单位信息</el-button>
          <el-button type="primary">更新信息</el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
  import { ArrowLeft } from '@element-plus/icons-vue'
  //import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
  import { onMounted, reactive, ref } from 'vue'
  import { onBeforeMount } from 'vue'
  import $services from '@/services'
  const labelPosition = ref<'top'>('top')
  const formLabelAlign = reactive({
    name: '',
    code: '',
    teamName: '',
    teamCode: '',
    teamRemark: '',
  })

  onBeforeMount(() => {
    fetchRequest()
  })
  function fetchRequest() {
    let token = sessionStorage.getItem('WorkTOKEN')
    $services.company
      .queryInfo({
        data: {},
        headers: { Authorization: token }
      })
      .then((res: ResultType) => {
        if (res.success) {
          formLabelAlign.name = res.data.name
          formLabelAlign.code = res.data.code
          formLabelAlign.teamName = res.data.team.name
          formLabelAlign.teamCode = res.data.team.code
          formLabelAlign.teamRemark = res.data.team.remark
        }
      })
  }

  // const options = regionData
  // const selectedOptions: Array<number> = []
  // const handleChange = () => {
  //   var loc = ''
  //   for (let i = 0; i < selectedOptions.length; i++) {
  //     loc += CodeToText[selectedOptions[i]]
  //   }
  //   alert(loc)
  // }
</script>
<style lang="scss" scoped>
  .UnitMsg {
    height: calc(100vh - 235px);
    background-color: #eff0f4;

    .pageHeader {
      width: 100%;
      height: 10%;
      background-color: #fff;
      .header {
        margin-top: 20px;
        margin-left: 30px;
      }
      .title {
        padding-top: 20px;
        margin-left: 30px;
        font-size: 20px;
        font-weight: 600;
      }
    }
    .scrollbar {
      width: 100%;
      height: 90%;
      .body {
        height: 100%;
        width: 100%;
        background-color: #fff;
        border-left: 10px solid #eff0f4;
        border-top: 16px solid #eff0f4;
        border-right: 16px solid #eff0f4;

        .form1 {
          width: 100%;
          padding-left: 80px;
          padding-top: 30px;
          font-weight: 600;
          .el-input {
            width: 400px;
          }
          .select {
            width: 400px;
          }
        }

        .button {
          margin-top: 30px;
          margin-left: 80px;
          padding-bottom: 30px;
        }
      }
    }
  }
</style>
