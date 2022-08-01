<template>
  <div class="cohort-wrap">
    <!-- 导航传送门 -->
    <teleport v-if="isShowMenu" to="#menu-teleport-target">
      <el-aside class="custom-group-silder-menu" width="220px">
        <GroupSideBarVue v-model:active="activeInfo" />
      </el-aside>
    </teleport>
    <!-- 右侧展示主体 -->
    <div class="chart-page">
      <!-- 头部 -->
      <GroupHeaderVue
        :info="selectInfo"
        v-show="activeInfo?.id"
        @viewDetail="handleViewDetail"
        class="chart-header"
      />
      <!-- 聊天区域 -->
      <GroupContent class="chart-content" />
      <!-- 输入区域 -->
      <GroupInputBox class="chart-input" @submitInfo="submit" />
    </div>
    <GroupDetail :id="activeInfo.id" :info="selectInfo.detail" v-if="isShowDetail" />
  </div>
</template>

<script lang="ts" setup>
  import API from '@/services'
  import { onMounted, reactive, ref, watch } from 'vue'
  import GroupSideBarVue from './components/groupSideBar.vue'
  import GroupHeaderVue from './components/groupHeader.vue'
  import GroupInputBox from './components/groupInputBox.vue'
  import GroupContent from './components/groupContent.vue'
  import GroupDetail from './components/groupDeatil.vue'
  // 是否展示导航
  const isShowMenu = ref<boolean>(false)
  const isShowDetail = ref<boolean>(false)

  // 记录所选聊天对象---群或者人
  const activeInfo = ref<any>({})
  let selectInfo = reactive({ detail: {}, userList: [], total: 0 })

  onMounted(() => {
    isShowMenu.value = true
  })
  // 监听所选聊天对象
  watch(
    () => activeInfo.value,
    (val) => {
      const { typeName, id, team = {} } = val
      if (typeName === '人员') {
        selectInfo.detail = val
        selectInfo.total = 0
        selectInfo.userList = []
      } else if (typeName === '群组') {
        selectInfo.detail = team
        getQunPerson(id)
      }
    }
  )

  // 展示详情页
  const handleViewDetail = (data) => {
    isShowDetail.value = !isShowDetail.value
  }

  // 获取群成员
  const getQunPerson = async (id: string) => {
    const { data, err } = await API.cohort.getPersons({
      data: {
        id,
        offset: 0,
        limit: 10
      }
    })
    if (!err) {
      const { total = 0, result = [] } = data
      selectInfo.total = total
      selectInfo.userList = result
    }
  }
  const submit = (value) => {
    console.log('发送消息', value.value)
  }
</script>

<style lang="scss">
  .custom-group-silder-menu.el-aside {
    height: 100%;
  }
</style>
<style lang="scss" scoped>
  .cohort-wrap {
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    justify-content: space-between;
    background-color: #fff;

    .chart-page {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      overflow: hidden;

      .chart-header {
        height: 80px;
        box-shadow: 0 1px 2px 1px #e5e5e5;
        z-index: 2;
      }

      .chart-content {
        flex-grow: 1;
        overflow-y: auto;
        background-color: #fff;
      }

      .chart-input {
        height: max-content;
        min-height: 120px;

        .el-textarea__inner {
          color: #fff;
        }
      }
    }
  }
</style>
