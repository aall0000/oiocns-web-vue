<template>
  <div :class="{'node': true, 'root': isRoot || !show, 'node-error-state': showError}">
    <div v-if="show" @click="$emit('selected')" :class="{'node-body': true, 'error': showError}">
      <div>
        <div class="node-body-header" :style="{'background-color': headerBgc}">
          <!-- <i :class="headerIcon"  v-if="(headerIcon || '') !== ''"></i> -->
          <el-icon :size="14" style="margin-right: 5px" v-if="(headerIcon || '') !== ''">
            <UserFilled />
          </el-icon>
          <!-- <ellipsis class="name" hover-tip :content="title" /> -->
          <span class="name">{{title}}</span>
          <!-- <i class="el-icon-close" v-if="!isRoot" style="float:right;" @click="$emit('delNode')"></i> -->
          <el-icon v-if="!isRoot" :size="16" style="float:right;" @click="$emit('delNode')">
            <Close />
          </el-icon>
        </div>
        <div class="node-body-content">
          <i :class="leftIcon" v-if="leftIcon"></i>
          <span class="placeholder" v-if="(content || '').trim() === ''">{{placeholder}}</span>
          <!-- <ellipsis :row="3" :content="content" v-else /> -->
          <span class="name" v-else>{{content}}</span>
          <!-- <i class="el-icon-arrow-right"></i> -->
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
        <div class="node-error" v-if="showError">
          <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
            <!-- <i class="el-icon-warning-outline"></i> -->
            <el-icon :size="20">
              <Warning />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button @insertNode="type => $emit('insertNode', type)"></insert-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    ref,
    toRefs,
    reactive,
    computed,
    onMounted,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance
  } from 'vue';
  import InsertButton from '../InsertButton.vue'

  export default defineComponent({
    name: 'Node',
    components: {
      InsertButton
    },
    props: {
      //??????????????????
      isRoot: {
        type: Boolean,
        default: false
      },
      //?????????????????????
      show: {
        type: Boolean,
        default: true
      },
      //????????????????????????
      content: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: "??????"
      },
      placeholder: {
        type: String,
        default: "?????????"
      },
      //?????????????????????
      leftIcon: {
        type: String,
        default: undefined
      },
      //????????????
      headerIcon: {
        type: String,
        default: ''
      },
      //???????????????
      headerBgc: {
        type: String,
        default: '#576a95'
      },
      //????????????????????????
      showError: {
        type: Boolean,
        default: false
      },
      errorInfo: {
        type: String,
        default: '?????????'
      },
    },
    emits: [
      'selected',
      'insertNode',
      'delNode'
    ],
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      const state = reactive({});

      // ???????????????
      onMounted(() => {});
      return {
        proxy,
        ...toRefs(state),
        //
      };
    },
  });
</script>

<style lang="scss" scoped>
  .root {
    &:before {
      display: none !important;
    }
  }

  .node-error-state {
    .node-body {
      box-shadow: 0px 0px 5px 0px #F56C6C !important;
    }
  }

  .node {
    padding: 0 50px;
    width: 320px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: -12px;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      width: 0;
      border-style: solid;
      border-width: 8px 6px 4px;
      border-color: #CACACA transparent transparent;
      background: #F5F5F7;
    }

    .node-body {
      cursor: pointer;
      max-height: 120px;
      position: relative;
      border-radius: 5px;
      background-color: white;
      box-shadow: 0px 0px 5px 0px #d8d8d8;

      &:hover {
        box-shadow: 0px 0px 3px 0px;

        .node-body-header {
          .el-icon-close {
            display: inline;
            font-size: default;
          }
        }
      }

      .node-body-header {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        padding: 5px 15px;
        color: white;
        font-size: xx-small;

        .el-icon-close {
          display: none;
        }

        .name {
          height: 14px;
          width: 150px;
          display: inline-block
        }
      }

      .node-body-content {
        padding: 18px;
        color: #656363;
        font-size: 14px;

        i {
          position: absolute;
          top: 55%;
          right: 5px;
          font-size: default;
        }

        .placeholder {
          color: #8c8c8c;
        }
      }

      .node-error {
        position: absolute;
        right: -40px;
        top: 20px;
        font-size: 25px;
        color: #F56C6C;
      }
    }

    .node-footer {
      position: relative;

      .btn {
        width: 100%;
        display: flex;
        padding: 20px 0 32px;
        justify-content: center;
      }

      .el-button {
        height: 32px;
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        margin: auto;
        width: 2px;
        height: 100%;
        background-color: #CACACA;
      }
    }
  }
</style>