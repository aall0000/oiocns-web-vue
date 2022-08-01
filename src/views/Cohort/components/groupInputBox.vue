<template>
  <div class="group-input-wrap" @keyup.enter="submit">
    <div class="icons-box">
      <el-icon :size="20">
        <Orange />
      </el-icon>
      <el-icon :size="20">
        <Microphone />
      </el-icon>
    </div>
    <el-input v-model="textarea" class="textarea" :input-style="inputStyle" resize='none' :rows="3" type="textarea" />
    <div class="send-box">
      <el-button type="success" @click="submit">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const textarea = ref<string>('')

const emit = defineEmits(['submitInfo'])

const submit = () => {
  emit('submitInfo', textarea)
  textarea.value = ""
}
const inputStyle = {
  outLine: 'none'
}
</script>

<style lang="scss" scoped>
.group-input-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 14px 14px 14px;

  .icons-box {
    height: 34px;
    display: flex;
    align-items: center;
    border-top: 1px solid #ccc;

    .el-icon {
      margin-right: 12px;
      cursor: pointer;

      &:hover {
        color: $colorRed;
      }
    }
  }

  .textarea {
    flex: 1;
    outline: none;
    border: none;
  }

  .send-box {
    display: flex;
    justify-content: flex-end;
    height: 40px;
    align-items: center;

  }
}
</style>
