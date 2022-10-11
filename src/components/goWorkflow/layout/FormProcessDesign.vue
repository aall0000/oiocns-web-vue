<template>
  <el-main>
    <div class="scale">
      <el-button size="small" @click="scale -= 10" :disabled="scale <= 40">
        <el-icon>
          <Minus />
        </el-icon>
      </el-button>
      <span>{{ scale }}%</span>
      <el-button size="small" @click="scale += 10" :disabled="scale >= 150">
        <el-icon>
          <Plus />
        </el-icon>
      </el-button>
      <!-- <el-button size="small" @click="validate">校验流程</el-button> -->
    </div>
    <div class="design" :style="'transform: scale('+ scale / 100 +');'">
      <ProcessTree ref="process-tree" @selectedNode="nodeSelected" />
    </div>
    <el-drawer :title="selectedNode.name" v-model="showConfig" :modal-append-to-body="false" 
      :size="selectedNode.type === 'CONDITION' ? '600px':'500px'" direction="rtl" destroy-on-close>
      <!-- <div slot="title"> -->
        <el-input v-model="selectedNode.name" size="default" v-show="showInput" style="width: 300px"
          @blur="showInput = false"></el-input>
        <!-- <el-link v-show="!showInput" @click="showInput = true" style="font-size: default">
          <i class="el-icon-edit" style="margin-right: 10px"></i>
          {{selectedNode.name}}
        </el-link> -->
      <!-- </div> -->
      <div class="node-config-content">
        <NodeConfig />
      </div>
    </el-drawer>
  </el-main>
</template>

<script lang="ts">
  import {
    ref,
    reactive,
    toRefs,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance,
    computed,
  } from 'vue';

  import ProcessTree from '../process/ProcessTree.vue'
  import NodeConfig from '../process/config/NodeConfig.vue'

  export default defineComponent({
    name: 'FormProcessDesign',

    components: {
      ProcessTree,
      NodeConfig
    },
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;

      // const ctx = getCurrentInstance();

      const proxy = appContext.config.globalProperties;

      const selectedNode = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.selectedNode;
      });

      const state = reactive({
        scale: 100,
        selected: {},
        showInput: false,
        showConfig: false,
      });

      // const validate = () => {
      //   console.log("validate",ctx.refs["process-tree"]);
      //   return ctx.refs["process-tree"].validateProcess()
      // };

      const nodeSelected = (node: any) => {
        console.log('配置节点', node)
        state.showConfig = true
      }

      const handleClose = () => {
        console.log('handleClose')
      }

      return {
        selectedNode,
        // validate,
        nodeSelected,
        handleClose,
        ...toRefs(state),
      };
    },
  });

</script>

<style lang="scss" scoped>
  .design {
    margin-top: 100px;
    display: flex;
    transform-origin: 50% 0px 0px;
  }

  .scale {
    z-index: 999;
    position: absolute;
    top: 120px;
    right: 40px;

    span {
      margin: 0 10px;
      font-size: 15px;
      color: #7a7a7a;
      width: 50px;
    }
  }

  .node-config-content {
    padding: 0 20px 20px;
  }

  .el-drawer__body {
    overflow-y: auto;
  }
</style>