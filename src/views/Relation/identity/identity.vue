<template>
  <div class="container">
    <div class="wrap">
      <div>
        <div>当前组织:</div>
      </div>

      <div class="search-wrap">
        <el-input class="search" v-model="filterText" placeholder="搜索身份">
          <template #suffix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <li class="con tree-btns">
          <el-icon color="#154ad8" :size="20" @click="createGroupDialogVisible = true">
            <CirclePlus />
          </el-icon>
        </li>
      </div>
      <div>
        <div class="text item"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import { ref, onMounted } from 'vue'
  const emit = defineEmits(['itemClick'])

  const router = useRouter()
  // 当前组织ID
  const belongId = ref(null)
  // 当前组织
  const org = ref({})
  // 身份列表
  const identityList = ref([])

  const itemClick = (val: any) => {
    emit('itemClick', val)
  }

  // 加载身份
  const loadIdentities = ()=>{
    $services.company.createDepartment({
      data: {
        id: formData.value.id,
      }
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
  }

  onMounted(() => {
    belongId.value = router.currentRoute.value.query?.belongId
  })


</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  width: 100%;
}
.wrap{
  width: 100%;
  background: #fff;
}
.search-wrap{
  width: 100%;
}
.search {
  font-size: 12px;
  .el-input__inner {
    font-size: 12px;
  }
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

</style>
