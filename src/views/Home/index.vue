<template>
  <div class="baseLayout">
    <div class="headers"><Head></Head></div>
    <div class="articleTop">
      <div class="articleTop-left"><Invitate></Invitate></div>
      <div class="articleTop-right"><Organization></Organization></div>
    </div>
    <div class="articleBtm">
      <div class="articleBtm-box">
        <div class="articleBtm-leftTop"><AppCommon></AppCommon></div>
        <div class="articleBtm-leftBtm"><AppMarket></AppMarket></div>
      </div>
      <div class="articleBtm-right"><ManageSystem></ManageSystem></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Head from './components/head.vue'
import Invitate from './components/invitate.vue'
import Organization from './components/invitate.vue'
import AppMarket from './components/appMarket.vue'
import AppCommon from './components/appCommon.vue'
import ManageSystem from './components/manageSystem.vue'
export default defineComponent({
  components: { Head, Invitate, Organization, AppMarket, AppCommon, ManageSystem },
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
  height: 20%;
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
  height: 60%;
  margin-top: 20px;
  display: flex;
  &-leftTop {
    width: 100%;
    height: 60%;
    margin-bottom: 20px;
  }
  &-leftBtm {
    flex: 1;
    width: 100%;
    height: 20%;
  }
  &-box {
    display: flex;
    flex-direction: column;
    width: 60%;
    height: 100%;
    margin-right: 20px;
  }
  &-right {
    width: 40%;
    height: 100%;
  }
}
</style>