<template>
  <div class="group-content-wrap">
    <h1 class="title">消息内容</h1>
  </div>
</template>

<script lang="ts" setup>
  type Props = {
    list: any[]
  }
const { list } = defineProps<Props>()



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
  padding: 10px;

}
</style>
