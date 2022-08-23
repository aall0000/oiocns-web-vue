<template>
  <div class="cardLayout">
    <div class="cardtop">
      <div class="cardtop-img"><HeadImg name="测试市场" label="" type="circle"></HeadImg> </div>
      <div class="cardtop-box">
        <div class="cardtop-box__name">测试市场</div>
        <div class="cardtop-box__content"
          >使用对象：财政、主管部门 内容：审批、以及查询分析功能撒阿萨大大萨达萨达萨达撒</div
        >
      </div>
    </div>
    <div class="cardfooter">
      <div class="cardfooter-left"> 退出市场 </div>
      <div class="divide"></div>
      <div class="cardfooter-right">用户管理</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import HeadImg from '@/views/Chat/components/headImg.vue'
</script>

<style lang="scss" scoped>
  .divide {
    width: 1px;
    height: 16px;
    background: #e8e8e8;
  }
  .cardLayout {
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.09);
    border-radius: 2px;
    border: 1px solid #e9e9e9;
    display: flex;
    flex-direction: column;
  }
  .cardfooter {
    width: 100%;
    flex: 1;
    background: #f7f7f7;
    border-radius: 0px 0px 2px 2px;
    border: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: space-around;
    &-left {
      cursor: pointer;
      &:hover {
        color: #0f39d1;
      }
    }
    &-right {
      cursor: pointer;
      &:hover {
        color: #0f39d1;
      }
    }
  }
  .cardtop {
    display: flex;
    width: 100%;
    height: 70%;
    &-img {
      margin: 24px 16px 0 24px;
    }
    &-box {
      &__name {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        margin-top: 24px;
        margin-bottom: 12px;
      }
      &__content {
        height: 42px;
        display: -webkit-box; //谷歌
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; //显示几行
        overflow: hidden;

        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        margin-right: 20px;
      }
    }
  }
</style>
