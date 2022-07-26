<template>
  <div class="head">
    <div class="thing-type">事</div>
    <div class="thing-mian">
      <div class="thing-setting">工作台</div>
      <el-input
        v-model="input2"
        class="w-50 m-2 input-class"
        placeholder="搜索应用"
      />
    </div>
  </div>
  <div class="work-card">
    <div class="card-head">
      <div class="title">任务卡片</div>
      <div class="view-details">查看详情</div>
    </div>
    <ul>
      <li>
        <p>我的待办</p>
        <p>0</p>
      </li>
      <li>
        <p>我的待办</p>
        <p>0</p>
      </li>
      <li>
        <p>我的待办</p>
        <p>0</p>
      </li>
      <li>
        <p>我的待办</p>
        <p>0</p>
      </li>
    </ul>
  </div>
  <div class="content">
    <div class="personal">
      <div class="head">
        <div class="personal-title">个人应用</div>
        <div class="personal-edit">管理</div>
      </div>
      <div class="app-list">
        <div class="app-item">
          <img src="./../assets/Group22.png" alt="">
          <div class="item-box">
            <span>添加更多应⽤</span>
          </div>
        </div>
         <div class="app-item">
          <img src="./../assets/Group22.png" alt="">
          <div class="item-box">
            <p>资产监管资产监管</p>
            <p>简单、⾼效、开放的监管⼯具</p>
          </div>
        </div>
      </div>
    </div>
    <div class="whole"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const input2 = ref('')
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .head{
    padding: 30px;
    .thing-type{
      font-size: 16px;
      color: #8d8d8d;
      margin-bottom: 15px;
    }
    .thing-mian{
      font-size: 24px;
      font-weight: bold;
      color: #333;
      display: flex;
      justify-content: space-between  ;
      .input-class{
        width: 200px;
      }
    }
  }
  .work-card{
    background: #f0f2f5;
    padding:20px;
    .card-head{
      background: #fff;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      padding:20px;
      .title{
        color: #333;
        font-size: 16px;
      }
      .view-details{
        font-size: 12px;
        color: #154ad8;
      }
    }
    ul{
      width: 100%;
      display: flex;
      background: #fff;
      li{
        width: 25%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #eee;
        margin: 30px 0;
        >p:nth-child(1){
          color: #ccc;
          margin-bottom: 20px;
        }
      }
      li:last-child{
        border-right:0
      }
    }
  }
  .content{
    background: #f0f2f5;
    padding:0 20px 20px;
    .personal{
       background: #fff;
       width: 50%;
       .head{
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #e8e8e8;
       }
       .app-list{
          width: 100%;
          overflow: hidden;
          padding: 20px;
          box-sizing: border-box;
          .app-item{
            width:calc(50% - 10px);
            box-sizing: border-box;
            float: left;
            height: 60px;
            padding: 10px;
            border: 1px solid #e9e9e9;
            border-radius: 3px;
            display: flex;
            img{
              width:40px;
              height: 40px;
              margin-right: 10px;
            }
            .item-box{
              display: flex;
              flex-direction: column;
              justify-content: center;
              >p:nth-child(1){
                font-size: 14px;
                color:#333;
                margin-bottom: 5px;
              }
              >p:nth-child(2){
                font-size: 12px;
                color: #8d8d8d;
              }
            }
          }
          .app-item:nth-child(2n){
            margin-left: 20px;
          }
       }
    }
  }
</style>
