<template>
  <div class="container">
    <div class="wrap">
      <div>
        <div class="title">当前组织：{{router.currentRoute.value.query?.name}}</div>
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
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <el-menu-item :index="index" v-for="(item, index) in  identityList.list" @click="checkItem(item)">
            <span>{{item.name}}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>


    <el-dialog v-model="createIdntity" title="请录入身份信息" width="40%" center append-to-body @close="dialogHide">
      <div>
        <el-form-item label="身份名称" style="width: 100%">
          <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="身份编号" style="width: 100%">
          <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="所属角色" style="width: 100%">
        <el-cascader
          :props="cascaderProps"
          :options="cascaderTree"
          v-model="formData.parentIds"
          style="width: 100%"
          placeholder="请选择"
        />
        </el-form-item>
        <el-form-item label="身份简介" style="width: 100%">
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
        authId:formData.parentIds[formData.parentIds.length-1]
      }
    }).then((res: ResultType) => {
      if (res.success) {
        ElMessage({
          message: '创建成功!',
          type: 'success'
        })
        dialogHide()
        loadIdentities()
      }
    })
  }
  // 节点ID和对象映射关系
  const parentIdMap: any = {}

  let authorityTree = ref<any[]>([])
  let cascaderTree = ref<any[]>([])

  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
    children: 'nodes',
  }

  // 加载职权树
  const loadAuthorityTree = () => {
    $services.company.getAuthorityTree({data: {id: belongId.value}}).then((res: any)=>{
      authorityTree.value = []
      authorityTree.value.push(res.data)
      initIdMap(authorityTree.value)
      cascaderTree.value = authorityTree.value
    })
  }
  // 初始化ID和对象映射关系
  const initIdMap = (nodes: any[]) => {
    for(const node of nodes){
      parentIdMap[node.id] = node
      if(node.nodes){
        initIdMap(node.nodes)
      }
    }
  }

  const dialogHide = ()=>{
    createIdntity.value = false
  }

  onMounted(() => {
    belongId.value = router.currentRoute.value.query?.belongId
    loadIdentities()
    loadAuthorityTree()
  })


</script>
<style scoped>
.el-menu{
  border:0 !important
}
 </style>
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
  cursor: pointer;
}
.text {
  font-size: 14px;
  cursor: pointer;
}

.item {
  margin-bottom: 18px;
}

</style>
