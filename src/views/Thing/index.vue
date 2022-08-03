<template>
  <div class="thing">
    <div class="work-card">
      <div class="card-head">
        <div class="title">任务卡片</div>
        <div class="view-details" @click="jumpDetail">查看详情</div>
      </div>
      <ul>
        <li>
          <p>我的待办</p>
          <p>0</p>
        </li>
        <li>
          <p>已办事项</p>
          <p>0</p>
        </li>
        <li>
          <p>已完结事项</p>
          <p>0</p>
        </li>
        <li>
          <p>我发起的</p>
          <p>0</p>
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="personal">
        <div class="head">
          <div class="personal-title">个人应用</div>
          <!-- <div class="personal-edit">管理</div> -->
        </div>
        <div class="app-list" style="height:300px" >
          
        </div>
      </div>
      <div class="whole">
        <div class="view-details"  @click="drawer = true">编辑首页</div>

      </div>
      <el-drawer
        v-model="drawer"
        title="编辑首页"
        direction="rtl"
      >
      <div>我是首页模块</div>
  </el-drawer>
    </div>
  </div>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { Search } from '@element-plus/icons-vue'
import router from '@/router/index'
import { ref,onMounted} from 'vue'
const input2 = ref('')
var cartList = ref([]);
const getCardList = () => {
  $services.person.approval({
    "data":{
        "offset": 0,
        "limit": 10,
    }
  }).then((res:any) => {
    cartList = res.data.result
  })
}
const drawer = ref(false);
var jumpDetail =()=>{
  router.push({path:'/cardDetail'})
}
onMounted(() => {
  getCardList()
})

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
.work-card {
  background: #f0f2f5;
  padding: 20px;
  .card-head {
    background: #fff;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    padding: 20px;
    .title {
      color: #333;
      font-size: 16px;
    }
    .view-details {
      font-size: 12px;
      color: #154ad8;
    }
  }
  ul {
    width: 100%;
    display: flex;
    background: #fff;
    li {
      width: 25%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #eee;
      margin: 30px 0;
      > p:nth-child(1) {
        color: #ccc;
        margin-bottom: 20px;
      }
    }
    li:last-child {
      border-right: 0;
    }
  }
}
.content {
  background: #f0f2f5;
  padding: 0 20px 20px;
  display: flex;
  justify-content: space-between;
  .personal {
    background: #fff;
    width: calc(50% - 10px);
    .head {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;
      padding: 15px;
    }
    .app-list {
      width: 100%;
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
      overflow: hidden;
      .app-item {
        width: calc(50% - 10px);
        box-sizing: border-box;
        float: left;
        height: 60px;
        padding: 10px;
        border: 1px solid #e9e9e9;
        border-radius: 3px;
        display: flex;
        margin-bottom: 10px;
        img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
        .item-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          > p:nth-child(1) {
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
          }
          > p:nth-child(2) {
            font-size: 12px;
            color: #8d8d8d;
          }
        }
      }
      .app-item:nth-child(2n) {
        margin-left: 20px;
      }
    }
    .page {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-right: 20px;
    }
  }
  .whole {
    background: #fff;
    width: calc(50% - 10px);
    .head {
      padding: 15px;
      border-bottom: 1px solid #e8e8e8;
    }
    .app-list {
      width: 100%;
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
      overflow: hidden;
      .app-item {
        width: calc(50% - 10px);
        box-sizing: border-box;
        float: left;
        height: 60px;
        padding: 10px;
        border: 1px solid #e9e9e9;
        border-radius: 3px;
        display: flex;
        margin-bottom: 10px;
        img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
        .item-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          > p:nth-child(1) {
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
          }
          > p:nth-child(2) {
            font-size: 12px;
            color: #8d8d8d;
          }
        }
      }
      .app-item:nth-child(2n) {
        margin-left: 20px;
      }
    }
    .role-wrap {
      overflow: hidden;
      .role-list {
        width: calc(100% - 50px);
        float: left;
        margin-top: 10px;
        .role-item {
          float: left;
          margin-left: 10px;
          padding: 5px;
          font-size: 12px;
          border-radius: 3px;
          cursor: pointer;
        }
        .role-active {
          background: #4462d2;
          color: #fff;
        }
      }
      .open-fold {
        width: 40px;
        text-align: center;
        height: 20px;
        line-height: 20px;
        float: right;
        margin-top: 13px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        font-size: 12px;
        align-items: center;
      }
    }
    .page {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-right: 20px;
    }
  }
}
</style>
