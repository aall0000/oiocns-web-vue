<template>
  <div class="group-header-wrap ">
    <ul class="user flex">
      <img class="user-img" src="@/assets/img/toux.jpg" alt="" srcset="">
      <li class="user-info">
        <div class="user-info-top flex">
          <p class="user-info-top-name">群名称</p>
          <el-tag size="small">群标签</el-tag>
        </div>
        <div class="user-info-num"><el-icon><User /></el-icon> 500</div>
      </li>
    </ul>

    <span class="user-add" @click="addUserFun">
      <el-icon :size="20">
        <Plus />
      </el-icon>
    </span>
  </div>
</template>

<script lang="ts" setup name="groupHeader">
const emit = defineEmits(['addUser'])

const addUserFun = () => {
  console.log('天机');

  emit('addUser', 1)
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

  &-add {}
}
</style>
