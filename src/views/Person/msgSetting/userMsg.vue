<template>
  <div class="userMsg">
    <div class="pageHeader">
      <el-breadcrumb separator="/" class="header">
        <el-breadcrumb-item :to="{ path: '/userMsg' }">己</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/userMsg">信息设置</a></el-breadcrumb-item>
      </el-breadcrumb>
      <div class="title">个人信息</div>
    </div>
    <div class="body">
      <div class="bodyLeft">
        <el-form
          class="form1"
          :inline="true"
          :label-position="labelPosition"
          label-width="100px"
          :model="formLabelAlign"
          style="max-width: 800px"
        >
          <el-form-item label="姓名">
            <el-input v-model="formLabelAlign.name" />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="formLabelAlign.idCardNum" />
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="formLabelAlign.jobId" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formLabelAlign.tel" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formLabelAlign.email" />
          </el-form-item>
        </el-form>
        <el-form
          class="form2"
          :label-position="labelPosition"
          label-width="100px"
          :model="formLabelAlign"
          style="max-width: 800px"
        >
          <el-form-item label="省市区" prop="selectedOptions">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input
              v-model="formLabelAlign.Profile"
              :rows="2"
              type="textarea"
              placeholder="个人简介"
            />
          </el-form-item>
        </el-form>
        <div class="button">
          <el-button> + 新增更多描述</el-button>
          <el-popconfirm title="确认更新" @confirm="update()">
            <template #reference>
              <el-button type="primary">更新信息</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
      <div class="bodyRight">
        <div class="touX">
          <span>头像</span>
          <img class="image" src="../../../assets/img/toux.jpg" alt="" />
        </div>
        <div class="up">
          <el-icon><Upload /></el-icon>
          <span>上传文件</span>
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
  import console from 'console'
  import { useUserStore } from '@/store/user'
  const store = useUserStore()
  const labelPosition = ref<'top'>('top')

  const formLabelAlign = reactive({
    name: '',
    idCardNum: '',
    jobId: '',
    tel: '',
    email: '',
    country: '',
    Profile: ''
  })

  onBeforeMount(() => {
    fetchRequest()
  })

  function fetchRequest() {
    let token = sessionStorage.getItem('TOKEN')
    $services.person
      .queryInfo({
        data: {},
        headers: { Authorization: token }
      })
      .then((res: any) => {
        console.log('查询人员信息', res)
        formLabelAlign.name = res.data.name
        formLabelAlign.idCardNum = res.data.id
        formLabelAlign.jobId = res.data.thingId
        formLabelAlign.tel = res.data.team.code
        formLabelAlign.Profile = res.data.team.remark
        formLabelAlign.Profile = res.data.team.remark
        formLabelAlign.Profile = res.data.team.remark
        formLabelAlign.Profile = res.data.team.remark
      })
  }
  const update = () => {
    let token = sessionStorage.getItem('TOKEN')
    $services.person
      .update({
        data: {
          id: store.queryInfo.id,
          name: formLabelAlign.name,
          code: formLabelAlign.idCardNum,
          thingId: store.queryInfo.thingId,
          belongId: store.queryInfo.id,
          teamName: formLabelAlign.name,
          teamCode: formLabelAlign.tel,
          teamRemark: formLabelAlign.Profile,
          teamAuthId: store.queryInfo.team.authId
        },
        headers: { Authorization: token }
      })
      .then((res: any) => {
        console.log('更新个人信息成功', res)
      })
  }

  const options = regionData
  const selectedOptions: Array<number> = []
  const handleChange = () => {
    var loc = ''
    for (let i = 0; i < selectedOptions.length; i++) {
      loc += CodeToText[selectedOptions[i]]
    }
    alert(loc)
  }
</script>
<style lang="scss" scoped>
  .userMsg {
    height: calc(100vh - 70px);
    .pageHeader {
      width: 100%;
      height: 70px;
      background-color: #fff;
      .header {
        margin-top: 20px;
        margin-left: 30px;
      }
      .title {
        padding-top: 10px;
        margin-left: 30px;
        font-size: 25px;
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
        width: 60%;

        .form1 {
          width: 80%;
          margin-left: 80px;
          margin-top: 20px;
          font-weight: 600;
          .el-input {
            width: 350px;
          }
        }
        .form2 {
          width: 80%;
          margin-left: 80px;
          font-weight: 600;
          .el-input {
            width: 400px;
          }
        }
        .button {
          margin-top: 30px;
          margin-left: 80px;
        }
      }
      .bodyRight {
        height: 100%;
        width: 40%;

        .touX {
          width: 220px;
          display: flex;
          margin-top: 50px;
          .image {
            width: 180px;
          }
        }
        .up {
          display: flex;
          align-items: center;
          width: 110px;
          height: 30px;
          padding-left: 12px;
          border: 1px solid #aaa;
          line-height: 30px;
          margin-left: 75px;
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
