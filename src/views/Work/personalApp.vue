<template>
  <div class="thing">
    <div class="thing-head">
      <div class="thing-type">物 / 个人应用管理 </div>
      <div class="thing-mian">
        <div class="thing-setting">已安装有应用</div>
        <el-input v-model="input2" class="w-50 m-2 input-class" placeholder="搜索应用" />
      </div>
    </div>
    <div class="content">
      <div class="search">
        <el-input class="input" v-model="input" placeholder="请输入" />
        <div class="edit">
          <el-button type="primary">新建代办</el-button>
          <el-button type="primary">删除代办</el-button>
          <el-button type="primary">完成代办</el-button>
        </div>
      </div>
      <div class="app-list clearfix">
        <div class="add-app"> +从应用市场添加应用 </div>
        <div class="app-item">
          <div class="app-box">
            <img src="@/assets/img/group22.png" alt="" />
            <div class="app-right">
              <p>资产监管</p>
              <p>使⽤对象：财政、主管部⻔内容：审批、以及查询分析功能...</p>
            </div>
          </div>
          <div class="app-edit" @mouseleave="mouseLeave">
            <div class="set" @click="showType">设置</div>
            <div class="edit-box" v-if="show == true">
              <p>设置首页应用</p>
              <p>设置可见范围</p>
            </div>
            <div class="remove-app">移除应用</div>
          </div>
        </div>
      </div>
      <div class="page">
        <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  const activeIndex = ref(1)
  const input = ref(null)
  var show = ref(false)
  var input2 = ref()
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  var showType = () => {
    show.value = true
  }
  var mouseLeave = () => {
    show.value = false
  }
  var filterHandler = () => {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .thing {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
  .thing-head {
    padding: 30px;
    background: #fff;
    .thing-type {
      font-size: 16px;
      color: #8d8d8d;
      margin-bottom: 15px;
    }
    .thing-mian {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      display: flex;
      justify-content: space-between;
      .input-class {
        width: 200px;
      }
    }
  }
  .content {
    background: #f0f2f5;
    padding: 20px;
    .search {
      background: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .input {
        width: 200px;
      }
    }
    .app-list {
      background: #fff;
      box-sizing: border-box;
      padding: 20px;

      .add-app {
        width: calc(25% - 15px);
        height: 150px;
        border: 1px dashed #153ec9;
        border-radius: 3px;
        text-align: center;
        line-height: 150px;
        float: left;
        margin-right: 15px;
      }
      .app-item {
        width: calc(25% - 15px);
        height: 150px;
        border-radius: 3px;
        text-align: center;
        line-height: 150px;
        float: left;
        margin-right: 15px;
        border: 1px solid #eee;
        .app-box {
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 40px;
            height: 40px;
          }
          .app-right {
            width: 220px;
            margin-left: 20px;
            p {
              line-height: 20px;
              text-align: left;
            }
            > p:nth-child(1) {
              margin-bottom: 10px;

              font-size: 14px;
              color: #333;
            }
            > p:nth-child(2) {
              font-size: 12px;
              color: #8d8d8d;
            }
          }
        }
        .app-edit {
          width: 100%;
          border-top: 1px solid #e9e9e9;
          display: flex;
          height: 50px;
          background: #f7f7f7;
          color: #333;
          position: relative;
          div {
            width: 50%;
            height: 24px;
            text-align: center;
            line-height: 24px;
            margin-top: 13px;
            cursor: pointer;
          }
          > div:nth-child(1) {
            box-sizing: border-box;
            border-right: 1px solid #e9e9e9;
            color: #153ec9;
          }
          > div:last-child {
            color: #888888;
          }
          .edit-box {
            position: absolute;
            left: 50px;
            top: 20px;
            width: 120px;
            border-radius: 3px;
            height: 60px;
            background: #fff;
            box-shadow: 0px 0px 2px 1px #ddd;
            p {
              height: 30px;
              line-height: 30px;
              cursor: pointer;
            }
            p:hover {
              background: #f0f0f0;
            }
          }
        }
      }
    }
    .clearfix:after {
      content: '.';
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
    .clearfix {
      zoom: 1;
    }
    .page {
      background: #fff;
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-right: 20px;
    }
  }
</style>
