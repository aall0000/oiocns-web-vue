<template>
  <div class="baseLayout">
    <div class="headers"><Head></Head></div>
    <div class="articleTop">
      <div class="articleTop-left"><Invitate></Invitate></div>
      <div class="articleTop-right"><Organization></Organization></div>
    </div>
    <div class="articleBtm"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Head from './components/head.vue'
import Invitate from './components/invitate.vue'
import Organization from './components/invitate.vue'
export default defineComponent({
  components: { Head, Invitate, Organization },
  setup() {
    return {}
  }
})
</script>

<style lang='scss' scoped>
.baseLayout {
  height: 100%;
}
.headers {
  width: 100%;
  height: 15%;
}
.articleTop {
  display: flex;
  width: 100%;
  height: 30%;
  margin-top: 20px;
  &-left {
    width: 50%;
    height: 100%;
    margin-right: 20px;
  }
  &-right {
    width: 50%;
    height: 100%;
  }
}
.articleBtm {
  width: 100%;
  height: 50%;
  margin-top: 20px;
}
</style>