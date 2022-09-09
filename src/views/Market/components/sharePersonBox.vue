<template>
  <div class="cohortLayout">
    <div class="cohortLayout-header" style="margin-top: 10px">
      <div class="cohortLayout-header-text">请选择分享方式：</div>
      <div class="cohortLayout-header-tabs">
        <el-radio-group v-model="radio">
          <el-radio v-for="item in state.way" :key="item.id" :label="item.id">{{
            item.label
          }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="cohortLayout-content">
      <div class="cohortLayout-content-left" :style="'width:' + (radio == '1' ? '49%' : '33%')">
        <el-input v-model="searchLeftValue" class="w-50 m-2" placeholder="搜索">
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
        <el-tree
          v-if="radio == '1'"
          ref="leftTree"
          node-key="id"
          :data="cascaderTree"
          :props="unitProps"
          :check-strictly="true"
          :default-expand-all="true"
          show-checkbox
          @check-change="handleCheckChange"
          :filter-node-method="filterNode"
        />
        <el-tree
          v-else
          ref="leftTree"
          :data="cascaderTree"
          :props="unitProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
        />
      </div>
      <div
        class="cohortLayout-content-center"
        style="width: 33%"
        v-if="radio !== '1'"
        v-infinite-scroll="load"
        infinite-scroll-immediate="false"
      >
        <el-input v-model="searchValue" class="w-50 m-2" placeholder="搜索">
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
        <el-tree
          v-if="radio == '2' || radio == '3' || radio == '4'"
          ref="centerTree"
          node-key="id"
          :check-strictly="true"
          :data="state.centerTree"
          :props="authorityProps"
          :default-expand-all="true"
          show-checkbox
          @check-change="centerAuthorClick"
        />
      </div>
      <div class="cohortLayout-content-right" :style="'width:' + (radio == '1' ? '49%' : '33%')">
        <Author
          v-if="radio == '1'"
          @delContent="delContent"
          :departData="state.departData"
        ></Author>
        <Author
          v-if="radio == '2'"
          @delContent="delContentAuth"
          :departData="state.authorData"
        ></Author>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="submitAll">确认</el-button>
      <el-button class="footer-btn" @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import InfiniteScroll from 'element-plus'
  import { onMounted, ref, reactive, toRefs, watch, nextTick, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import API from '@/services'
  import Author from './components/author.vue'
  import { useUserStore } from '@/store/user'
  import type { TabsPaneContext } from 'element-plus'
  import { AnyAaaaRecord } from 'dns'
  interface Tree {
    id: string
    label: string
    data?: any
    children?: Tree[]
  }
  type createInfo = {
    info: ProductType
    groupId?: string
  }
  const store = useUserStore()
  const searchValue = ref('')
  const searchLeftValue = ref('')
  const activeName = ref(0)
  const tabs = ref([])
  const radio = ref('1')
  const leftTree = ref(null)
  const centerTree = ref(null)
  const resource = ref<string>('')
  const state = reactive({
    loadID: {
      id: '',
      label: ''
    },
    way: [
      {
        id: '1',
        label: '按群组分享'
      },
      {
        id: '2',
        label: '按人员分享'
      }
    ],
    departData: [], // 集团分发右侧数据
    departHisData: [], // 集团分发历史数据
    centerTree: [], // 职权分发中间树形
    authorHisData: [], // 职权历史数据
    authorData: [], // 职权右侧数据
    personsHisData: [], // 人员历史数据
    personsData: [], // 人员右侧数据
    identitysData: [], //身份右侧数据
    identitysHisData: [] // 身份历史数据
  })
  let cascaderTree = ref<any[]>([])
  let personTree = ref<any[]>([])
  const authorityProps = {
    label: 'name',
    children: 'nodes'
  }
  const unitProps = {
    label: 'name',
    children: 'children'
  }
  const page = reactive({
    currentPage: 1,
    pageSize: 20
  })
  const handleCurrent: any = computed(() => {
    return (page.currentPage - 1) * page.pageSize
  })
  watch(
    () => radio.value,
    (newValue, oldValue) => {
      state.centerTree = []
      nextTick(() => {
        if (newValue == '1' && state.departData.length > 0) {
          let arr: any[] = []
          state.departData.forEach((el) => {
            if (el.type == 'add' || el.type == 'has') {
              arr.push(el.id)
            }
          })
          leftTree.value.setCheckedKeys(arr, true)
        } else if (newValue == '2' && state.authorData.length == 0) {
          getHistoryData()
        } else if (newValue == '3' && state.personsData.length == 0) {
          getHistoryData()
        } else if (newValue == '4' && state.identitysData.length == 0) {
          getHistoryData()
        }
      })
    },
    { immediate: true }
  )
  watch(
    () => resource.value,
    (newValue, oldValue) => {
      state.authorData = []
      state.departData = []
      state.personsData = []
      state.identitysData = []
      if (radio.value == '1') {
        leftTree.value.setCheckedKeys([])
      }
      getHistoryData()
    }
  )
  watch(
    () => searchValue.value,
    (newValue, oldValue) => {
      console.log(newValue)
      handleNodeClick(state.loadID, false, newValue)
    }
  )
  watch(
    () => searchLeftValue.value,
    (newValue, oldValue) => {
      leftTree.value!.filter(newValue)
    }
  )
  const props = defineProps<createInfo>()
  onMounted(() => {
    getCompanyTree()
  })
  const emit = defineEmits(['closeDialog'])
  const closeDialog = () => {
    emit('closeDialog')
  }

  // 获取部门历史数据
  const getOrgHistoryData = () => {}

  // 获取历史数据（提交表单后）
  const getNewHistoryData = () => {
    switch (radio.value) {
      case '1':
        API.product
          .searchGroupShare({
            data: {
              id: props.info.id,
              offset: 0,
              limit: 1000,
              filter: '',
              teamId: props.groupId ? props.groupId : store.queryInfo.team.id
            }
          })
          .then((res: ResultType) => {
            state.departHisData = res.data.result ? res.data.result : []
            leftTree.value.setCheckedKeys([])
            let arr: any[] = []
            state.departHisData.forEach((el) => {
              el.type = 'has'
              arr.push(el.id)
            })
            state.departData = state.departHisData
            leftTree.value.setCheckedKeys(arr, true)
          })
        break
      case '2':
        API.product
          .searchUnitShare({
            data: {
              id: props.info.id,
              offset: 0,
              limit: 1000,
              filter: '',
              teamId: props.groupId ? props.groupId : store.queryInfo.team.id
            }
          })
          .then((res: ResultType) => {
            state.authorHisData = res.data.result ? res.data.result : []
            centerTree.value.setCheckedKeys([])
            let arr: any[] = []
            state.authorHisData.forEach((el) => {
              el.type = 'has'
              arr.push(el.id)
            })
            state.authorData = state.authorHisData
            centerTree.value.setCheckedKeys(arr, true)
          })
        break
      default:
        break
    }
  }
  // 获取历史数据
  const getHistoryData = () => {
    switch (radio.value) {
      case '1':
        API.product
          .searchGroupShare({
            data: {
              id: props.info.id,
              offset: 0,
              limit: 1000,
              filter: '',
              teamId: props.groupId ? props.groupId : store.queryInfo.team.id
            }
          })
          .then((res: ResultType) => {
            state.departHisData = res.data.result ? res.data.result : []
            let arr: any[] = []
            state.departHisData.forEach((el) => {
              arr.push(el.id)
            })
            leftTree.value.setCheckedKeys(arr, true)
          })
        break
      case '2':
        API.product
          .searchUnitShare({
            data: {
              id: props.info.id,
              teamId: props.groupId ? props.groupId : store.queryInfo.team.id,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.authorHisData = res.data.result ? res.data.result : []
            state.authorData = JSON.parse(JSON.stringify(state.authorHisData))
            let arr: any[] = []
            state.authorData.forEach((el) => {
              el.type = 'has'
              arr.push(el.id)
            })
          })
        break
      default:
        break
    }
  }

  // 树节点过滤
  const filterNode = (value: string, data: any) => {
    if (!value) return true
    return data.label.includes(value)
  }

  // 提交表单
  const submitAll = async () => {
    let departAdd: any[] = []
    let departDel: any[] = []
    let authorAdd: any[] = []
    let authorDel: any[] = []
    state.departData.forEach((el) => {
      if (el.type == 'add') {
        departAdd.push(el.id)
      } else if (el.type == 'del') {
        departDel.push(el.id)
      }
    })

    state.authorData.forEach((el) => {
      if (el.type == 'add') {
        authorAdd.push(el.id)
      } else if (el.type == 'del') {
        authorDel.push(el.id)
      }
    })

    let promise1
    let promise2
    let promise3
    let promise4
    if (departAdd.length > 0) {
      promise1 = API.product.groupShare({
        data: {
          productId: props.info.id,
          teamId: props.groupId ? props.groupId : store.queryInfo.team.id,
          targetIds: departAdd
        }
      })
    }
    if (departDel.length > 0) {
      promise2 = API.product.deleteGroupShare({
        data: {
          productId: props.info.id,
          teamId: props.groupId ? props.groupId : store.queryInfo.team.id,
          targetIds: departDel
        }
      })
    }
    if (authorAdd.length > 0) {
      promise3 = await API.product.share({
        data: {
          productId: props.info.id,
          teamId: props.groupId ? props.groupId : store.queryInfo.team.id,
          targetIds: authorAdd
        }
      })
    }
    if (authorDel.length > 0) {
      promise4 = API.product.deleteShare({
        data: {
          productId: props.info.id,
          teamId: props.groupId ? props.groupId : store.queryInfo.team.id,
          targetIds: authorDel
        }
      })
    }
    Promise.all([promise1, promise2, promise3, promise4]).then((res) => {
      ElMessage({
        type: 'success',
        message: '分享成功'
      })
      closeDialog()
    })
  }
  // 中间树形滚动加载事件
  const load = () => {
    if (radio.value == '3') {
      page.currentPage++
      handleNodeClick(state.loadID, true)
    }
  }
  // 中间树形点击事件
  const centerAuthorClick = (data: any, checked: boolean, indeterminate: any) => {
    console.log('点击中间', data, checked, indeterminate)
    if (checked) {
      if (radio.value == '2') {
        handleBoxClick(state.authorHisData, state.authorData, data)
      } else if (radio.value == '3') {
        handleBoxClick(state.personsHisData, state.personsData, data)
      } else {
        handleBoxClick(state.identitysHisData, state.identitysData, data)
      }
    } else {
      if (radio.value == '2') {
        handleBoxCancelClick(state.authorHisData, state.authorData, data)
      } else if (radio.value == '3') {
        handleBoxCancelClick(state.personsHisData, state.personsData, data)
      } else {
        handleBoxCancelClick(state.identitysHisData, state.identitysData, data)
      }
    }
  }
  const handleBoxCancelClick = (hisData: any, dataList: any, data: any) => {
    let result = hisData.some((item: any) => {
      return item.id == data.id
    })
    dataList.forEach((el: any, index: number) => {
      if (el.id == data.id) {
        if (result) {
          data.type = 'del'
          el.type = 'del'
        } else {
          dataList.splice(index, 1)
        }
      }
    })
  }
  const handleBoxClick = (hisData: any, dataList: any, data: any) => {
    let result = hisData.some((item: any) => {
      return item.id == data.id
    })
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].id == data.id) {
        if (data.type == 'add') {
          return
        } else if (data.type == 'has') {
          return
        }
      }
    }

    if (result) {
      data.type = 'has'
      dataList.forEach((el: any) => {
        if (el.id == data.id) {
          el.type = 'has'
        }
      })
    } else {
      data.type = 'add'
      dataList.push(data)
    }
  }
  // 左侧树点击事件
  const handleCheckChange = (data: any, checked: boolean, indeterminate: any) => {
    console.log('点击左侧', data, checked, indeterminate)
    if (checked) {
      if (radio.value == '1') {
        let result = state.departHisData.some((item: any) => {
          return item.id == data.id
        })
        for (let i = 0; i < state.departData.length; i++) {
          if (state.departData[i].id == data.id) {
            if (data.type == 'add') {
              return
            } else if (data.type == 'has') {
              return
            }
          }
        }
        if (result) {
          if (data.type == 'del') {
            data.type = 'has'
            return
          } else {
            data.type = 'has'
            state.departData.push(data)
          }
        } else {
          data.type = 'add'
          state.departData.push(data)
        }
      }
    } else {
      if (radio.value == '1') {
        let result = state.departHisData.some((item: any) => {
          return item.id == data.id
        })
        state.departData.forEach((el, index) => {
          if (el.id == data.id) {
            if (result) {
              el.type = 'del'
            } else {
              state.departData.splice(index, 1)
            }
          }
        })
      }
    }
  }
  const handleNodeClick = (data: any, load: boolean, search?: string) => {
    if (typeof load == 'object' && typeof search == 'object') {
      searchValue.value = ''
    }
    if (typeof load !== 'boolean') {
      page.currentPage = 1
    } else if (typeof search == 'string') {
      page.currentPage = 1
    }
    state.loadID = data
    if (data.parentId == '0') {
      API.person
        .getFriends({
          data: {
            limit: page.pageSize,
            offset: handleCurrent.value,
            filter: typeof search == 'string' ? search : ''
          }
        })
        .then((res: ResultType) => {
          if (load == true) {
            state.centerTree.concat(res.data.result)
          } else {
            state.centerTree = res.data.result ? res.data.result : []
          }

          if (state.personsData.length > 0) {
            let arr: any[] = []
            state.personsData.forEach((el) => {
              if (el.type == 'add' || el.type == 'has') {
                arr.push(el.id)
              }
            })
            centerTree.value.setCheckedKeys(arr, true)
          }
        })
    } else {
      API.cohort
        .getPersons({
          data: {
            id: data.id,
            limit: page.pageSize,
            offset: handleCurrent.value,
            filter: typeof search == 'string' ? search : ''
          }
        })
        .then((res: ResultType) => {
          if (load == true) {
            state.centerTree.concat(res.data.result)
          } else {
            state.centerTree = res.data.result ? res.data.result : []
          }

          if (state.personsData.length > 0) {
            let arr: any[] = []
            state.personsData.forEach((el) => {
              if (el.type == 'add' || el.type == 'has') {
                arr.push(el.id)
              }
            })
            centerTree.value.setCheckedKeys(arr, true)
          }
        })
    }
  }
  const handleTreeData = (item: any) => {
    for (let i = 0; i < item.length; i++) {
      if (item[i].nodes) {
        handleTreeData(item[i].nodes)
      } else {
        item[i].nodes = []
      }
    }
  }
  const handleTabClick = (id: string) => {
    resource.value = id
  }
  const delContentAuth = (item: any) => {
    if (radio.value == '2') {
      if (item.type == 'del') {
        return
      } else if (item.type == 'add') {
        state.authorData.forEach((el, index) => {
          if (el.id == item.id) {
            state.authorData.splice(index, 1)
            centerTree.value.setChecked(item.id, false)
          }
        })
      } else {
        state.authorData.forEach((el, index) => {
          if (el.id == item.id) {
            el.type = 'del'
            if (state.centerTree.length !== 0) {
              centerTree.value.setChecked(el.id, false)
            }
          }
        })
      }
    } else if (radio.value == '3') {
      if (item.type == 'del') {
        return
      } else if (item.type == 'add') {
        state.personsData.forEach((el, index) => {
          if (el.id == item.id) {
            state.personsData.splice(index, 1)
            centerTree.value.setChecked(item.id, false)
          }
        })
      } else {
        state.personsData.forEach((el, index) => {
          if (el.id == item.id) {
            el.type = 'del'
            if (state.centerTree.length !== 0) {
              centerTree.value.setChecked(el.id, false)
            }
          }
        })
      }
    } else {
      if (item.type == 'del') {
        return
      } else if (item.type == 'add') {
        state.identitysData.forEach((el, index) => {
          if (el.id == item.id) {
            state.identitysData.splice(index, 1)
            centerTree.value.setChecked(item.id, false)
          }
        })
      } else {
        state.identitysData.forEach((el, index) => {
          if (el.id == item.id) {
            el.type = 'del'
            if (state.centerTree.length !== 0) {
              centerTree.value.setChecked(el.id, false)
            }
          }
        })
      }
    }
  }
  const delContent = (item: any) => {
    if (item.type == 'del') {
      return
    } else if (item.type == 'add') {
      state.departData.forEach((el, index) => {
        if (el.id == item.id) {
          state.departData.splice(index, 1)
          leftTree.value.setChecked(item.id, false)
        }
      })
    } else {
      state.departData.forEach((el, index) => {
        if (el.id == item.id) {
          el.type = 'del'
          leftTree.value.setChecked(el.id, false)
        }
      })
    }
  }

  const getCompanyTree = () => {
    API.cohort
      .getJoinedCohorts({
        data: { offset: 0, limit: 10000, filter: '' }
      })
      .then((res: ResultType) => {
        cascaderTree.value = res.data?.result ?? []
        let obj = {
          id: store.queryInfo.id,
          name: '我的好友',
          label: '我的好友',
          parentId: '0',
          data: {}
        }
        cascaderTree.value.unshift(obj)
        getHistoryData()
      })
  }
</script>

<style lang="scss" scoped>
  .footer-btn {
    margin-right: 10px;
  }
  .footer {
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
  }
  .demo-tabs {
    margin-left: 20px;
  }
  .cohortLayout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden !important;
    &-header {
      display: flex;
      align-items: center;
    }
    &-content {
      height: 360px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      &-left {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
      &-center {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
      &-right {
        border: 1px solid rgb(241, 241, 248);
        height: 100%;
        overflow: auto;
      }
    }
  }
  :deep(.el-tabs__header) {
    margin: unset;
  }
  :deep(.el-tabs__nav-wrap::after) {
    background-color: unset;
  }
  .cohortLayout-header-tabs {
    flex: 1;
  }
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
</style>
