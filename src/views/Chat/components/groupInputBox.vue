<template>
  <div class="group-input-wrap" @keyup.enter="submit">
    <div class="icons-box">
      <div ref="faceBtnRef">
        <el-popover placement="top" :width="400" trigger="click">
          <template #reference>
            <el-icon :size="20">
              <Orange />
            </el-icon>

          </template>
          <ul class='qqface-wrap'>
            <!-- <li v-for="(key, value ) in qqfaceMap" @click="handleFaceChoosed(key, value)" :key="value"
              :class="['qqface', `qqface${value}`, 'small']">
            </li> -->
            <img class="emoji" v-for="index in 36" :key="index" :src="`https://cdn.sunofbeaches.com/emoji/${index}.png`"
              alt="" @click="handleImgChoosed(`https://cdn.sunofbeaches.com/emoji/${index}.png`)">
          </ul>
        </el-popover>
      </div>

      <el-icon :size="20">
        <Microphone />
      </el-icon>
    </div>
    <div class="input-content">
      <div id="insterHtml" class="textarea" @change="handleChange" contenteditable="true" spellcheck="false"
        ref="inputRef" placeholder="请输入内容"> </div>
      <!-- <el-input v-model="textarea" class="textarea" resize='none' :rows="3" type="textarea" /> -->
      <div class="send-box">
        <el-button type="success" @click="submit">发送</el-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const inputRef = ref(null)
const faceBtnRef = ref(null)

const emit = defineEmits(['submitInfo'])

const submit = () => {
  const value = document.getElementById('insterHtml').innerHTML
  emit('submitInfo', value)
  // textarea.value = ""
  document.getElementById('insterHtml').innerHTML = ''
  // console.log('sss',document.getElementById('insterHtml').innerHTML);

}

const handleFaceChoosed = (key: any, value: number) => {
  inputRef.value.focus()
  // let spantTXT = `<span class='qqface qqface${value} small'></span>`
  // const span = document.createElement('span')
  // span.className = `qqface qqface${value} small`
  // textarea.value += spantTXT
  // inputRef.value.append(span)
  const img = document.createElement('img')
  img.src = "https://cdn.sunofbeaches.com/emoji/1.png"

  img.width = 20
  img.height = 20
  document.getElementById('insterHtml').append(img)
  console.log('inputRef.value', inputRef.value.innerHTML);
}
const handleImgChoosed = (url: string) => {
  const img = document.createElement('img')
  img.src = url
  img.className = 'emoji'
  img.width = 20
  img.height = 20
  document.getElementById('insterHtml').append(img)
}

onMounted(() => {
  const faceBtnTriggrt = faceBtnRef.value
  if (faceBtnTriggrt) {
    faceBtnTriggrt.addEventListener('mousedown', (event: MouseEvent) => {
      return event.preventDefault()
    })
  }
})
const handleChange = (a: any) => {
  console.log('变化', a);

}

</script>

<style lang="scss">
@import "./qqface.scss";

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
<style lang="scss">
.qqface-wrap {
  .emoji {
    width: 20px;
    height: 20px;
    margin: 5px;
  }
}

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

    .textarea:empty::before {
      content: attr(placeholder);
      position: absolute;
      color: #ccc;
      background-color: transparent;
    }

    .send-box {
      display: flex;
      justify-content: flex-end;
      // height: 40px;
      align-items: center;
      margin-left: 30px;
      margin-top: 80px;
    }
  }

}
</style>
