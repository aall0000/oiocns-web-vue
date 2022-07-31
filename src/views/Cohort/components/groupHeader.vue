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
    <span class="user-add" @click="handleMoreFun()">
      <el-icon :size="20">
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
  console.log('是是是', info)

  const emit = defineEmits(['viewDetail'])

  const handleMoreFun = () => {
    emit('viewDetail')
  }
</script>

<style lang="scss" scoped>
  .group-header-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }

  .user {
    align-items: center;

    &-img {
      width: 60px;
      height: 60px;
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

    &-add {
    }
  }
</style>
