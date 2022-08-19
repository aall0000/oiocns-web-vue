<template>
  <div class="userUnit">
    <div class="title">
      <div class="body">
        <div class="created">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="1"> </el-tab-pane>
            <!-- <el-tab-pane label="已加入" name="2"></el-tab-pane>
              <el-tab-pane label="拒绝" name="3"> </el-tab-pane> -->
          </el-tabs>
          <div class="createdTop">
            <div class="topLeft">
              <el-input class="search" placeholder="搜索单位名" :suffix-icon="Search" />
            </div>
            <div class="topRight">
              <el-button type="primary" @click="addCompany = true">申请加入单位</el-button>
              <!-- <el-button>查看申请记录</el-button> -->
            </div>
          </div>
          <div class="createdBody">
            <el-table :data="dataList.list" stripe style="width: 98%">
              <el-table-column prop="name" label="单位名称" />
              <el-table-column prop="code" label="统一社会信用代码" />
              <el-table-column prop="isMain" label="是否主单位" />
              <el-table-column prop="belongId" label="管理员" />
              <el-table-column prop="createTime" label="创建时间" />
              <el-table-column prop="state" label="申请状态" />
              <el-table-column prop="option" label="操作">
                <template #default="scope">
                  <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
                    <template #reference>
                      <el-button type="danger">退出单位</el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog v-model="addCompany" title="搜索单位" width="30%">
            <el-select
              v-model="value"
              filterable
              remote
              reserve-keyword
              placeholder="搜索单位"
              :remote-method="remoteMethod"
              :loading="loading"
              style="width: 100%"
            >
              <el-option v-for="item in options" :key="item.value" :value="item.value" :label="`${item.label}(${item.name })`" style="height: 50px">
                <div
                  style="
                    height: 50px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    border-bottom: 1px solid #f0f2f5;
                  "
                >
                  <div style="height: 50px; margin-top: 5px">
                    <headImg
                      :name="item.name.slice(0, 1)"
                      style="transform: scale(0.7, 0.7); border-radius: 50px; font-size: 19px"
                    ></headImg>
                  </div>
                  <div style="height: 50px; margin-bottom: 5px">
                    <p
                      style="
                        height: 25px;
                        font-weight: 600;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      "
                      >{{ item.label }}({{ item.name }})</p
                    >
                    <p style="height: 25px; color: #ccc">{{ item.remark }}</p>
                  </div>
                </div>
              </el-option>
            </el-select>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="addCompany = false">取消</el-button>
                <el-button type="primary" @click="addCompanyFun">确认</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import { onMounted, reactive, ref } from 'vue'
  import $services from '@/services'
  import { useUserStore } from '@/store/user'
  import type { TabsPaneContext } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import headImg from '@/views/Chat/components/headImg.vue'
  const activeName = ref('1')
  //tab切换
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  const handleDelete = (id: string) => {
    $services.company
      .companyDelete({
        data: {
          id: id
        }
      })
      .then((res: ResultType) => {
        console.log('删除单位成功', res)
      })
  }
  type listItem = {
    id: string
    code: string
  }
  type listType = {
    list: Array<listItem>
  }
  const dataList = reactive<listType>({ list: [] })
  onMounted(() => {
    getList()
  })
  //获取单位列表
  const getList = () => {
    $services.company
      .getJoinedCompany({
        data: {
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        dataList.list = res.data.result
      })
  }
  interface ListItem {
    value: string
    label: string
    remark: string
    name: string
  }
  const addCompany = ref<boolean>(false)
  const options = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)
  const remoteMethod = (query: string) => {
    if (query) {
      $services.company
        .searchCompany({
          data: {
            text: query,
            offset: 0,
            limit: 10
          }
        })
        .then((res: ResultType) => {
          if (res.data.result) {
            let states = res.data.result
            let arr: { value: any; label: any; remark: any; name: any }[] = []
            states.forEach((el: any) => {
              let obj = {
                value: el.id,
                label: el.name,
                remark: el.team.remark,
                name: el.team.name
              }
              arr.push(obj)
            })
            options.value = arr
            loading.value = false
          } else {
            options.value = []
            loading.value = false
          }
        })
    } else {
      options.value = []
    }
  }
  const addCompanyFun = () => {
    $services.company
      .applyJoin({
        data: {
          id: value.value
        }
      })
      .then((res: ResultType) => {
        ElMessage({
          message: '申请成功',
          type: 'warning'
        })
        addCompany.value = false
      })
  }
</script>
<style lang="scss" scoped>
  .userUnit {
    height: calc(100vh - 230px);
    background-color: #fff;
    .pageHeader {
      width: 100%;
      height: 35px;
      background-color: #fff;
    }
    .title {
      :deep(.el-tabs__item) {
        font-size: 20px !important;
        font-weight: 600;
        margin-left: 30px;
        border-color: #1a5773;
      }
      :deep(.el-tabs__header) {
        margin: 0;
      }
      .body {
        height: 600px;
        width: 100%;
        border-left: 10px solid #eff0f4;
        border-top: 16px solid #eff0f4;
        border-right: 16px solid #eff0f4;
        display: flex;
      }
    }
    .bottom {
      height: calc(100vh - 770px);
      background-color: #eff0f4;
      display: flex;
      .content {
        margin: auto;
        color: #aaa;
      }
    }
  }
  .created {
    width: 100%;
    height: 100vh;
    background: #fff;
    .createdTop {
      width: 95%;
      margin: 30px;
      display: flex;
      justify-content: space-between;
    }
    .createdBody {
      margin: 30px;
      .createdBottom {
        position: absolute;
        right: 30px;
        bottom: 30px;
      }
    }
  }
</style>
