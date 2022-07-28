<template>
  <div class="group-input-wrap" @keyup.enter="submit">
    <div class="icons">按钮</div>
    <el-input v-model="textarea" :rows="2" type="textarea" placeholder="Please input" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const textarea = ref('')

const emit = defineEmits(['submitInfo'])

const submit = () => {
  console.log('submit');

  emit('submitInfo', textarea)
}

</script>

<style lang="scss" scoped>
.group-header-wrap {}
</style>
