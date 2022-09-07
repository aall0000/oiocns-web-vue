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
        <Author v-if="radio == '1'" @delContent="delContent" :orgData="state.orgData"></Author>
        <Author
          v-if="radio == '2'"
          @delContent="delContentAuth"
          :orgData="state.authorData"
        ></Author>
        <Author
          v-if="radio == '3'"
          @delContent="delContentAuth"
          :orgData="state.personsData"
        ></Author>
        <Author
          v-if="radio == '4'"
          @delContent="delContentAuth"
          :orgData="state.identitysData"
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
  interface Tree {
    id: string
    label: string
    data?: any
    children?: Tree[]
  }
  type createInfo = {
    info: ProductType
    groupId: string
  }
  const searchValue = ref('')
  const searchLeftValue = ref('')
  const cascaderTree = ref([])
  const activeName = ref(0)
  const tabs = ref([])
  const radio = ref('1')
  const leftTree = ref(null)
  const centerTree = ref(null)
  const resource = ref<string>('')
  const store = useUserStore()
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
    orgData: [], // 集团分发右侧数据
    rightData: [], // 集团分发历史数据
    centerTree: [], // 职权分发中间树形
    authorHisData: [], // 职权历史数据
    authorData: [], // 职权右侧数据
    personsHisData: [], // 人员历史数据
    personsData: [], // 人员右侧数据
    identitysData: [], //身份右侧数据
    identitysHisData: [] // 身份历史数据
  })
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
      getNewHistoryData()
      // nextTick(() => {
      //   if (newValue == '1' && state.orgData.length > 0) {
      //     let arr: any[] = []
      //     let err: any[] = []
      //     state.rightData.forEach((el) => {
      //       state.orgData.forEach((al) => {
      //         if (el.id == al.id) {
      //           al.type = 'has'
      //         }
      //       })
      //     })
      //     state.orgData.forEach((el) => {
      //       if (el.type == 'add' || el.type == 'has') {
      //         arr.push(el.id)
      //       } else {
      //         err.push(el)
      //       }
      //     })
      //     state.orgData = []
      //     err.forEach((el) => {
      //       state.orgData.push(el)
      //     })
      //     leftTree.value.setCheckedKeys(arr, true)
      //   } else if (newValue == '2') {
      //     getHistoryData(false)
      //   }
      // })
      //   getHistoryData(false)
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

  const getCompanyTree = () => {
    API.cohort
      .getJoinedCohorts({
        data: { offset: 0, limit: 10000, filter: '' }
      })
      .then((res: any) => {
        let obj = res.data.result
        cascaderTree.value = obj
        getHistoryData(false)
      })
  }

  const getRadioHistory = () => {
    switch (radio.value) {
      case '1':
        API.product
          .searchGroupShare({
            data: {
              id: props.info.id,
              teamId: store.queryInfo.team.id,
              offset: 0,
              limit: 10000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            if (res.success) {
              state.rightData = res.data.result ? res.data.result : []
              if (state.rightData.length > 0) {
                let arr: any[] = []
                state.rightData.forEach((el) => {
                  el.type = 'has'
                  arr.push(el.id)
                })
                state.orgData = state.rightData
                leftTree.value.setCheckedKeys(arr, true)
                if (state.orgData.length > 0) {
                  let err: any[] = []
                  state.orgData.forEach((al) => {
                    if (al.type == 'add') {
                      err.push(al.id)
                    }
                    state.rightData.forEach((el) => {
                      if (el.id == al.id) {
                        al.type = 'has'
                      }
                    })
                  })
                }
              }
            }
          })
        break
      case '2':
        API.product
          .searchUnitShare({
            data: {
              id: props.info.id,
              teamId: props.groupId,
              offset: 0,
              limit: 10000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            if (res.success) {
              state.authorHisData = res.data.result ? res.data.result : []
              if (state.authorHisData.length > 0) {
                let arr: any[] = []
                state.authorHisData.forEach((el) => {
                  arr.push(el.id)
                })
                centerTree.value.setCheckedKeys(arr, true)
                if (state.authorData.length > 0) {
                  let err: any[] = []
                  state.authorData.forEach((al) => {
                    if (al.type == 'add') {
                      err.push(al.id)
                    }
                    state.authorHisData.forEach((el) => {
                      if (el.id == al.id) {
                        al.type = 'has'
                      }
                    })
                  })
                  centerTree.value.setCheckedKeys(err, true)
                } else {
                  state.authorData = state.authorHisData
                }
              }
            }
          })
        break
      default:
        break
    }
  }

  const getNewHistoryData = () => {
    switch (radio.value) {
      case '1':
        API.product
          .searchGroupShare({
            data: {
              id: props.info.id,
              teamId: store.queryInfo.team.id,
              offset: 0,
              limit: 10000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            if (res.success) {
              state.rightData = res.data.result ? res.data.result : []
              if (state.rightData.length > 0) {
                let arr: any[] = []
                state.rightData.forEach((el) => {
                  el.type = 'has'
                  arr.push(el.id)
                })
                state.orgData = state.rightData
                leftTree.value.setCheckedKeys(arr, true)
                if (state.orgData.length > 0) {
                  let err: any[] = []
                  state.orgData.forEach((al) => {
                    if (al.type == 'add') {
                      err.push(al.id)
                    }
                    state.rightData.forEach((el) => {
                      if (el.id == al.id) {
                        al.type = 'has'
                      }
                    })
                  })
                }
              }
            }
          })
        break
      case '2':
        API.product
          .searchUnitShare({
            data: {
              id: props.info.id,
              teamId: props.groupId,
              offset: 0,
              limit: 10000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            if (res.success) {
              state.authorHisData = res.data.result ? res.data.result : []
              if (state.authorHisData.length > 0) {
                let arr: any[] = []
                state.authorHisData.forEach((el) => {
                  arr.push(el.id)
                })
                centerTree.value.setCheckedKeys(arr, true)
                if (state.authorData.length > 0) {
                  let err: any[] = []
                  state.authorData.forEach((al) => {
                    if (al.type == 'add') {
                      err.push(al.id)
                    }
                    state.authorHisData.forEach((el) => {
                      if (el.id == al.id) {
                        al.type = 'has'
                      }
                    })
                  })
                  centerTree.value.setCheckedKeys(err, true)
                } else {
                  state.authorData = state.authorHisData
                }
              }
            }
          })
        break
      default:
        break
    }
  }
  // 获取历史数据
  const getHistoryData = (clear: boolean) => {
    switch (radio.value) {
      case '1':
        API.product
          .searchGroupShare({
            data: {
              id: props.info.id,
              teamId: store.queryInfo.team.id,
              offset: 0,
              limit: 10000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            if (res.success) {
              state.rightData = res.data.result ? res.data.result : []
              if (state.rightData.length > 0) {
                let arr: any[] = []
                state.rightData.forEach((el) => {
                  arr.push(el.id)
                })
                leftTree.value.setCheckedKeys(arr, true)
                if (state.orgData.length > 0) {
                  let err: any[] = []
                  state.orgData.forEach((al) => {
                    if (al.type == 'add') {
                      err.push(al.id)
                    }
                    state.rightData.forEach((el) => {
                      if (el.id == al.id) {
                        al.type = 'has'
                      }
                    })
                  })
                  if (!clear) {
                    leftTree.value.setCheckedKeys(err, true)
                  }
                }
              }
            }
          })
        break
      case '2':
        API.product
          .searchUnitShare({
            data: {
              id: props.info.id,
              teamId: props.groupId,
              offset: 0,
              limit: 10000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            if (res.success) {
              state.authorHisData = res.data.result ? res.data.result : []
              if (state.authorHisData.length > 0) {
                let arr: any[] = []
                state.authorHisData.forEach((el) => {
                  arr.push(el.id)
                })
                centerTree.value.setCheckedKeys(arr, true)
                if (state.authorData.length > 0) {
                  let err: any[] = []
                  state.authorData.forEach((al) => {
                    if (al.type == 'add') {
                      err.push(al.id)
                    }
                    state.authorHisData.forEach((el) => {
                      if (el.id == al.id) {
                        al.type = 'has'
                      }
                    })
                  })
                  centerTree.value.setCheckedKeys(err, true)
                } else {
                  state.authorData = state.authorHisData
                }
              }
            }
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
    state.orgData.forEach((el) => {
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
          teamId: store.queryInfo.team.id,
          targetIds: departAdd
        }
      })
    }
    if (departDel.length > 0) {
      promise2 = API.product.deleteGroupShare({
        data: {
          productId: props.info.id,
          teamId: store.queryInfo.team.id,
          targetIds: departDel
        }
      })
    }
    if (authorAdd.length > 0) {
      promise3 = await API.product.share({
        data: {
          productId: props.info.id,
          teamId: store.queryInfo.team.id,
          targetIds: authorAdd
        }
      })
    }
    if (authorDel.length > 0) {
      promise4 = API.product.department({
        data: {
          productId: props.info.id,
          teamId: store.queryInfo.team.id,
          targetIds: authorAdd
        }
      })
    }
    Promise.all([promise1, promise2, promise3, promise4]).then((res) => {
      ElMessage({
        type: 'success',
        message: '分享成功'
      })
      setTimeout(() => {
        getNewHistoryData()
        // getHistoryData(true)
      }, 300)
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
          el.type = 'del'
        } else {
          dataList.splice(index, 1)
        }
      }
    })
  }
  const handleBoxClick = (hisData: any, dataList: any, data: any) => {
    if (hisData) {
      let result = hisData.some((item: any) => {
        return item.id == data.id
      })
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].id == data.id) {
          if (data.type == 'add') {
            return
          }
        }
      }
      if (result) {
        data.type = 'has'
        dataList.push(data)
      } else {
        data.type = 'add'
        dataList.push(data)
      }
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
        let result = state.rightData.some((item: any) => {
          return item.id == data.id
        })
        for (let i = 0; i < state.orgData.length; i++) {
          if (state.orgData[i].id == data.id) {
            if (data.type == 'add') {
              return
            } else if (data.type == 'del') {
              state.orgData[i].type = 'has'
              return
            }
          }
        }
        if (result) {
          data.type = 'has'
          state.orgData.push(data)
        } else {
          data.type = 'add'
          state.orgData.push(data)
        }
      }
    } else {
      if (radio.value == '1') {
        let result = state.rightData.some((item: any) => {
          return item.id == data.id
        })
        state.orgData.forEach((el, index) => {
          if (el.id == data.id) {
            if (result) {
              el.type = 'del'
            } else {
              state.orgData.splice(index, 1)
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
            el.type == 'del'
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
            el.type == 'del'
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
            el.type == 'del'
          }
        })
      }
    }
  }
  const delContent = (item: any) => {
    if (item.type == 'del') {
      return
    } else if (item.type == 'add') {
      state.orgData.forEach((el, index) => {
        if (el.id == item.id) {
          state.orgData.splice(index, 1)
          leftTree.value.setChecked(item.id, false)
        }
      })
    } else {
      state.orgData.forEach((el, index) => {
        if (el.id == item.id) {
          el.type = 'del'
          leftTree.value.setChecked(el.id, false)
        }
      })
    }
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
