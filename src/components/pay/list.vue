<template>
    <el-dialog
      v-model="dialogVisible"
      append-to-body
      :before-close="closeDialog"
      :title="title"
      width="60%"
    >
      <el-input v-model="value" @input="remoteMethod" placeholder="请输入" />
      <diytab
        :style="{height:300+'px'}"
        ref="diyTable"
        :hasTableHead="true"
        :tableData="tableData"
        :options="options"
        @handleUpdate="handleUpdate"
        @selectionChange="selectionChange"
        :tableHead="tableHead"
      >
        <template #remark="scope">
          <el-tooltip :content="scope.row.remark" placement="bottom" effect="light">
            <template #content> 
              <div class="tooltip-text" style="width:300px">{{scope.row.remark}}</div>
            </template>
            <div class="remark-text">
            {{scope.row.remark}}
            </div>
          </el-tooltip>
        </template>
      </diytab>
      <!-- <div class="foot">
        <el-button  @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="checksSearch">确定</el-button>
      </div> -->
    </el-dialog>
  </template>
  
  <script setup lang="ts">
    import diytab from '@components/diyTable/index.vue'
    import $services from '@/services'
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { ElMessage } from 'element-plus'
  
    const dialogVisible = ref<boolean>(true)
    const diyTable = ref(null)
    // 表格展示数据
    const pageStore = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    })
    const tableData = ref([])
    const emit = defineEmits(['checksSearch', 'closeDialog'])
    const props = defineProps({
      selectLimit: {},
      id:{
        type: String,
        default: ''
      },
      checkList:{
        type:Array,
        default:[]
      },//选中的值
      serachType:{
        type: Number,
        default: '1'
      },//1 人 2群 3单位 4集团 5分配人员 6分配单位
    })
    interface ListItem {
      code: string
      name: string
      trueName: string
      teamCode: string
      remark: string
    }
  
    const list = ref<ListItem[]>([])
    const value = ref('')
    const loading = ref(false)
    const space = ref<string>()
    const url = ref<string>()
    const title = ref<string>()
    onMounted(() => {

      remoteMethod()
    })
    const remoteMethod = () => {
        let data 
        if(props.serachType==5|| props.serachType ==6){
         data= {
            filter: value.value,
            offset: (pageStore.currentPage - 1) * pageStore.pageSize,
            limit: pageStore.pageSize,
            id:props.id
          }
        }else{
          data = {
            filter: value.value,
            offset: (pageStore.currentPage - 1) * pageStore.pageSize,
            limit: pageStore.pageSize
          }
        }
        $services[space.value][url.value]({
          data: data
        }).then((res: ResultType) => {
          let arr: any = []
          if (res.code == 200) {
            if (res.data.result != undefined) {
              let states = res.data.result
              if (states) {
                states.forEach((el: any) => {
                  let obj = {
                    id: el.id,
                    code: el.code,
                    name: el.name,
                    trueName: el.team.name,
                    teamCode: el.team.code,
                    remark: el.team.remark
                  }
                  arr.push(obj)
                })
                pageStore.total = res.data.total
                diyTable.value.state.page.total = pageStore.total
              } else {
              }
            }
            list.value = arr
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
          // diyTable.value.state.loading = false
        })
    }
  
    const handleUpdate = (page: any) => {
      pageStore.currentPage = page.currentPage
      pageStore.pageSize = page.pageSize
      remoteMethod()
    }
    const checkList = reactive<any>([])
    const selectionChange = (val: any) => {
      checkList.value = val
    }
    const checksSearch = () => {
      emit('checksSearch', checkList)
    }
  
    const closeDialog = () => {
      emit('closeDialog', false)
    }
    const tableHead = ref([{
        prop: 'paymentType',
        label: '付款方式',
        width: '100'
      },
      {
        prop: 'price',
        label: '价格',
        width: '100',
        name: 'price'
      },
      {
        prop: 'status',
        label: '状态',
        width: '150',
        name: 'status'
      },
      {
        prop: 'createTime',
        label: '创建时间',
        width: '150',
        name: 'createTime'
      }
    ])
    const options = ref<any>({
      checkBox: true,
      order: true,
      selectLimit: 1,
      defaultSort: { prop: 'createTime', order: 'descending' },
      treeProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      }
    })
  </script>
  
  <style lang="scss" scoped>
    .foot {
      display: flex;
      width: 100%;
      margin-top: 30px;
      justify-content: flex-end;
    }
    .remark-text{
      white-space: nowrap;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tooltip-text{
      width: 400px;
      max-height: 300px;
      overflow-y: auto;
    }
  </style>
  