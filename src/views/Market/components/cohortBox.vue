<template>
  <div class="cohortLayout">
    <div class="cohortLayout-header">
      <div class="cohortLayout-header-text">请选择资源：</div>
      <div class="cohortLayout-header-tabs">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane v-for="(item, index) in tabs" :key="item.id" :name="index">
            <template #label>
              <div slot="label" @click="handleTabClick(item.id)">{{ item.name }}</div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="cohortLayout-header" style="margin-top: 10px">
      <div class="cohortLayout-header-text">请选择分发方式：</div>
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
        <Author
          v-if="radio == '3'"
          @delContent="delContentAuth"
          :departData="state.personsData"
        ></Author>
        <Author
          v-if="radio == '4'"
          @delContent="delContentAuth"
          :departData="state.identitysData"
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
  }
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
        label: '按部门分发'
      },
      {
        id: '2',
        label: '按职权分发'
      },
      {
        id: '3',
        label: '按人员分发'
      },
      {
        id: '4',
        label: '按身份分发'
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
  const authorityProps = {
    label: 'name',
    children: 'nodes'
  }
  const unitProps = {
    label: 'label',
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
        if (newValue == '1') {
          getOrgHistoryData()
        } else if (newValue == '2' && state.authorData.length == 0) {
          getHistoryData()
        } else if (newValue == '3' && state.personsData.length == 0) {
          getHistoryData()
        } else if (newValue == '4' && state.identitysData.length == 0) {
          getHistoryData()
        }
      })
    }
  )
  watch(
    () => resource.value,
    (newValue, oldValue) => {
      state.authorData = []
      state.departData = []
      state.personsData = []
      state.identitysData = []
      if (radio.value == '1') {
        clearTreeType(cascaderTree.value)
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
    searchResource()
    getCompanyTree()
  })
  const emit = defineEmits(['closeDialog'])
  const closeDialog = () => {
    emit('closeDialog')
  }

  // 清除树形中的type
  const clearTreeType = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type) {
        delete data[i].type
        if (data[i].children.length !== 0) {
          clearTreeType(data[i].children)
        }
      } else {
        clearTreeType(data[i].children)
      }
    }
  }

  // 获取部门历史数据
  const getOrgHistoryData = () => {
    API.product
      .toDepartment({
        data: {
          id: resource.value,
          offset: 0,
          limit: 1000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (state.departData.length > 0) {
          let arr: any[] = []
          state.departData.forEach((el) => {
            if (el.type == 'add' || el.type == 'has') {
              arr.push(el.id)
            }
          })
          leftTree.value.setCheckedKeys(arr, true)
        } else {
          state.departHisData = res.data.result ? res.data.result : []
          leftTree.value.setCheckedKeys([])
          let arr: any[] = []
          state.departHisData.forEach((el) => {
            el.type = 'has'
            arr.push(el.id)
          })
          state.departData = state.departHisData
          leftTree.value.setCheckedKeys(arr, true)
        }
      })
  }

  // 获取历史数据（提交表单后）
  const getNewHistoryData = () => {
    switch (radio.value) {
      case '1':
        API.product
          .toDepartment({
            data: {
              id: resource.value,
              offset: 0,
              limit: 1000,
              filter: ''
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
            state.departData = JSON.parse(JSON.stringify(state.departHisData))
            leftTree.value.setCheckedKeys(arr, true)
          })
        break
      case '2':
        API.product
          .toAuthority({
            data: {
              id: resource.value,
              offset: 0,
              limit: 1000,
              filter: ''
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
      case '3':
        API.product
          .toPerson({
            data: {
              id: resource.value,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.personsHisData = res.data.result ? res.data.result : []
            centerTree.value.setCheckedKeys([])
            let arr: any[] = []
            state.personsHisData.forEach((el) => {
              el.type = 'has'
              arr.push(el.id)
            })
            state.personsData = state.personsHisData
            centerTree.value.setCheckedKeys(arr, true)
          })
        break
      case '4':
        API.product
          .toIdentity({
            data: {
              id: resource.value,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.identitysHisData = res.data.result ? res.data.result : []
            centerTree.value.setCheckedKeys([])
            let arr: any[] = []
            state.identitysHisData.forEach((el) => {
              el.type = 'has'
              arr.push(el.id)
            })
            state.identitysData = state.identitysHisData
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
          .toDepartment({
            data: {
              id: resource.value,
              offset: 0,
              limit: 1000,
              filter: ''
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
          .toAuthority({
            data: {
              id: resource.value,
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
            if (state.centerTree.length > 0) {
              centerTree.value.setCheckedKeys(arr, true)
            }
          })

        break
      case '3':
        API.product
          .toPerson({
            data: {
              id: resource.value,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.personsHisData = res.data.result ? res.data.result : []
            state.personsData = JSON.parse(JSON.stringify(state.personsHisData))
            let arr: any[] = []
            state.personsData.forEach((el) => {
              el.type = 'has'
              arr.push(el.id)
            })
            if (state.centerTree.length > 0) {
              centerTree.value.setCheckedKeys(arr, true)
            }
          })
        break
      case '4':
        API.product
          .toIdentity({
            data: {
              id: resource.value,
              offset: 0,
              limit: 1000,
              filter: ''
            }
          })
          .then((res: ResultType) => {
            state.identitysHisData = res.data.result ? res.data.result : []
            state.identitysData = JSON.parse(JSON.stringify(state.identitysHisData))
            let arr: any[] = []
            state.identitysData.forEach((el) => {
              el.type = 'has'
              arr.push(el.id)
            })
            if (state.centerTree.length > 0) {
              centerTree.value.setCheckedKeys(arr, true)
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
  const submitAll = () => {
    let departAdd: any[] = []
    let departDel: any[] = []
    let authorAdd: any[] = []
    let authorDel: any[] = []
    let personsAdd: any[] = []
    let personsDel: any[] = []
    let identityAdd: any[] = []
    let identityDel: any[] = []

    state.departData.forEach((el) => {
      if (el.type == 'add') {
        departAdd.push(el.id)
      } else if (el.type == 'del') {
        departDel.push(el.id)
      }
    })

    state.personsData.forEach((el) => {
      if (el.type == 'add') {
        personsAdd.push(el.id)
      } else if (el.type == 'del') {
        personsDel.push(el.id)
      }
    })

    state.authorData.forEach((el) => {
      if (el.type == 'add') {
        authorAdd.push(el.id)
      } else if (el.type == 'del') {
        authorDel.push(el.id)
      }
    })

    state.identitysData.forEach((el) => {
      if (el.type == 'add') {
        identityAdd.push(el.id)
      } else if (el.type == 'del') {
        identityDel.push(el.id)
      }
    })

    let promise1
    let promise2
    let promise3
    let promise4
    let promise5
    let promise6
    let promise7
    let promise8
    if (departAdd.length > 0) {
      promise1 = API.product.department({
        data: {
          resId: resource.value,
          targetIds: departAdd
        }
      })
    }
    if (departDel.length > 0) {
      promise5 = API.product.delteDeptment({
        data: {
          resId: resource.value,
          targetIds: departDel
        }
      })
    }
    if (authorAdd.length > 0) {
      promise2 = API.product.authority({
        data: {
          resId: resource.value,
          targetIds: authorAdd
        }
      })
    }

    if (authorDel.length > 0) {
      promise6 = API.product.delteAuthority({
        data: {
          resId: resource.value,
          targetIds: authorDel
        }
      })
    }
    if (personsAdd.length > 0) {
      promise3 = API.product.person({
        data: {
          resId: resource.value,
          targetIds: personsAdd
        }
      })
    }
    if (personsDel.length > 0) {
      promise7 = API.product.deltePerson({
        data: {
          resId: resource.value,
          targetIds: personsDel
        }
      })
    }
    if (identityAdd.length > 0) {
      promise4 = API.product.identity({
        data: {
          resId: resource.value,
          targetIds: identityAdd
        }
      })
    }
    if (identityDel.length > 0) {
      promise8 = API.product.delteIdentity({
        data: {
          resId: resource.value,
          targetIds: identityDel
        }
      })
    }
    Promise.all([promise1, promise2, promise3, promise4]).then((res) => {
      if (res) {
        ElMessageBox.confirm('分发成功，是否继续分发？', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            state.identitysData = []
            state.departData = []
            state.personsData = []
            state.authorData = []
            getNewHistoryData()
          })
          .catch(() => {
            closeDialog()
          })
      }
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
            state.departData.forEach((el) => {
              if (el.id == data.id) {
                el.type = 'has'
              }
            })
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
              data.type = 'del'
            } else {
              state.departData.splice(index, 1)
            }
          }
        })
      }
    }
  }
  const handleNodeClick = (data: Tree, load: boolean, search?: string) => {
    if (typeof load == 'object' && typeof search == 'object') {
      searchValue.value = ''
    }
    if (typeof load !== 'boolean') {
      page.currentPage = 1
    } else if (typeof search == 'string') {
      page.currentPage = 1
    }
    switch (radio.value) {
      case '2':
        state.loadID = data
        API.company
          .getAuthorityTree({
            data: {
              id: data.id,
              filter: typeof search == 'string' ? search : ''
            }
          })
          .then((res: ResultType) => {
            let arr: any[] = []
            arr.push(res.data)
            handleTreeData(arr)
            state.centerTree = arr
            if (state.authorData.length > 0) {
              let arr: any[] = []
              state.authorData.forEach((el, index) => {
                if (el.type == 'add' || el.type == 'has') {
                  arr.push(el.id)
                }
              })
              setTimeout(() => {
                centerTree.value.setCheckedKeys(arr, true)
              }, 300)
            }
          })
        break
      case '3':
        state.loadID = data
        if (data.data.parentId == '0') {
          API.company
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
        } else {
          API.company
            .getDepartmentPersons({
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

        break
      case '4':
        state.loadID = data
        API.company
          .getIdentities({
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

            if (state.identitysData.length > 0) {
              let arr: any[] = []
              state.identitysData.forEach((el) => {
                if (el.type == 'add' || el.type == 'has') {
                  arr.push(el.id)
                }
              })
              centerTree.value.setCheckedKeys(arr, true)
            }
          })
        break
      default:
        break
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
  const searchResource = () => {
    API.product
      .searchResource({
        data: {
          id: props.info.id,
          offset: 0,
          limit: 1000,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          tabs.value = res.data.result
          resource.value = res.data.result[0].id
        }
      })
  }

  // 节点ID和对象映射关系
  const parentIdMap: any = {}
  let cascaderTree = ref<OrgTreeModel[]>([])
  const getCompanyTree = () => {
    API.company.getCompanyTree({}).then((res: ResultType) => {
      let orgTree = []
      orgTree.push(res.data)
      initIdMap(orgTree)
      cascaderTree.value = filter(JSON.parse(JSON.stringify(orgTree)))
    })
  }
  // 初始化ID和对象映射关系
  const initIdMap = (nodes: any[]) => {
    for (const node of nodes) {
      parentIdMap[node.id] = node
      if (node.children) {
        initIdMap(node.children)
      }
    }
  }
  // 过滤掉工作组作为表单级联数据
  const filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
    nodes = nodes.filter((node) => node.data?.typeName !== '工作组')
    for (const node of nodes) {
      node.children = filter(node.children)
    }
    return nodes
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
