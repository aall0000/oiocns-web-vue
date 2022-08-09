<template>
  <div class="manageSystem">
    <div class="manageSystem-title">轻松上⼿后台管理</div>
    <div class="content">
      <div
        class="contentBox"
        v-for="(item, index) in dataList"
        :key="index"
        @click="gotoRouter(item)"
      >
        <img src="@/assets/img/work_big.png" alt="" />
        <div class="textBox">
          <div class="textBox-top">{{ item.name }}</div>
          <div class="textBox-btm">{{ item.introduce }}</div>
        </div>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  const dataList = reactive([
    {
      img: 'work_big',
      name: '去办“事”',
      introduce: '专属⼯作台。在这⾥查看待办，完成⼯作',
      src: '/thing'
    },
    {
      name: '管理“物”',
      introduce: '探索应⽤，⾼效管理'
    },
    {
      name: '查看“群”',
      introduce: '查看群消息，完善群架构',
      src: '/chat'
    },
    {
      name: '完善“⼰”',
      introduce: '完善信息设置，切换个⼈与⼯作空间'
    }
  ])
  const router = useRouter()
  const gotoRouter = (data: any) => {
    router.push(data.src)
  }
</script>

<style lang="scss" scoped>
  .el-icon {
    position: absolute;
    right: 5%;
  }
  .content {
    flex: 1;
    width: 100%;
  }
  .textBox {
    margin-left: 20px;
    &-top {
      margin-bottom: 10px;
    }
    &-btm {
    }
  }
  .manageSystem {
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    &-title {
      font-size: 18px;
      border-bottom: 1px solid rgb(232, 232, 232);
      font-weight: 600;
      padding: 20px;
    }
  }
  .contentBox {
    position: relative;
    cursor: pointer;
    margin: 20px auto;
    width: 90%;
    height: 75px;
    border: 1px solid rgb(233, 233, 233);
    display: flex;
    align-items: center;
    padding: 20px;
    img {
      width: 20px;
      height: 20px;
    }
  }
</style>
