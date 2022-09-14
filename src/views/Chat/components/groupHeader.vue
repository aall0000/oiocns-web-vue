<template>
  <div class="group-header-wrap">
    <ul class="user flex">
      <HeadImg :name="orgChat.curChat.value?.name" :label="''"/>
      <li class="user-info">
        <div class="user-info-top flex">
          <p class="user-info-top-name">{{ orgChat.curChat.value?.name }}<span v-if="orgChat.curChat.value?.personNum > 0">({{ orgChat.curChat.value?.personNum }}人)</span></p>
          <el-tag size="small">{{orgChat.curChat.value?.label}}</el-tag>
        </div>
      </li>
    </ul>
    <span class="btn-box">
      <el-icon class="add-btn btn" v-if="orgChat.curChat.value?.typeName !== '人员'" :size="20" @click="handleAddFun()">
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
import HeadImg from '@/components/headImg.vue'
import { ref } from 'vue';
import orgChat from '@/hubs/orgchat'
const emit = defineEmits(['viewDetail', 'addUserOrCohort'])

const handleMoreFun = () => {
  emit('viewDetail')
}
const dialogVisible = ref(false)
const handleAddFun = () => {
  // emit('addUserOrCohort')
  // console.log('测试', info.detail);

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
  background-color: var(--el-bg-color);
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
