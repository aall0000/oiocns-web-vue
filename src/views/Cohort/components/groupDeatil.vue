<template>
  <div class="group-detail-wrap">
    <h1 class="title">群详情</h1>
    <ul class="base flex border-b">
      <img class="base-img" src="@/assets/img/toux.jpg" alt="" srcset="" />
      <li class="base-info">
        <div class="base-info-top flex">
          <p class="base-info-top-name">{{ detail.name }}</p>
          <el-tag size="small">标签</el-tag>
        </div>
        <div class="base-info-desc">{{ detail.remark }}</div>
      </li>
    </ul>
    <!-- 组成员 -->
    <ul class="user-list border-b">
      <li class="li-search con">
        <p class="li-search-con"
          >组成员<span class="li-search-con-num">{{ total }}</span
          >人</p
        >
        <el-input class="li-search-inp" placeholder="搜索成员">
          <template #suffix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
      </li>
      <!-- <li class="con">
        <el-button type="primary">组织架构</el-button>
      </li> -->
      <ul class="img-list con">
        <li class="img-list-add" @click="openDialogAdd">+</li>
        <li class="img-list-del">-</li>
        <li class="img-list-con" v-for="item in userList" :key="item.id">
          <img class="img-list-con-img" src="@/assets/img/x.png" alt="" />
          <span class="img-list-con-name">{{ item.name }}</span>
        </li>
        <span v-show="total > 12" class="img-list-more-btn" @click="handleViewMoreUser"
          >查看更多</span
        >
      </ul>
    </ul>
    <li class="con setting-con border-b">
      <span class="con-label">我在本群昵称</span>
      <span class="con-value">测试昵称</span>
    </li>
    <li class="con setting-con border-b">
      <span class="con-label">群备注</span>
      <span class="con-value">{{ detail.remark }}</span>
    </li>
    <li class="con check-con">
      <el-checkbox v-model="state.isIgnoreMsg" label="设置群消息免打扰" />
    </li>
    <li class="con check-con">
      <el-checkbox v-model="state.isStick" label="置顶该群" />
    </li>
    <div class="footer">
      <el-button type="danger" plain>退出该群</el-button>
      <el-button type="danger">解散该群</el-button>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="邀请好友" width="30%">
    <div class="invitateBox">
      <div
        class="invitateBox-box"
        v-for="(item, index) in state.friendsData"
        :key="item.id"
        @click="onClickBox(item, index)"
      >
        <div class="invitateBox-flex">
          <img src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg" alt="" />
          <div class="invitateBox-name">{{ item.name }}</div>
        </div>
        <div
          class="invitateBox-btn"
          :style="state.ids.includes(item.id) ? 'background:#466DFF' : ''"
        >
          <div class="invitateBox-btn-in" v-if="state.ids.includes(item.id)"></div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitInvite">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import API from '@/services'
  import { reactive, ref, onMounted, toRefs, watch } from 'vue'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/store/user'

  interface itemResult {
    code: string
    createTime: string
    createUser: string
    id: string
    name: string
    status: number
    thingId: string
    typeName: string
    updateTime: string
    updateUser: string
    version: string
  }

  type infoType = {
    detail: teamType
    userList: userType[]
    total: number
  }
  type prop = {
    id: string
    info: infoType
  }
  const { id, info } = defineProps<prop>()
  const { userList, total, detail } = toRefs(info)
  const store = useUserStore()
  const dialogVisible = ref(false)

  const state = reactive({
    userList: [], //群成员
    total: 0, //总数
    isEditNickName: false, //是否编辑昵称
    isQunName: false, //是否编辑群名称
    isIgnoreMsg: false, //是否免打扰信息
    isStick: false, //是否置顶
    friendsData: [], // 我的好友
    ids: [] // 所选择到的好友id列表
  })

  const qunName = ref<string>('')
  const nickName = ref<string>('')
  onMounted(() => {
    id && getQunPerson(id)
    console.log('44', id, info)
  })

  let current = ref(0)

  // 获取群成员
  const getQunPerson = async (id: string) => {
    const { data, err } = await API.cohort.getPersons({
      data: {
        id,
        offset: 0,
        limit: 10
      }
    })
    if (!err) {
      console.log('获取群成员', data)
      const { result = [], total = 0 } = data
      state.userList = result
      state.total = total
    }
  }

  const isShowMoreUser = ref<boolean>(false)
  const handleViewMoreUser = () => {
    isShowMoreUser.value = true
  }

  // const emit = defineEmits(['submitInfo'])

  // const submit = () => {
  //   console.log('submit')

  //   emit('submitInfo', textarea)
  // }

  // 选择人员事件
  const onClickBox = (item: itemResult, index: number) => {
    if (state.ids.indexOf(item.id) !== -1) {
      state.ids.splice(state.ids.indexOf(item.id), 1)
    } else {
      state.ids.push(item.id)
    }
  }
  // 确认邀请人员入群
  const submitInvite = () => {
    $services.cohort
      .pullPerson({
        data: {
          id: info.detail.id,
          targetIds: state.ids
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '邀请成功',
            type: 'warning'
          })
          dialogVisible.value = false
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }

  const openDialogAdd = () => {
    dialogVisible.value = true
    $services.person
      .getFriends({
        data: {
          offset: current.value,
          limit: 10
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.friendsData = res.data.result
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
</script>

<style lang="scss" scoped>
  .img-list-add {
    cursor: pointer;
    width: 50px;
    height: 50px;
    background: #ffffff;
    border-radius: 2px;
    color: rgba(0, 0, 0, 0.45);
    border: 1px dashed #bfbfbf;
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
  }
  .img-list-del {
    width: 50px;
    height: 50px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #ea4c43;
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ea4c43;
    margin-right: 16px;
  }
  .img-list-del {
  }
  .invitateBox {
    width: 100%;
    height: 500px;
    overflow: auto;
    &-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        background-size: 100% 100%;
        border-radius: 50%;
      }
    }
    &-name {
      margin-left: 20px;
    }
    &-box {
      height: 60px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      justify-content: space-between;
      cursor: pointer;
    }
    &-btn {
      width: 16px;
      height: 16px;
      background: #f3f4f9;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      &-in {
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
      }
    }
  }
  .group-detail-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 340px;
    border-left: 1px solid #ccc;
    padding: 15px;

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    // 群基本信息
    .base {
      align-items: center;
      padding-bottom: 15px;

      &-img {
        width: 60px;
        height: 60px;
        margin-right: 15px;
        border-radius: 50%;
      }

      &-info {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        height: 100%;

        &-top {
          align-items: center;

          &-name {
            font-size: 16px;
            font-weight: 600;
            margin-right: 10px;
          }
        }

        &-desc {
          font-size: 13px;
        }
      }
    }

    .con {
      padding: 10px 0 0 0;
    }

    // 群成员
    .user-list {
      .li-search {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-con {
          font-size: 15px;
          font-weight: 500;
          color: #333;

          &-num {
            margin-left: 10px;
          }
        }

        &-inp {
          width: 120px;
        }
      }
    }

    .img-list {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      &-con {
        display: flex;
        flex-direction: column;
        align-self: center;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;

        &-img {
          width: 50px;
          height: 50px;
        }

        &-name {
          font-size: 10px;
          line-height: 20px;
          text-align: center;
        }
      }

      &-more-btn {
        width: 100%;
        text-align: center;
        color: $mainColor;
        cursor: pointer;
      }
    }

    .setting-con {
      display: flex;
      justify-content: space-between;

      .con-label {
        font-weight: bold;
        color: #333;
      }
    }

    .check-con {
      .el-checkbox {
        height: 26px;
      }
    }

    // 底部按钮
    .footer {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
    }

    .border-b {
      border-bottom: 1px solid #d6d6d6;
      padding-bottom: 10px;
    }
  }
</style>
