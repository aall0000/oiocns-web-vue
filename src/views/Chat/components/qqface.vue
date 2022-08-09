<template>
  <ul class='qqface-wrap'>
    <li v-for="(key, value ) in qqfaceMap" @click="handleChoose(key, value)" :key="value"
      :class="['qqface', `qqface${value}`, 'small']">
    </li>
  </ul>
</template>
<script lang='ts' setup>
import { qqfaceMap } from './config'
console.log('cs', qqfaceMap);


const emit = defineEmits(['chooseFace'])
const handleChoose = (key: any, value: number) => {
  console.log('key, value', key, value);
  emit('chooseFace', key, value)
}

</script>

<style lang='scss' scoped>
@import "./qqface.scss";

.qqface-wrap {
  .qqface {}
}
</style>
