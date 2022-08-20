<template>
  <div v-if="label" class="user-head-label">
    <el-tag size="small">{{ label }}</el-tag>
  </div>
  <div class="user-head-img-wrap" v-if="url">
    <img class="user-img" :src="url ?? img" alt="" srcset="" />
  </div>
  <div class="user-head-img-wrap txt-img" v-else>
    <span>{{ name && name.slice(0, 2).toLocaleUpperCase() }}</span>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import img from '@/assets/img/toux.jpg'

type Props = {
  name: string,
  label: string,
  url?: string
}

const props = defineProps<Props>()

const { name = '', url, label = '' } = toRefs(props)

</script>

<style lang="scss" scoped>
.user-head-label {
  position: absolute;
  right: 5px;
  top: 26px;
}

.user-head-img-wrap {
  width: 40px;
  min-width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 4px;

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
    width: 46px;
    height: 46px;
    margin-right: 15px;
    border-radius: 4px;
  }
}
</style>
