<template>
  <div class="group-content-wrap">
    <h1 class="title">消息内容</h1>
  </div>
</template>

<script lang="ts" setup>
import { formItemValidateStates } from 'element-plus';
import { reactive, ref } from 'vue'

const state = reactive({ isEditNickName: false, isQunName: false, isIgnoreMsg: false, isStick: false })

const textarea = ref('')

const emit = defineEmits(['submitInfo'])

const submit = () => {
  console.log('submit');

  emit('submitInfo', textarea)
}

</script>

<style lang="scss" scoped>
.group-content-wrap {
  padding: 10px;

}
</style>
