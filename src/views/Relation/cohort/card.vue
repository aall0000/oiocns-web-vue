<template>
  <div class="container">

    <el-row :gutter="20">
      <el-col :span="6" v-for="cohort of state.cohorts">
        <el-card class="box-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{cohort.name}}</span>
              <el-dropdown>
                <el-button class="button" text><el-icon><MoreFilled /></el-icon></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="toChat(cohort)"><el-icon><ChatRound /></el-icon>进入会话</el-dropdown-item>
                    <el-dropdown-item v-if="props.type == '我创建'" @click="edit(cohort)"><el-icon><Edit /></el-icon>修改群组</el-dropdown-item>
                    <el-dropdown-item @click="invite(cohort)"><el-icon><User /></el-icon>邀请成员</el-dropdown-item>
                    <el-dropdown-item v-if="props.type == '我创建'" @click="toAuth(cohort)"><el-icon><Edit /></el-icon>角色管理</el-dropdown-item>
                    <el-dropdown-item v-if="props.type == '我创建'" @click="toIndentity(cohort)"><el-icon><Avatar /></el-icon>身份管理</el-dropdown-item>
                    <el-dropdown-item v-if="props.type == '我创建'" @click="moveAuth(cohort)"><el-icon><Switch /></el-icon>转移权限</el-dropdown-item>
                    <el-dropdown-item v-if="props.type == '我加入'" @click="exit(cohort)"><el-icon><Remove /></el-icon>退出群聊</el-dropdown-item>
                    <el-dropdown-item v-if="props.type == '我创建'" @click="deleteCohort(cohort)"><el-icon><Delete /></el-icon>解散群组</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>

          <div class="content">{{cohort.code}}</div>
          <div class="description">{{cohort.team?.remark}}</div>

          <el-divider />

          <!-- 无头像，暂时名字替代, Todo -->
          <div class="foot">
            <div v-for="(person, index) in cohort.persons" class="avatar-container" :title="person.name">
              <el-avatar class="avatar" :size="24" >
                <template #default>
                  <div class="exceedCount">{{person.name.substring(0, 1)}}</div>
                </template>
              </el-avatar>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <!-- 邀请成员加入群 -->
  <SearchUser v-if="searchDialog" :serachType="1" @closeDialog="searchDialog = false"  @checksSearch='checksSearch'/>

  <el-dialog v-model="editCohortDialog" title="创建群组" width="35%">
    <el-form-item label="群组名称">
      <el-input v-model="formData.name" placeholder="请输入群组名称" clearable />
    </el-form-item>
    <el-form-item label="群组编号">
      <el-input v-model="formData.code" placeholder="请输入群组编号" clearable />
    </el-form-item>
    <el-form-item label="群组简介">
      <el-input v-model="formData.remark" placeholder="请输入群组简介" type="textarea" clearable :rows="4" />
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="editCohortDialog = false">取消</el-button>
        <el-button type="primary" @click="update">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import $services from '@/services'
import { ref, onMounted, reactive, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router';
import SearchUser from '@/components/searchs/index.vue'
import { Service } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const { queryInfo } = useUserStore()
const router = useRouter()

let searchDialog = ref<boolean>(false)

const props = defineProps({
  type: {
    type: String
  }
})
// 当前操作的群组
let curCohort = ref<any>({})
const state = reactive({
  cohorts: [],
})

let formData = ref<any>({})

const editCohortDialog = ref(false)

// 获取我加入的群列表
const getCohorts = async () => {
  const res = await $services.cohort.getJoinedCohorts({ data: { offset: 0, limit: 10000 } })
  const { data, success } = res
  if (success) {
    if(props.type == '我创建'){
      state.cohorts = data.result.filter((d: any) => d.createUser == queryInfo.id)
    } else if(props.type == '我加入'){
      state.cohorts = data.result.filter((d: any) => d.createUser !== queryInfo.id)
    }
    for(const c of state.cohorts ){
      // 获取群组成员
      $services.cohort.getPersons({ data: { id: c.id, offset: 0, limit: 100000 } }).then((res: any) => {
        if(res.success){
          c.persons = res.data.result;
        } else {
          c.persons = []
        }
      })

    }
  }
}

// 进入会话
const toChat = (cohort: any)=>{
  router.push({ path: '/chat' })
}

// 修改群组信息
const edit = (cohort: any)=>{
  editCohortDialog.value = true
  curCohort.value = cohort
  formData.value = { name: cohort.name, code: cohort.code, remark: cohort.team?.remark }
}

const update = ()=>{
  const data = {
    id: curCohort.value.id,
    name: formData.value.name,
    code: formData.value.code,
    thingId: curCohort.value.thingId,
    belongId: curCohort.value.belongId,
    teamName: formData.value.name,
    teamCode: formData.value.code,
    teamRemark: formData.value.remark,
    teamAuthId: curCohort.value.team.authId,
  }
  $services.cohort.update({
      data
    }).then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '修改成功',
          type: 'success'
        })
        getCohorts()
      }
    })
}



// 选择人员后的回调
const checksSearch = (res: any)=>{
  if(res.value.length > 0){
    const targetIds = res.value.map((v: any) => v.id);
    $services.cohort.pullPerson({
      data: { id: curCohort.value.id, targetIds}
    }).then((res: any) =>{
      if(res.success){
        ElMessage.success('邀请人员成功！')
        getCohorts()
      } else {
        ElMessage.error('邀请人员失败！')
      }
    })
    searchDialog.value = false;
  } else {
    searchDialog.value = false;
  }
}

// 邀请成员
const invite = (cohort: any)=>{
  curCohort.value = cohort
  searchDialog.value = true
}

// 角色(职权)管理
const toAuth = (cohort: any)=>{
  router.push({
    path: '/relation/authority',
    query: {
      title: '群组',
      belongId: cohort.id,
      name: cohort.name,
      code: cohort.code,
      teamRemark: cohort.team?.remark
    }
  })
}

// 身份管理
const toIndentity = (cohort: any)=>{
  router.push({
    path: '/relation/identity',
    query: {
      title: '群组',
      belongId:  cohort.id,
      name: cohort.name,
    }
  })
}

// 转移权限
const moveAuth = (cohort: any)=>{
  ElMessage.warning('待开发。。。')
}

// 退出群聊
const exit = (cohort: any)=>{
  ElMessageBox.confirm(
    `确定退出 ${cohort.name} 群组吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    $services.cohort.exit({
      data: {
        id: cohort.id,
      }
    }).then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '退出成功',
          type: 'success'
        })
        getCohorts()
      }
    })
  })
}

// 删除群聊
const deleteCohort = (cohort: any)=>{
  ElMessageBox.confirm(
    `确定解散 ${cohort.name} 群组吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    $services.cohort.delete({
      data: {
        id: cohort.id,
      }
    }).then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '解散成功',
          type: 'success'
        })
        getCohorts()
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
}

onMounted(() => {
  getCohorts()
})

watch(props, () => {
  getCohorts()
});


</script>
<style lang="scss" scoped>
.container{
  height: 100%;
  width: 100%;
}

.box-card{
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}

.content{
  font-size: 16px;
  margin-bottom: 8px;
}
.description{
  font-size: 12px;
}

.avatar-container{
  display: inline-block;
  .avatar{
    margin-left: -8px;
    cursor: pointer;
    .exceedCount{
      padding-top: 0px;
    }
  }
}

.foot {
  display: flex;
}

</style>
