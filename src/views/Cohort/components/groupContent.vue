<template>
  <ul class="group-content-wrap">
    <template v-for="item in list">
      <li class="group-content-left con" v-if="item.id!==myId">
        <img class="con-img" src="@/assets/img/avatar.jpg" alt="">
        <span class="con-txt">{{item.msgBody}}</span>
      </li>
      <li class="group-content-right con" v-else>
      <span class="con-txt">{{item.msgBody}}</span>
      <img class="con-img" src="@/assets/img/avatar.jpg" alt="">
    </li>
    </template>
    <!-- <li class="group-content-left con">
      <img class="con-img" src="@/assets/img/avatar.jpg" alt="">
      <span class="con-txt">三生三世</span>
    </li>
    <li class="group-content-right con">
      <span class="con-txt">我我我我</span>
      <img class="con-img" src="@/assets/img/avatar.jpg" alt="">
    </li> -->
  </ul>
</template>

<script lang="ts" setup>
type Props = {
  list: any[],
  myId:string
}
const { list,myId } = defineProps<Props>()



console.log('list', list);
const arr = [
  {
    createTime: "2022-08-01 16:53:02",
    createUser: "340896682281668608",
    fromId: "340896682281668608",
    id: "341986696855949312",
    msgBody: "78697",
    msgType: "text",
    status: 1,
    toId: "338792423297781760",
    updateTime: "2022-08-01 16:53:02",
    updateUser: "340896682281668608",
    version: "1"
  },
  {
    createTime: "2022-08-01 16:53:02",
    createUser: "340896682281668608",
    fromId: "340896682281668608",
    id: "341986696855949312",
    msgBody: "78697",
    msgType: "text",
    status: 1,
    toId: "338792423297781760",
    updateTime: "2022-08-01 16:53:02",
    updateUser: "340896682281668608",
    version: "1"
  },
  {
    createTime: "2022-08-01 16:53:02",
    createUser: "340896682281668608",
    fromId: "340896682281668608",
    id: "341986696855949312",
    msgBody: "78697",
    msgType: "text",
    status: 1,
    toId: "338792423297781760",
    updateTime: "2022-08-01 16:53:02",
    updateUser: "340896682281668608",
    version: "1"
  }
]

</script>

<style lang="scss" scoped>
.group-content-wrap {
  padding: 30px;
  background-color: #F5F5F5;

  .con {
    height: 40px;
    display: flex;
    align-items: center;

    &-img {
      height: 30px;
      width: 30px;
    }

    &-txt {
      height: 30px;
      padding: 5px;
      margin: 0 10px;
      color: #fff;
      background-color: #409eff;
      border-radius: 4px;
    }
  }

  .group-content-left {}

  .group-content-right {
    justify-content: flex-end;
  }


}
</style>
