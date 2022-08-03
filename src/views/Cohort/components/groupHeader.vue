<template>
  <div class="group-header-wrap">
    <ul class="user flex">
      <img class="user-img" src="@/assets/img/toux.jpg" alt="" srcset="" />
      <li class="user-info">
        <div class="user-info-top flex">
          <p class="user-info-top-name">{{ info.detail.name }}</p>
          <el-tag size="small">标签</el-tag>
        </div>
        <div class="user-info-num" v-show="info.total">
          <el-icon>
            <User />
          </el-icon> {{ info.total }}
        </div>
      </li>
    </ul>
    <span class="btn-box">{{info?.detail?.typeName}}
      <el-icon class="add-btn btn" v-if="info?.detail?.typeName !== '人员'" :size="20" @click="handleAddFun()">
        <Plus />
      </el-icon>
      <el-icon class="detail-btn btn" :size="20" @click="handleMoreFun()">
        <More />
      </el-icon>
    </span>
  </div>

  <el-dialog v-model="dialogVisible" title="邀请好友" width="30%">
    <span>此处邀请好友</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
type prop = {
  info: any
}
const { info } = defineProps<prop>()
const emit = defineEmits(['viewDetail', 'addUserOrCohort'])

const handleMoreFun = () => {
  emit('viewDetail')
}
const dialogVisible = ref(false)
const handleAddFun = () => {
  // emit('addUserOrCohort')
  console.log('测试', info.detail);

  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.group-header-wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
  min-height: 70px;
  box-shadow: 0 1px 2px 1px #e5e5e5;
  // z-index: 2;

  .btn-box {
    .btn {
      margin-right: 10px;
    }

    // .add-btn {
    // }
  }
}

.user {
  align-items: center;

  &-img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
    border-radius: 50%;
  }

  &-info {
    &-top {
      align-items: center;

      &-name {
        font-size: 16px;
        font-weight: 600;
        margin-right: 10px;
      }
    }
  }
}
</style>
