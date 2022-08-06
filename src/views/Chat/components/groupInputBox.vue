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
    <div class="input-content">
      <el-input v-model="textarea" class="textarea" resize='none' :rows="3" type="textarea" />
      <div class="send-box">
        <el-button type="success" @click="submit">发送</el-button>
      </div>
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

</script>

<style lang="scss">
.group-input-wrap {
  .textarea {
    textarea {
      height: 100%;
    }
    .el-textarea__inner {
      box-shadow: none !important;
    }
  }

}
</style>
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

    .el-icon {
      margin-right: 12px;
      cursor: pointer;

      &:hover {
        color: $colorRed;
      }
    }
  }

  .input-content {
    display: flex;
    height: 100%;
    justify-content: space-between;
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
      margin-left: 30px;
      margin-top: 80px;
    }
  }

}
</style>
