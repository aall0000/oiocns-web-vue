<template>
  <div class="group-detail-wrap">
    <h1 class="title">群详情</h1>
    <ul class="base flex border-b">
      <img class="base-img" src="@/assets/img/toux.jpg" alt="" srcset="" />
      <li class="base-info">
        <div class="base-info-top flex">
          <p class="base-info-top-name">{{ detail.name }}</p>
          <el-tag size="small" v-if="detail.remark">{{ detail.remark }}</el-tag>
        </div>
        <div class="base-info-desc">{{ detail.remark }}</div>
      </li>
    </ul>
    <!-- 组成员 -->
    <ul class="user-list border-b">
      <li class="li-search con">
        <p class="li-search-con">组成员<span class="li-search-con-num">{{ total }}</span>人</p>
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
        <li class="img-list-con" v-for="item in userList" :key="item.id">
          <img class="img-list-con-img" src="@/assets/img/x.png" alt="" />
          <span class="img-list-con-name">{{ item.name }}</span>
        </li>
        <span v-show="total>12" class="img-list-more-btn" @click="handleViewMoreUser">查看更多</span>
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
</template>

<script lang="ts" setup>
import API from '@/services'
import { reactive, ref, onMounted, toRefs, watch } from 'vue'
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

const state = reactive({
  userList: [], //群成员
  total: 0, //总数
  isEditNickName: false, //是否编辑昵称
  isQunName: false, //是否编辑群名称
  isIgnoreMsg: false, //是否免打扰信息
  isStick: false //是否置顶
})

const qunName = ref<string>('')
const nickName = ref<string>('')
onMounted(() => {
  id && getQunPerson(id)
  console.log('44', id, info)
})

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
</script>

<style lang="scss" scoped>
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
