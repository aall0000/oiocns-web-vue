<template>
  <ul class='group-side-bar-wrap'>
    <li class="group-con active">群1</li>
    <li class="group-con">群2</li>
    <li class="group-con">个人3</li>
  </ul>
</template>

<script lang="ts" setup name="groupSideBar">

</script>

<style lang='scss' scoped>
.group-side-bar-wrap {
  width: 220px;
  height: 100%;
  padding: 10px 0;
  overflow-y: auto;

  .group-con {
    padding: 10px 12px;

    &.active,
    &:hover {
      color: #0F39D1;
      background-color: #E7ECFB;
    }
  }
}
</style>
