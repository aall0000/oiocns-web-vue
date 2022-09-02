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
                    <el-dropdown-item @click="invite(cohort)"><el-icon><User /></el-icon>邀请成员</el-dropdown-item>
                    <el-dropdown-item @click="toAuth(cohort)"><el-icon><Edit /></el-icon>角色管理</el-dropdown-item>
                    <el-dropdown-item @click="toIndentity(cohort)"><el-icon><Avatar /></el-icon>身份管理</el-dropdown-item>
                    <el-dropdown-item @click="moveAuth(cohort)"><el-icon><Switch /></el-icon>转移权限</el-dropdown-item>
                    <el-dropdown-item @click="exit(cohort)"><el-icon><Remove /></el-icon>退出群聊</el-dropdown-item>
                    <el-dropdown-item @click="deleteCohort(cohort)"><el-icon><Delete /></el-icon>解散群聊</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>

          <div class="content">{{cohort.code}}</div>
          <div class="description">{{cohort.team?.remark}}</div>

          <el-divider />

          <!-- <div class="avatar-container" :title="'8888888888888'">
            <el-avatar class="avatar" :size="20" :src="'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'" />
          </div>
          <div class="avatar-container" :title="'77777777777'">
            <el-avatar class="avatar" :size="20" :src="'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'" />
          </div>
          <div class="avatar-container" :title="'666666666666666'">
            <el-avatar class="avatar" :size="20" :src="'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'" />
          </div> -->
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
</template>

<script lang="ts" setup>
import $services from '@/services'
import { ref, onMounted, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router';

const { queryInfo } = useUserStore()
const router = useRouter()

const mode = ref('card')
const state = reactive({
  cohorts: [],
})

// 获取我加入的群列表
const getCohorts = async () => {
  const res = await $services.cohort.getJoinedCohorts({ data: { offset: 0, limit: 10000 } })
  const { data, success } = res
  console.log(res)
  if (success) {
    state.cohorts = data.result
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

// 邀请成员
const invite = (cohort: any)=>{

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

}

// 退出群聊
const exit = (cohort: any)=>{

}

// 删除群聊
const deleteCohort = (cohort: any)=>{

}

onMounted(() => {
  getCohorts()
  console.log(queryInfo)
})


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
