<template>
  <el-dialog v-model="dialogVisible" title="Tips" width="60%" draggable>
    <diytab
    ref="diyTable"
    :hasTableHead="true"
    :tableData="users"
    @handleUpdate="handleUpdate"
    :tableHead="tableHead">
    </diytab>
  </el-dialog>
</template>

<script setup lang="ts">
  import diytab  from '@components/diyTable/index.vue'
  import { ref,reactive } from 'vue'
  const props = defineProps({
    cover: {
      type: Boolean,
      required: true
    },
    containLink: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  })
  const dialogVisible = ref<boolean>(true)
  const users = reactive<any>([])
  const handleUpdate = ()=>{

  }
  const tableHead = () =>{
    
  }
</script>

<style lang="scss" scoped>
  .sandboxLayout {
    height: 100%;
    width: 100%;
  }
</style>
