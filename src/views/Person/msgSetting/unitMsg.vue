<template>
  <div class="UnitMsg">
    <div class="pageHeader">
      <div class="title">单位信息</div>
    </div>
    <div class="body">
      <div class="bodyLeft">
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
          <el-form-item label="单位类型">
            <el-select class="select" v-model="formLabelAlign.type" placeholder="股份有限公司">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="统一社会信用代码">
            <el-input v-model="formLabelAlign.code" />
          </el-form-item>
          <el-form-item label="单位编码">
            <el-input v-model="formLabelAlign.companyCode" />
          </el-form-item>
          <el-form-item label="区划名称">
            <el-input v-model="formLabelAlign.divisionName" />
          </el-form-item>
          <el-form-item label="区划编码">
            <el-input v-model="formLabelAlign.divisionCode" />
          </el-form-item>
          <el-form-item label="单位联系人">
            <el-input v-model="formLabelAlign.contactPerson" />
          </el-form-item>
          <el-form-item label="法人代表">
            <el-input v-model="formLabelAlign.legalRepresentative" />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="formLabelAlign.tel" />
          </el-form-item>
          <!-- <el-form-item label="单位地址" prop="selectedOptions">
            <el-cascader
              style="width: 400px"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            >
            </el-cascader>
          </el-form-item> -->
        </el-form>

        <div class="button">
          <el-button> + 新增更多描述</el-button>
          <el-button>导出单位信息</el-button>
          <el-button type="primary">更新信息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ArrowLeft } from '@element-plus/icons-vue'
  //import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
  import { onMounted, reactive, ref } from 'vue'
  import { onBeforeMount } from 'vue'
  import $services from '@/services'
  const labelPosition = ref<'top'>('top')
  const options2 = [
    {
      value: '有限责任公司',
      label: '有限责任公司'
    },
    {
      value: '股份有限公司',
      label: '股份有限公司'
    }
  ]
  const formLabelAlign = reactive({
    name: '',
    type: '',
    code: '',
    companyCode: '',
    divisionName: '杭州市',
    divisionCode: '323300',
    contactPerson: '',
    legalRepresentative: '',
    tel: '15315587896',
    address: '杭州市'
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
      .then((res: any) => {
        console.log('查询该单位详细信息', res)
        formLabelAlign.name = res.data.name
        formLabelAlign.type = res.data.team.typeName
        formLabelAlign.code = res.data.code
        formLabelAlign.companyCode = res.data.id
        // formLabelAlign.divisionName=res.data.team.name
        // formLabelAlign.divisionCode=res.data.team.name
        formLabelAlign.contactPerson = res.data.team.authId
        formLabelAlign.legalRepresentative = res.data.belongId
        // formLabelAlign.tel=res.data.team.name
        // formLabelAlign.address=res.data.team.name
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
    background-color: #fff;

    .pageHeader {
      width: 100%;
      height: 70px;
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
    .body {
      height: 600px;
      width: 100%;
      border-left: 10px solid #eff0f4;
      border-top: 16px solid #eff0f4;
      border-right: 16px solid #eff0f4;
      display: flex;
      .bodyLeft {
        height: 100%;
        width: 100%;

        .form1 {
          width: 100%;
          margin-left: 80px;
          margin-top: 20px;
          font-weight: 600;
          .el-input {
            width: 400px;
          }
          .select {
            width: 400px;
          }
        }

        .button {
          margin-top: 150px;
          margin-left: 80px;
        }
      }
    }
    .bottom {
      height: calc(100vh - 760px);
      background-color: #eff0f4;
      display: flex;
      .content {
        margin: auto;
        color: #aaa;
      }
    }
  }
</style>
