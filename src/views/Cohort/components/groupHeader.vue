<template>
  <div class="group-header-wrap">
    <ul class="user flex">
      <img class="user-img" src="@/assets/img/toux.jpg" alt="" srcset="" />
      <li class="user-info">
        <div class="user-info-top flex">
          <p class="user-info-top-name">{{ info.detail.name }}</p>
          <el-tag size="small" v-if="info.detail?.remark">{{ info.detail.remark }}</el-tag>
        </div>
        <div class="user-info-num" v-show="info.total">
          <el-icon><User /></el-icon> {{ info.total }}
        </div>
      </li>
    </ul>
    <span class="btn-box">
      <el-icon class="add-btn btn" :size="20" @click="handleAddFun()">
        <Plus />
      </el-icon>
      <el-icon class="detail-btn btn" :size="20" @click="handleMoreFun()">
        <More />
      </el-icon>
    </span>
  </div>
</template>
<script lang="ts" setup>
  const { info } = defineProps({
    info: {
      type: Object,
      default: {}
    }
  })
  const emit = defineEmits(['viewDetail', 'addUserOrCohort'])

  const handleMoreFun = () => {
    emit('viewDetail')
  }

  const handleAddFun = () => {
    emit('addUserOrCohort')
  }
</script>

<style lang="scss" scoped>
  .group-header-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .btn-box {
      .btn {
        margin-right: 10px;
      }
      .add-btn {
        cursor: pointer;
      }
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
