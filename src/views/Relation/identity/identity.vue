<template>
  <div class="container">
    <div class="wrap">
      <div>
        <div class="title">当前组织:</div>
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
          <el-icon color="#154ad8" :size="20" @click="createIdntity = true">
            <CirclePlus />
          </el-icon>
        </li>
      </div>
      <div>
        <div class="text item" v-for="(item,index) in  identityList.list" :key="index" @click="checkItem(item)">
          {{item.name}}
        </div>
      </div>
    </div>
    <el-dialog v-model="createIdntity" title="请录入角色信息" width="40%" center append-to-body @close="dialogHide">
      <div>
        <el-form-item label="角色名称" style="width: 100%">
          <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="角色编号" style="width: 100%">
          <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="角色简介" style="width: 100%">
          <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
        </el-form-item>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogHide">取消</el-button>
          <el-button type="primary" @click="createIdentity">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import { ref, onMounted,reactive } from 'vue'
  import { useRoute } from 'vue-router';
  import $services from '@/services'
  const emit = defineEmits(['itemClick'])

  const router = useRouter()
  // 当前组织ID
  const createIdntity = ref<boolean>(false)
  const formData = reactive<any>({})
  const belongId = ref(null)
  // 身份列表
  const identityList = reactive({list:[]})

  const checkItem = (val: any) => {
    emit('itemClick', val)
  }
  onMounted(()=>{
    belongId.value = router.currentRoute.value.query.belongId
    loadIdentities()
  })
  // 加载身份
  const loadIdentities = ()=>{
    $services.cohort.getIdentitys({
      data: {
        offset:0,
        limit:20,
        id: belongId.value,
      }
    }).then((res: ResultType) => {
      if (res.success) {
        identityList.list = res.data.result
        console.log(identityList.list)

      }
    })
  }
  const createIdentity = ()=>{
    $services.cohort.createIdentity({
      data: {
        belongId:belongId.value,
        name:formData.name,
        code:formData.code,
        remark:formData.remark,
        authId:''
      }
    }).then((res: ResultType) => {
      if (res.success) {
        identityList.list = res.data.result
        console.log(identityList.list)

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
  box-sizing: border-box;
  padding: 10px;
  background: #fff;
}
.title{
  margin-bottom: 10px;
}
.search-wrap{
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search {
  width: calc(100% - 30px);
  font-size: 12px;
  .el-input__inner {
    font-size: 12px;
  }
}
.tree-btns{
  display: flex;
  justify-content: center;
  align-items: center;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

</style>
