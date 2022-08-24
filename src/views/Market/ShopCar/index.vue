<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <span class="top">  
          <el-checkbox :v-model="allchecked.checked" @change="checkAll">全选</el-checkbox></span
        >
        <span class="top">
          <!-- <el-switch v-model="viewModel" active-text="列表" inactive-text="卡片"/> -->
        </span>
        <span class="top">
          <el-pagination
            class="page-pagination"
            @size-change="(e) => handlePaginationChange(e, 'limit')"
            @current-change="(e) => handlePaginationChange(e, 'current')"
            small
            background
            :page-sizes="pageSizes"
            v-model:currentPage="pagination.current"
            v-model:page-size="pagination.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageStore.total"
          />
        </span>
      </el-header>
      <el-main class="main-content">
        <el-row :gutter="12" v-loading="false" v-if="isRouterAlive">
          <!-- date遍历循环的数据 -->
          <el-col :span="4" v-for="item in pageStore.tableData" :key="item.id">
            <el-card shadow="hover"
              ><!--style="background-color: #5daf34"  灰 #e1e1e1 绿 #5daf34-->
              <!-- 卡片的头部位 -->
              <template #header>
                <div class="card-header">
                  <!-- 
              	这里声明一下,我在多选时,往数组中添加的是对象
              	label属性:是多选框的值,若该标签中无内容,则该属性也充当 checkbox 按钮后的介绍
              	@change:改变事件,多选框勾选和取消勾选都会触发事件,所以在取消勾选时要删除勾选状态下的值
              -->
                  <el-checkbox
                    v-model="item.checked"
                    :label="item.id"
                    @change="checkedChange(item)"
                    >{{ item.merchandise.caption }}</el-checkbox
                  >{{  '市场名称' || item.merchandise.caption }}
                  <div>
                    <!-- 删除按钮 -->
                    <el-button type="text" icon="el-icon-delete" @click="deleteStaging(item.id)" />
                  </div>
                </div>
              </template>
              <!-- 卡片显示的内容 -->
              <div>
                <img
                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                  class="image"
                />
                <div style="padding: 14px">
                  <span>{{item.merchandise.information}}</span>
                  <div class="bottom">
                    <time class="time">{{ new Date() }}</time>
                    <el-button text class="button">Operating</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="footer">
        <div class="send-box">
          <el-button type="warning" @click="deleteStagings">删除</el-button>
          <el-button type="warning" @click="createOrderByStaging">购买</el-button>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import $services from '@/services'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PAGE_SIZES, PAGE_NUM } from '@/constant'

// 表格分页数据
const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  total: 0
})
const viewModel = ref(true)
const loading = ref(false)
const isRouterAlive = ref(true)
const allchecked = reactive({anyData: [],checked:false})
const pageSizes = ref<Array<any>>(PAGE_SIZES)
onMounted(() => {
  getTableList()
})


//查询
const getTableList = async () => {
  isRouterAlive.value = false
  await $services.market
    .searchStaging({
      data: {
        id:'349921163721445376', //市场id （需删除）
        offset: (pagination.current - 1) * pagination.limit,
        limit: pagination.limit,
        filter: ''
      }
    })
    .then((res: ResultType) => {
  
      var { result = [], total = 0 } = res.data
      // debugger
      
      result = result.length>0?result: [
        {
          id: '348129171096636636',
          name: '邵一刀的待出售订单(海贼王-白胡子手办)2022-02-22 14:05:30',
          code: 'syd_20200222_001',
          status: 1,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '233',
            name: '闲鱼',
            code: 'market_xy_001',
            remark: '闲鱼'
          },
          merchandise: {
            caption: '海贼王-白胡子手办',
            price: 500
          }
        },
        {
          id: '348129171098145636',
          name: '邵一刀的出售订单(原神初始号)2022-02-22 14:05:30',
          code: 'syd_20200222_001',
          status: 200,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '222',
            name: '游戏商城',
            code: 'market_yx_001',
            remark: '游戏商城'
          },
          merchandise: {
            caption: '原神初始号',
            price: 500
          }
        },
        {
          id: '348129171092213532',
          name: '邵一刀的出售订单(原神-钟离雷神号)2022-03-21 12:36:30',
          code: 'syd_20200321_001',
          status: 201,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '222',
            name: '游戏商城',
            code: 'market_yx_001',
            remark: '游戏商城'
          },
          merchandise: {
            caption: '原神-钟离雷神号',
            price: 500
          }
        },
        {
          id: '348129171265102421',
          name: '邵一刀的出售订单(二手小台灯)2022-02-05 10:16:30',
          code: 'syd_20200205_001',
          status: 202,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '233',
            name: '闲鱼',
            code: 'market_xy_001',
            remark: '闲鱼'
          },
          merchandise: {
            caption: '二手小台灯',
            price: 500
          }
        },
        {
          id: '348129171265102421',
          name: '邵一刀的出售订单(书籍-茶花女)2022-02-05 10:16:30',
          code: 'syd_20200205_003',
          status: 203,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '255',
            name: '当当网',
            code: 'market_ddw_001',
            remark: '当当网'
          },
          merchandise: {
            caption: '书籍-茶花女',
            price: 500
          }
        },
        {
          id: '348129171265102463',
          name: '邵一刀的出售订单(潮鞋-椰子鞋2022新年特供)2022-02-05 10:16:30',
          code: 'syd_20200205_005',
          status: 204,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '301',
            name: '抖音商城',
            code: 'market_dy_001',
            remark: '抖音商城'
          },
          merchandise: {
            caption: '潮鞋-椰子鞋2022新年特供',
            price: 500
          }
        },

        {
          id: '348129171098145636',
          name: '邵一刀的出售订单(原神初始号)2022-02-22 14:05:30',
          code: 'syd_20200222_001',
          status: 200,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '222',
            name: '游戏商城',
            code: 'market_yx_001',
            remark: '游戏商城'
          },
          merchandise: {
            caption: '原神初始号',
            price: 500
          }
        },
        {
          id: '348129171092213532',
          name: '邵一刀的出售订单(原神-钟离雷神号)2022-03-21 12:36:30',
          code: 'syd_20200321_001',
          status: 201,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '222',
            name: '游戏商城',
            code: 'market_yx_001',
            remark: '游戏商城'
          },
          merchandise: {
            caption: '原神-钟离雷神号',
            price: 500
          }
        },
        {
          id: '348129171265102421',
          name: '邵一刀的出售订单(二手小台灯)2022-02-05 10:16:30',
          code: 'syd_20200205_001',
          status: 202,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '233',
            name: '闲鱼',
            code: 'market_xy_001',
            remark: '闲鱼'
          },
          merchandise: {
            caption: '二手小台灯',
            price: 500
          }
        },
        {
          id: '348129171265102421',
          name: '邵一刀的出售订单(书籍-茶花女)2022-02-05 10:16:30',
          code: 'syd_20200205_003',
          status: 203,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '255',
            name: '当当网',
            code: 'market_ddw_001',
            remark: '当当网'
          },
          merchandise: {
            caption: '书籍-茶花女',
            price: 500
          }
        },
        {
          id: '348129171265102463',
          name: '邵一刀的出售订单(潮鞋-椰子鞋2022新年特供)2022-02-05 10:16:30',
          code: 'syd_20200205_005',
          status: 204,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '301',
            name: '抖音商城',
            code: 'market_dy_001',
            remark: '抖音商城'
          },
          merchandise: {
            caption: '潮鞋-椰子鞋2022新年特供',
            price: 500
          }
        },

        {
          id: '348129171098145636',
          name: '邵一刀的出售订单(原神初始号)2022-02-22 14:05:30',
          code: 'syd_20200222_001',
          status: 200,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '222',
            name: '游戏商城',
            code: 'market_yx_001',
            remark: '游戏商城'
          },
          merchandise: {
            caption: '原神初始号',
            price: 500
          }
        },
        {
          id: '348129171092213532',
          name: '邵一刀的出售订单(原神-钟离雷神号)2022-03-21 12:36:30',
          code: 'syd_20200321_001',
          status: 201,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '222',
            name: '游戏商城',
            code: 'market_yx_001',
            remark: '游戏商城'
          },
          merchandise: {
            caption: '原神-钟离雷神号',
            price: 500
          }
        },
        {
          id: '348129171265102421',
          name: '邵一刀的出售订单(二手小台灯)2022-02-05 10:16:30',
          code: 'syd_20200205_001',
          status: 202,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '233',
            name: '闲鱼',
            code: 'market_xy_001',
            remark: '闲鱼'
          },
          merchandise: {
            caption: '二手小台灯',
            price: 500
          }
        },
        {
          id: '348129171265102421',
          name: '邵一刀的出售订单(书籍-茶花女)2022-02-05 10:16:30',
          code: 'syd_20200205_003',
          status: 203,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '255',
            name: '当当网',
            code: 'market_ddw_001',
            remark: '当当网'
          },
          merchandise: {
            caption: '书籍-茶花女',
            price: 500
          }
        },
        {
          id: '348129171265102463',
          name: '邵一刀的出售订单(潮鞋-椰子鞋2022新年特供)2022-02-05 10:16:30',
          code: 'syd_20200205_005',
          status: 204,
          createUser: '338792423297781760',
          updateUser: '348098798750404608',
          version: '3',
          createTime: '2022-08-18 15:41:02.000',
          updateTime: '2022-08-18 16:16:59.000',
          market: {
            id: '301',
            name: '抖音商城',
            code: 'market_dy_001',
            remark: '抖音商城'
          },
          merchandise: {
            caption: '潮鞋-椰子鞋2022新年特供',
            price: 500
          }
        }
      ]
      pageStore.total = result.length
      result.forEach((item: any) => {
        item.ordertype = 'sell'
        item.checked = false
        return item
      })
      pageStore.tableData = result?.map(
        (item: { market: { remark: any; code: any; name: any },merchandise: {caption:any,information:any,price:any} }) => {
          return {
            ...item
          }
        }
      )
      console.log('pageStore.tableData', pageStore.tableData)
          isRouterAlive.value = true
    })
}

const checkAll = (e:any) => {
  allchecked.checked = e
  console.log(allchecked.checked)
  pageStore.tableData.forEach((item) => {
    item.checked = allchecked.checked
    return item
  })
}
// 处理表格分页操作
const handlePaginationChange = (newVal: number, type: 'current' | 'limit') => {
  pagination[type] = newVal
  getTableList()
}

//创建订单(批量)
const createOrderByStaging = async () => {
  var checkedStagIds = pageStore.tableData.filter(item=>item.checked).map(item=>item.id)
  console.log(checkedStagIds)
  if(checkedStagIds.length<=0){
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
  }
  await $services.market
    .createOrderByStaging({
      data: {
        name: '订单22',
        code: 'order22',
        stagIds: checkedStagIds
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        getTableList()
        ElMessage({
          message: '创建订单成功',
          type: 'warning'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
}

//从购物车移除 (批量)
const deleteStagings = () => {
  //检查数据
  var checkedRecords = pageStore.tableData.filter(item=>item.checked)
  if(checkedRecords.length<=0){
      ElMessage({
        message: '请选择商品',
        type: 'warning'
      })
      return
  }
  //要改为并发删除
  for(let item of pageStore.tableData){
    if (item.checked) {
      $services.market
      .deleteStaging({
        data: {
          id: item.id
        }
      })
    }
  }
  getTableList()
  ElMessage({
    message: '移除成功',
    type: 'success'
  })


}
//从购物车移除
const deleteStaging = async (id: string) => {
  console.log(id)
  await $services.market
    .deleteStaging({
      data: {
        id: id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        getTableList()
        ElMessage({
          message: '移除成功',
          type: 'warning'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
}
//选中/取消选中
const checkedChange = (item: any) => {
  console.log(item.checked)
}
</script>


<style scoped>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}

.main-content {
  width: 100%;
  height: 95%;
  overflow-y: auto;
  top: 60px;
  position: absolute;
}

.top {
  display: inline-block;
  margin-right: 10px;
}

.header {
  height: 60px; /*设定footer高度*/
  position: absolute; /*设定footer绝对位置在底部*/
  top: 0;
  width: 100%; /*展开footer宽度*/
  line-height: 60px;
}
.footer {
  height: 60px; /*设定footer高度*/
  position: absolute; /*设定footer绝对位置在底部*/
  bottom: 0;
  width: 100%; /*展开footer宽度*/
  background-color: gray;
  line-height: 60px;
}

.send-box {
  justify-content: flex-end;
  text-align: center;
  margin-left: 30px;
}
</style>
