<template>
  <ul class="group-side-bar-wrap">
    <!-- <li :class="['group-con', active == '1' ? 'active' : '']" @click="changeInfo('1')">群1</li>
    <li :class="{ 'group-con': true, active: active == '2' }" @click="changeInfo('2')">群2</li>
    <li :class="{ 'group-con': true, active: active == '3' }" @click="changeInfo('3')">个人3</li> -->

    <li
      :class="['group-con', active == item.id ? 'active' : '']"
      v-for="item in showList"
      :key="item.id"
      @click="changeInfo(item)"
      >{{ item.name }}</li
    >
  </ul>
</template>

<script lang="ts" setup name="groupSideBar">
  import API from '@/services'
  import { dataType } from 'element-plus/es/components/table-v2/src/common'
  import { onMounted, reactive, ref, computed } from 'vue'

  const state = reactive({ qunList: [], friendList: [] })
  defineProps({
    active: Object
  })
  onMounted(() => {
    getFriendList()
    getQunList()
  })

  //整合 群/人 列表-输出展示列表
  const showList = computed(() => {
    return [...state.qunList, ...state.friendList]
  })

  // 获取我的好友列表
  const getFriendList = async () => {
    await API.person.friends({ data: { offset: 0, limit: 10 } }).then((res) => {
      const { result = [] } = res.data
      state.friendList = result
    })
  }
  // 获取我加入的群列表
  const getQunList = async () => {
    const res = await API.cohort.getMyQun({ data: { offset: 0, limit: 10 } })
    const { data, err } = res
    if (!err) {
      const { result = [] } = data
      state.qunList = result
    }
  }

  const emit = defineEmits(['update:active'])
  const changeInfo = (item: Object) => {
    // 触发父组件值更新
    emit('update:active', item)
  }
  // 暴露
  defineExpose({})
</script>

<style lang="scss" scoped>
  .group-side-bar-wrap {
    width: 220px;
    height: 100%;
    padding: 10px 0;
    overflow-y: auto;
    border-right: 1px solid #ccc;

    .group-con {
      padding: 10px 12px;

      &.active,
      &:hover {
        color: #0f39d1;
        background-color: #e7ecfb;
      }
    }
  }
</style>
