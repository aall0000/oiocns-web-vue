<template>
  <div class="user-head-img-wrap" v-if="url">
    <img class="user-img" :src="img" alt="" srcset="" />
  </div>
  <div class="user-head-img-wrap txt-img" v-else>
    <span>{{ name.slice(0, 2).toLocaleUpperCase() }}</span>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import img from '@/assets/img/toux.jpg'

type Props = {
  name: string,
  url?: string
}

const props = defineProps<Props>()

const { name, url } = toRefs(props)

</script>

<style lang="scss" scoped>
.user-head-img-wrap {
  width: 50px;
  min-width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 50%;

  &.txt-img {
    background-color: #409eff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #fff;
  }

  .user-img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
    border-radius: 50%;
  }
}
</style>
