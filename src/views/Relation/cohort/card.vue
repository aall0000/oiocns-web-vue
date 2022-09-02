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
                    <el-dropdown-item><el-icon><ChatRound /></el-icon>进入会话</el-dropdown-item>
                    <el-dropdown-item><el-icon><User /></el-icon>邀请成员</el-dropdown-item>
                    <el-dropdown-item><el-icon><CirclePlus /></el-icon>添加角色</el-dropdown-item>
                    <el-dropdown-item><el-icon><Avatar /></el-icon>创建身份</el-dropdown-item>
                    <el-dropdown-item><el-icon><Switch /></el-icon>转移权限</el-dropdown-item>
                    <el-dropdown-item><el-icon><Remove /></el-icon>退出群聊</el-dropdown-item>
                    <el-dropdown-item><el-icon><Delete /></el-icon>解散群聊</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>

          <div class="content">{{cohort.code}}</div>
          <div class="description">{{cohort.team?.remark}}</div>

          <el-divider />

          <div class="avatar-container" :title="'8888888888888'">
            <el-avatar class="avatar" :size="20" :src="'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'" />
          </div>
          <div class="avatar-container" :title="'77777777777'">
            <el-avatar class="avatar" :size="20" :src="'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'" />
          </div>
          <div class="avatar-container" :title="'666666666666666'">
            <el-avatar class="avatar" :size="20" :src="'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'" />
          </div>
          <div class="avatar-container" :title="'555555555'">
            <el-avatar class="avatar" :size="24" >
              <template #default>
                <div class="exceedCount">+5</div>
              </template>
            </el-avatar>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import $services from '@/services'
import { ref, onMounted, reactive } from 'vue'


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
  }
}

onMounted(() => {
  getCohorts()
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
  font-size: 14px;
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

</style>
