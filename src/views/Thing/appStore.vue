<template>
  <div class="thing">
    <div class="thing-head">
      <div class="thing-type">物 / 应用市场 </div>
      <div class="thing-mian">
        <div class="thing-setting">应用市场</div>
        <el-input v-model="input2" class="w-50 m-2 input-class" placeholder="搜索应用" />
      </div>
    </div>
    <div class="content">
      <div class="app-content clearfix">
        <div class="content-menu">
          <el-menu
            class="el-menu-demo"
            :default-active="activeIndex"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item index="1">
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="2">
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3">
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="content-app clearfix">
          <div class="app-list clearfix">
            <div class="app-item">
              <div class="app-box">
                <img src="./../../assets/img/Group22.png" alt="" />
                <div class="app-right">
                  <p>资产监管</p>
                  <p>使⽤对象：财政、主管部⻔内容：审批、以及查询分析功能...</p>
                </div>
              </div>
              <div class="app-get" @mouseleave="mouseLeave">
                 获取
              </div>
            </div>
          </div>
          <div class="page">
            <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
          </div>
        </div>
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
  var handleOpen = ()=>{
    console.log(1)
  }
  var handleClose = ()=>{

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
    .app-content {
        width: 100%;
      .content-menu {
        float: left;
        width: 200px;
      }

      .content-app {
        width:calc(100% - 200px);
        float: left;
        .app-list {
          background: #fff;
          box-sizing: border-box;
          padding: 20px;

          .app-item {
            width:350px;
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

            .app-get {
              width: 100%;
              border-top: 1px solid #e9e9e9;
              height: 50px;
              background: #f7f7f7;
              color: #888888;
              line-height: 50px;
              text-align: center;
              cursor: pointer;
            }
            .app-get:hover{
                color: #153ec9;
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
