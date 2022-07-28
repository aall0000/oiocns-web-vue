<template>
<div class="save">
  <div class="body" v-for="(item,index) in tableData.data" :key=index>
    <div class="left">

      <div class="title">
        <p class="bind">{{item.title}}</p>
        <p class="noBind">{{item.content}}</p>
      </div>
    </div>
    <div class="right">
      <span class="bindOption">{{item.option}}</span>
    </div>

  </div>
</div>

</template>
<script lang="ts" setup>
import { reactive } from 'vue';

const tableData = reactive({
  data:[
  {
    title:'账号密码',
    content:'当前密码强度:强',
    option:'修改'
  },
  {
    title:'密保手机',
    content:'已绑定手机:132****5874',
    option:'修改'
  },
  {
    title:'密保问题',
    content:'未设置密保问题:设置密保问题可有效保护账户安全',
    option:'设置'
  },
  {
    title:'备用邮箱',
    content:'已绑定邮箱:107******@qq.com',
    option:'修改'
  }
]
})
</script>
<style scoped lang="less">
.save{
width: 100%;
.body{
  width: 98%;
  height: 50px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px;
  .left{
    width: 60%;

    display: flex;

    .title{

      .bind{
        color: rgb(123, 123, 123);
        margin-bottom: 10px;
      }
      .noBind{
        color: #ccc;
      }
    }

  }
  .right{
      .bindOption{
        color: dodgerblue;
        margin-right: 30px;
      }
    }
}
}
</style>
