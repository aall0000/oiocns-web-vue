<template>
  <div class="market-layout">
    <el-card shadow="always" class="market-head flex">
      <el-button type="primary">注册</el-button>
      <el-button type="primary">订单</el-button>
      <el-button type="primary">市场</el-button>
    </el-card>
    <div class="market-content box">
      <ul class="box-ul">
        <p class="box-ul-title">我的应用</p>
        <li class="app-card">
          <ShopCard v-for="item in baseData" :info="item" :key="item.id">
            <template #footer>
              <el-dropdown @command="handleCommand">
                <el-button class="btn" type="primary" link small @click="hadleClick(item)">
                  设置
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="action in actionOptionsOfOwn" :command="action.value">
                      {{ action.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-divider direction="vertical" />
              <el-button class="btn" link small @click="deleteApp(item)">移除应用</el-button>
            </template>
          </ShopCard>
        </li>
        <el-pagination style="justify-content: end" layout="prev, pager, next" :total="50" />
      </ul>
      <ul class="box-ul">
        <p class="box-ul-title">其他应用</p>
        <li class="app-card">
          <ShopCard v-for="item in baseData" :info="item" :key="item.id">
            <template #footer>
              <el-dropdown @command="(value)=>handleCommand('other',value)">
                <el-button class="btn" type="primary" link small @click="hadleClick(item)">
                  设置
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="action in actionOptionsOfOther" :command="action.value">
                      {{ action.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-divider direction="vertical" />
              <el-button class="btn" link small @click="deleteApp(item)">移除应用</el-button>
            </template>
          </ShopCard>
        </li>
        <el-pagination style="justify-content: end" layout="prev, pager, next" :total="50" />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import API from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { computed, onMounted } from 'vue'
  import ShopCard from './components/shopCard.vue'
  import { baseData, actionOptionsOfOther, actionOptionsOfOwn } from './config'

  onMounted(() => {
    // 获取列表
    getPageList()
  })

  // 获取我的应用列表
  const getPageList = () => {
    const { result, success } = API.product.queryOwnResource({
      data: { offset: 0, limit: 10, filter: '' }
    })

    console.log('获取展示列表', result, success)
  }

  const deleteApp = (item: any) => {
    console.log('删除', item)
    ElMessageBox.confirm(`确认删除  ${item.name}?`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const { success } = API.product.deleteResource({
          data: { id: item.id }
        })
        if (success) {
          getPageList()
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
        }
      })
      .catch(() => {})
  }

  const hadleClick = (item: any) => {
    console.log('村上春树', item.name)
  }
</script>

<style lang="scss" scoped>
  :deep(.el-card__body) {
    padding: 0;
  }
  .market-layout {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    .market-head {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
      padding: 0 20px;
    }
    .market-content {
      padding: 16px 16px 0;
      // margin-top: 4px;
      height: calc(100vh - 124px);
      overflow-y: auto;
    }
    .box {
      .box-ul + .box-ul {
        margin-top: 10px;
      }
      &-ul {
        background-color: #fff;
        padding: 10px 24px;

        &-title {
          font-weight: bold;
          padding: 8px 0;
        }
        .app-card {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
