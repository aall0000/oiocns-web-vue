<template>
  <div class="baseLayout">
    <!-- <teleport v-if="isShowMenu" to="#menu-teleport-target">
      <el-aside class="custom-group-silder-menu" width="220px"><Menu></Menu></el-aside>
    </teleport> -->
    <div class="headers"><Head></Head></div>
    <div class="articleTop">
      <div class="articleTop-left"><Invitate></Invitate></div>
      <div class="articleTop-right"><Organization></Organization></div>
    </div>
    <div class="articleBtm">
      <div class="articleBtm-box">
        <div class="articleBtm-leftTop"><AppCommon @joinFriend="joinFriend"></AppCommon></div>
        <div class="articleBtm-leftBtm"><AppMarket></AppMarket></div>
      </div>
      <div class="articleBtm-right"><ManageSystem></ManageSystem></div>
    </div>
    <el-dialog v-model="dialogVisible" title="添加好友" width="30%">
      <el-select
        v-model="value"
        filterable
        remote
        reserve-keyword
        placeholder="请输入要查找的好友名"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFriends">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import Menu from '@/views/Layout/components/menu.vue'
  import Head from './components/head.vue'
  import Invitate from './components/invitate.vue'
  import Organization from './components/organization.vue'
  import AppMarket from './components/appMarket.vue'
  import AppCommon from './components/appCommon.vue'
  import ManageSystem from './components/manageSystem.vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'

  interface ListItem {
    value: string
    label: string
  }
  const isShowMenu = ref<boolean>(false)
  const options = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)
  onMounted(() => {
    isShowMenu.value = true
  })
  const remoteMethod = (query: string) => {
    if (query) {
      loading.value = true
      $services.person
        .searchPersons({
          data: {
            text: query,
            offset: 0,
            limit: 10
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            console.log(res)
            let states = res.data.result
            let arr: { value: any; label: any }[] = []
            states.forEach((el: any) => {
              let obj = {
                value: el.id,
                label: el.name
              }
              arr.push(obj)
            })
            console.log('====', options.value)
            options.value = arr
            loading.value = false
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    } else {
      options.value = []
    }
  }
  const submitFriends = () => {
    $services.person
      .applyJoin({
        data: {
          id: value.value
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '申请成功',
            type: 'warning'
          })
          dialogVisible.value = false
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }

  const dialogVisible = ref(false)
  const joinFriend = () => {
    dialogVisible.value = true
  }
</script>

<style lang="scss" scoped>
  :deep(.el-select) {
    width: 100%;
  }

  .baseLayout {
    height: 100%;
  }
  .headers {
    width: 100%;
    height: 15%;
  }
  .articleTop {
    display: flex;
    width: 100%;
    height: 20%;
    margin-top: 20px;
    &-left {
      width: 50%;
      height: 100%;
      margin-right: 20px;
    }
    &-right {
      width: 50%;
      height: 100%;
    }
  }
  .articleBtm {
    width: 100%;
    height: 60%;
    margin-top: 20px;
    display: flex;
    &-leftTop {
      width: 100%;
      height: 60%;
      margin-bottom: 20px;
    }
    &-leftBtm {
      flex: 1;
      width: 100%;
      height: 20%;
    }
    &-box {
      display: flex;
      flex-direction: column;
      width: 60%;
      height: 100%;
      margin-right: 20px;
    }
    &-right {
      width: 40%;
      height: 100%;
    }
  }
</style>
