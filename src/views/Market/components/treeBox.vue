<template>
  <div class="treeLayout" v-if="isShow">
    <div class="leftTreeBox">
      <el-tree
        ref="leftTree"
        :data="isLazy ? [] : state.leftTreeData"
        :props="prop"
        :load="loadNode"
        :lazy="isLazy ? true : false"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="centerTreeBox"></div>
    <div class="rightTreeBox"></div>
  </div>
</template>

<script setup lang="ts">
  import { log } from 'console'
  import type Node from 'element-plus/es/components/tree/src/model/node'
  import { ref, reactive, onMounted, nextTick, watch } from 'vue'
  interface Tree {
    name: string
    leaf?: boolean
  }
  const prop = {
    label: 'name',
    children: 'children',
    isLeaf: 'leaf'
  }
  const leftTree = ref(null)
  const state = reactive({
    leftTreeData: []
  })
  const isShow = ref<boolean>(false)
  const props = defineProps({
    leftTableData: {
      type: Object,
      default: () => {}
    },
    isLazy: {
      type: Boolean,
      default: false
    }
  })
  const emit = defineEmits(['getLeftData', 'getLoadNode', 'handleLeftNode'])

  onMounted(() => {
    getLeftData()
  })

  const getLeftData = () => {
    emit('getLeftData', (res: any) => {
      state.leftTreeData = res
      isShow.value = true
    })
  }

  const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
    if (node.level === 0) {
      return resolve(state.leftTreeData)
    }
    if (node.level >= 1) {
      emit('getLoadNode', node.data.id, (res: any) => {
        if (res) {
          resolve(res)
        } else {
          resolve([])
        }
      })
    }
  }

  const handleNodeClick = (data: Tree) => {
    console.log('-------')

    // emit('handleLeftNode', data, (res: any) => {})
  }
</script>

<style lang="scss" scoped>
  .treeLayout {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  .leftTreeBox {
    width: 32%;
    border: 1px solid rgb(240, 242, 245);
    height: 100%;
    overflow: auto;
  }
  .centerTreeBox {
    width: 32%;
    border: 1px solid rgb(240, 242, 245);
    height: 100%;
    overflow: auto;
  }
  .rightTreeBox {
    width: 32%;
    border: 1px solid rgb(240, 242, 245);
    height: 100%;
    overflow: auto;
  }
</style>
