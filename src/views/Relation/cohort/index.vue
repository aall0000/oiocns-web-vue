<template>
  <div class="container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">群组</span>
          <el-radio-group v-model="mode" size="small" class="button">
            <el-radio-button label="list"><el-icon :size="18"><Tickets /></el-icon></el-radio-button>
            <el-radio-button label="card"><el-icon :size="18"><Menu /></el-icon></el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div v-show="mode==='list'">
        <List/>
      </div>
      <div v-show="mode==='card'">
        <Card/>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import List  from './list.vue'
import Card  from './card.vue'

const mode = ref('card')

onMounted(() => {

})


</script>
<style lang="scss" scoped>
.container{
  height: 100%;
  width: 100%;
}

.title {
  text-align: left;
  font-size: 16px;
  width: 30%;
  font-weight: bold;
}
.box-card {
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
