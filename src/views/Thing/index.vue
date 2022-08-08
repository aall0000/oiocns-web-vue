<template>
  <div class="base-layout" ref="base">
    <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
      >
        {{ item.i }}
      </grid-item>
    </grid-layout>
    <div
      v-if="menuListShow"
      class="layout-menu box"
      :style="MenuStyle"
      style="background: white"
      @mousedown="move"
    >
      <el-button style="width: 100%" type="primary" icon="el-icon-s-check">设为首页</el-button>
      <TheSearchInput
        placeholder="输入模板"
        @filterText="changeFilterText"
        :filterText="filterText"
      ></TheSearchInput>
      <div class="layout-menu-body__treeList">
        <div
          class="tree"
          @drag="drag"
          @dragend="dragend(item)"
          draggable="true"
          unselectable="on"
          :class="
            defaultOnClick
              ? systemIndex === index
                ? 'defaultClick'
                : ''
              : defaultList == item.id
              ? 'defaultClick'
              : ''
          "
          @click="addprotalTemplate(item, index)"
          v-for="(item, index) in templateList"
          :key="item.id"
        >
          <div class="row" style="padding: 5px 0; justify-content: space-between">
            <div style="display: flex">
              <el-icon
                title="设为首页"
                class="el-icon-star-off"
                style="margin: 5px 5px 0 5px"
                @click="handleDefault(item, index)"
                ><Star v-if="defaultList !== item.id" /><StarFilled v-else
              /></el-icon>
              <div>
                {{ item.name }}
              </div>
            </div>
            <el-icon style="margin-right: 5px" @click="handleDeleteCustomList(item)"
              ><Delete
            /></el-icon>
          </div>
        </div>
      </div>
      <div
        style="height: 45px; border-top: 1px solid #ebeef5; margin-bottom: 8px"
        class="flex-center"
      >
        <el-button
          type="text"
          style="width: 100%; font-size: 16px; padding-top: 30px"
          @click="customTemplate"
          >自定义模板</el-button
        >
      </div>
      <div class="layout-menu__btnTopLeft" v-show="menuBtnShow && BtnDirection == 'left'"></div>
      <div class="layout-menu__btnBottomLeft" v-show="menuBtnShow && BtnDirection == 'left'"></div>
      <div
        class="layout-menu__btnLeft flex-center"
        style="background: white"
        @click="handleMenuBtn"
        v-show="menuBtnShow && BtnDirection == 'left'"
      >
        <div
          class="el-icon-caret-right"
          :style="menuShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'"
        ></div>
      </div>
      <div class="layout-menu__btnTop" v-show="menuBtnShow && BtnDirection == 'right'"></div>
      <div class="layout-menu__btnBottom" v-show="menuBtnShow && BtnDirection == 'right'"></div>
      <div
        class="layout-menu__btnRight flex-center"
        style="background: white"
        @click="handleMenuBtn"
        v-show="menuBtnShow && BtnDirection == 'right'"
      >
        <el-icon
          class="el-icon-caret-left"
          :style="menuShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'"
          ><CaretLeft
        /></el-icon>
      </div>
    </div>
    <div
      v-else
      class="layout-menu box"
      :style="MenuStyle"
      style="background: white"
      @mousedown="move"
    >
      <el-button type="primary" icon="el-icon-s-check" @click="clearTemplate">清空</el-button>
      <div class="layout-menu-body__tree" v-show="listShow">
        <TheSearchInput placeholder="输入组件名" :filterText.sync="filterText"></TheSearchInput>
        <div class="layout-menu-body__treeList" v-show="!searchShow">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="系统组件" name="1">
              <div
                class="tree"
                @drag="drag(item)"
                @dragend="dragend(item)"
                draggable="true"
                unselectable="on"
                @click="addprotal(item)"
                v-for="item in componentList"
                :key="item.recid"
              >
                <el-popover placement="right" width="400" trigger="hover">
                  <el-image :src="item.previewPic"></el-image>
                  <div class="row" slot="reference" style="padding: 5px 0">
                    <div
                      class="el-icon-setting listContain_item"
                      style="margin: 5px 5px 0 5px"
                    ></div>
                    <div>
                      {{ item.name }}
                    </div>
                  </div>
                </el-popover>
              </div>
            </el-collapse-item>
            <el-collapse-item title="应用组件" name="2">
              <el-collapse v-model="activeNames2">
                <el-collapse-item
                  class="collapseItem"
                  :title="key"
                  v-for="(app, key, index) in newAppList"
                  :key="index"
                >
                  <div
                    class="tree"
                    @drag="drag(item)"
                    @dragend="dragend(item)"
                    draggable="true"
                    unselectable="on"
                    @click="addAppProtal(item)"
                    v-for="(item, index) in app"
                    :key="index"
                  >
                    <el-popover placement="right" width="400" trigger="hover">
                      <el-image :src="item.previewPic"></el-image>
                      <div class="row" slot="reference" style="padding: 5px 0">
                        <div
                          class="el-icon-setting listContain_item"
                          style="margin: 5px 5px 0 5px"
                        ></div>
                        <div>
                          {{ item.name }}
                        </div>
                      </div>
                    </el-popover>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-show="searchShow" class="layout-menu-body__treeList">
          <div
            class="tree"
            @drag="drag"
            @dragend="dragend(item)"
            draggable="true"
            unselectable="on"
            @click="addAppProtal(item)"
            v-for="item in searchList"
            :key="item.recid"
          >
            <el-popover placement="right" width="400" trigger="hover">
              <el-image :src="item.previewPic"></el-image>
              <div class="row" slot="reference" style="padding: 5px 0">
                <div class="el-icon-setting listContain_item" style="margin: 2px 5px 0 5px"></div>
                <div>
                  {{ item.name }}
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <div
        style="height: 45px; border-top: 1px solid #ebeef5; margin-bottom: 8px"
        class="flex-center"
      >
        <el-button type="text" style="width: 100%; font-size: 16px; padding-top: 30px" @click="back"
          >返回</el-button
        >
        <div style="width: 1px; height: 100%; border: 1px solid #eeeeee; margin-top: 20px"></div>
        <el-button
          type="text"
          style="width: 100%; font-size: 16px; padding-top: 30px"
          @click="handleSave"
          >保存</el-button
        >
      </div>
      <div class="layout-menu__btnTopLeft" v-show="menuBtnShow && BtnDirection == 'left'"></div>
      <div class="layout-menu__btnBottomLeft" v-show="menuBtnShow && BtnDirection == 'left'"></div>
      <div
        class="layout-menu__btnLeft flex-center"
        style="background: white"
        @click="handleMenuBtn"
        v-show="menuBtnShow && BtnDirection == 'left'"
      >
        <div
          class="el-icon-caret-right"
          :style="menuShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'"
        ></div>
      </div>
      <div class="layout-menu__btnTop" v-show="menuBtnShow && BtnDirection == 'right'"></div>
      <div class="layout-menu__btnBottom" v-show="menuBtnShow && BtnDirection == 'right'"></div>
      <div
        class="layout-menu__btnRight flex-center"
        style="background: white"
        @click="handleMenuBtn"
        v-show="menuBtnShow && BtnDirection == 'right'"
      >
        <el-icon
          class="el-icon-caret-left"
          :style="menuShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'"
          ><CaretLeft
        /></el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // @ts-nocheck
  import { defineComponent, reactive, toRefs, watch } from 'vue'
  import { GridLayout, GridItem } from 'vue-grid-layout'
  import TheSearchInput from './components/theSearchInput.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import 'element-plus/es/components/message-box/style/css'

  export default defineComponent({
    components: {
      GridLayout,
      GridItem,
      TheSearchInput
    },
    setup() {
      // 定义变量位置
      const state = reactive({
        menuShow: true,
        menuBtnShow: true,
        menuBtnMove: true,
        BtnDirection: 'right',
        transparentShow: false,
        baseWdith: 0,
        listShow: true,
        filterText: '', //搜索
        templateList: [
          {
            name: '平台模板',
            id: 1
          },
          {
            name: '平台模板2',
            id: 2
          },
          {
            name: '平台模板3',
            id: 3
          }
        ],
        dialogShow: [
          {
            key: 'save',
            value: false
          },
          {
            key: 'job',
            value: false
          }
        ],
        baseWdith: 0,
        uniqueGrid: 0,
        filterText: '', // 搜索
        listShow: true, // 控制组件与模板列表的展示
        componentList: [], // 组件列表
        appList: [], // 应用列表
        customList: [], // 自定义模板列表
        allTemplateList: [],
        userUse: '', // 用户正在使用的模板
        currentPage: 1,
        pageSize: 9999999,
        activeNames: ['1', '2'],
        defaultList: '', // 用户默认设置的模板
        userIdList: [],
        systemShow: false,
        searchShow: false, // 搜索时展示
        searchList: [], // 搜索列表
        templateData: [], // 用户点击模板的数据
        systemIndex: false, // 系统组件index
        customIndex: false, // 自定义组件index
        menuListShow: true, // 控制自定义模板的显示
        // grid
        layoutI: '',
        screenWidth: document.body.clientWidth,
        screenHig: document.body.clientHeight,
        menuHidden: false,
        isPreview: false,
        gridLayoutSet: {
          draggable: true,
          resizable: true
        },
        layout: [
          { x: 0, y: 0, w: 2, h: 2, i: '0' },
          { x: 2, y: 0, w: 2, h: 4, i: '1' },
          { x: 4, y: 0, w: 2, h: 5, i: '2' },
          { x: 6, y: 0, w: 2, h: 3, i: '3' },
          { x: 8, y: 0, w: 2, h: 3, i: '4' },
          { x: 10, y: 0, w: 2, h: 3, i: '5' },
          { x: 0, y: 5, w: 2, h: 5, i: '6' },
          { x: 2, y: 5, w: 2, h: 5, i: '7' },
          { x: 4, y: 5, w: 2, h: 5, i: '8' },
          { x: 6, y: 3, w: 2, h: 4, i: '9' },
          { x: 8, y: 4, w: 2, h: 4, i: '10' },
          { x: 10, y: 4, w: 2, h: 4, i: '11' },
          { x: 0, y: 10, w: 2, h: 5, i: '12' },
          { x: 2, y: 10, w: 2, h: 5, i: '13' },
          { x: 4, y: 8, w: 2, h: 4, i: '14' },
          { x: 6, y: 8, w: 2, h: 4, i: '15' },
          { x: 8, y: 10, w: 2, h: 5, i: '16' },
          { x: 10, y: 4, w: 2, h: 2, i: '17' },
          { x: 0, y: 9, w: 2, h: 3, i: '18' },
          { x: 2, y: 6, w: 2, h: 2, i: '19' }
        ],
        portalid: '694567114580692992',
        canvasBg: {
          hig: 120
        },
        newAppList: [],
        newAppItem: [],
        activeNames2: []
      })

      let base = ref(null)

      //computed位置
      const MenuStyle = computed(() => {
        let menu = ''
        if (state.menuShow && state.menuBtnShow) {
          if (state.BtnDirection == 'right') {
            menu =
              'right:0px;transition: all 0.5s ease;box-shadow: -5px 10px 10px rgba(0,0,0,0.03);'
          } else {
            menu =
              'margin-left:0px;transition: all 0.5s ease;box-shadow: 5px 10px 10px rgba(0,0,0,0.03);'
          }
        } else if (state.menuShow && !state.menuBtnShow) {
          //移动时
          menu = 'width:200px;margin-left:0px;'
        } else {
          // 关闭
          if (state.BtnDirection == 'right') {
            menu = 'right:-205px;transition: all 0.5s ease;left:unset;'
          } else {
            menu = 'transition: all 0.5s ease;margin-left:-205px'
          }
        }
        return menu
      })
      const defaultOnClick = () => {
        if (this.systemIndex === false && this.customIndex === false) {
          return false
        } else {
          return true
        }
      }
      // watch位置
      // watch(
      //   () => state.filterText,
      //   (val) => {
      //     console.log('val2', val)
      //   },
      //   { immediate: true, deep: true }
      // )

      // method位置
      const back = () => {
        state.menuListShow = true
      }
      const customTemplate = () => {
        state.menuListShow = false
      }
      const handleDeleteCustomList = () => {
        // 删除自定义模板
        ElMessageBox.confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ElMessage({
            type: 'success',
            message: 'Delete completed'
          })
        })
      }
      const changeFilterText = (val) => {
        state.filterText = val
      }
      const handleMenuBtn = () => {
        state.menuShow = !state.menuShow
      }
      const move = (e) => {
        if (e.target.className == 'layout-menu box') {
          state.transparentShow = true
          // 判断是否为按钮
          state.menuBtnMove = true
          let odiv = e.target //获取目标元素
          //算出鼠标相对元素的位置
          let disX = e.clientX - odiv.offsetLeft
          odiv.style.left = e.clientX - disX + 'px'

          document.onmousemove = (e) => {
            //鼠标按下并移动的事件
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX
            //绑定元素位置到positionX和positionY上面
            // this.positionX = top
            // this.positionY = left
            // //移动当前元素
            odiv.style.left = left + 'px'
          }
          document.onmouseup = (e) => {
            console.log('======chufa3')
            let left = e.clientX - disX
            if (left > state.baseWdith) {
              odiv.style.left = base.clientWidth - 400 + 'px'
              state.BtnDirection = 'right'
            } else {
              odiv.style.left = 0 + 'px'
              state.BtnDirection = 'left'
            }
            state.transparentShow = false
            state.menuBtnMove = false
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
      const addprotalTemplate = (data, index) => {
        // 点击系统模板事件
        state.systemIndex = index
        state.customIndex = false
        state.templateData = data
        var config = JSON.parse(data.config)
        state.layout = config
      }
      const addprotalCustom = (data, index) => {
        // 点击自定义模板事件
        state.customIndex = index
        state.systemIndex = false
        state.templateData = data
        var config = JSON.parse(data.config)
        state.layout = config
      }
      return {
        back,
        changeFilterText,
        defaultOnClick,
        customTemplate,
        handleMenuBtn,
        addprotalTemplate,
        addprotalCustom,
        handleDeleteCustomList,
        move,
        MenuStyle,
        base,
        ...toRefs(state)
      }
    }
  })
</script>

<style lang="scss" scoped>
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-icon-star-off {
    margin: 0px 5px 1px 5px !important;
  }
  :deep(.el-collapse-item__wrap) {
    overflow: unset;
  }
  .collapseItem {
    padding: 0 10px;
    :deep(.el-collapse-item__header) {
      border: unset;
    }
  }
  .row-speace {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .el-icon-delete {
      margin-right: 10px;
    }
    .el-icon-delete:hover {
      color: #0f39d1;
    }
  }
  .row-speace:hover {
    background: rgb(245, 247, 250);
  }
  .templateManage {
    width: 100%;
    border-bottom: 1px solid #eeeeee;
    height: 40px;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    padding-right: 20px;
    color: #0f39d1;
    cursor: pointer;
  }
  :deep(.el-collapse) {
    flex: 1;
    height: 1px;
    display: flex;
    flex-direction: column;
  }
  .defaultClick {
    background: rgb(236, 241, 252);
  }
  .transparent {
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba($color: #000000, $alpha: 0);
    left: 0;
    top: 0;
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .diy-table-layout {
    padding: 0;
    margin: 0;
  }
  .layout {
    &-con {
      width: 100%;
      height: 100%;
    }
    &-content {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    &-shrinkage {
      width: 20px;
      height: 60px;
      border: 1px solid #a8a6a6;
      line-height: 60px;
      position: fixed;
      cursor: pointer;
    }
    &-menu {
      position: absolute;
      right: -200px;
      // left: 50%;
      top: 0;
      // margin-left: 200px;
      width: 200px;
      height: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      z-index: 99;
      // transition: all 0.5s ease;
      cursor: move;
      &__head {
        cursor: auto;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
      &__onClick {
        color: #154ad8;
        border: 1px solid #154ad8;
      }
      &__save {
        height: 80px;
        border: 1px solid #eee;
        text-align: center;
        cursor: pointer;
        line-height: 80px;
      }
      &__row {
        flex: 1;
        height: 1px;
        border: 1px solid #eee;
        display: flex;
        flex-direction: row;
      }
      &__left {
        width: 50%;
        text-align: center;
        line-height: 43px;
        cursor: pointer;
      }
      &__right {
        width: 50%;
        text-align: center;
        line-height: 43px;
        cursor: pointer;
      }
      &__btnTopLeft {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 46%;
        left: 100%;
        transform: translate(0, -50%);
        cursor: pointer;
        background-image: radial-gradient(20px at 20px 0px, rgba(255, 255, 255, 0) 50px, #fff 50px);
      }
      &__btnBottomLeft {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 54%;
        left: 100%;
        transform: translate(0, -45%);
        cursor: pointer;
        background-image: radial-gradient(
          20px at 20px 20px,
          rgba(255, 255, 255, 0) 50px,
          #fff 50px
        );
      }
      &__btnLeft {
        box-shadow: 4px 5px 10px rgba(0, 0, 0, 0.04);
        width: 20px;
        height: 80px;
        line-height: 50px;
        // border: 1px solid #9c9c9c;
        border-radius: 0px 20px 20px 0px;
        position: absolute;
        left: 100%;
        top: 50%;
        font-size: 20px;
        transform: translate(0, -50%);
        cursor: pointer;
      }
      &__btnTop {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 46%;
        right: 100%;
        transform: translate(0, -50%);
        cursor: pointer;
        background-image: radial-gradient(20px at 0px 0px, rgba(255, 255, 255, 0) 50px, #fff 50px);
      }
      &__btnBottom {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 54%;
        right: 100%;
        transform: translate(0, -45%);
        cursor: pointer;
        background-image: radial-gradient(20px at 0px 20px, rgba(255, 255, 255, 0) 50px, #fff 50px);
      }
      &__btnRight {
        box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.04);
        width: 20px;
        height: 80px;
        line-height: 50px;
        // border: 1px solid #9c9c9c;
        border-radius: 20px 0 0 20px;
        position: absolute;
        right: 100%;
        top: 50%;
        font-size: 20px;
        transform: translate(0, -50%);
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      &-body {
        display: flex;
        flex-direction: column;
        flex: 1;
        &__tree {
          display: flex;
          flex-direction: column;
          height: 1px;
          flex: 1;
          cursor: auto;
        }
        &__treeList {
          cursor: auto;
          margin: 10px 0;
          height: 1px;
          flex: 1;
          overflow: auto;
          display: flex;
          flex-direction: column;
        }
        &__footer {
          border-top: 1px solid rgb(235, 238, 245);
          text-align: center;
          line-height: 53px;
          font-size: 16px;
          color: #154ad8;
          height: 53px;
          cursor: pointer;
        }
      }
    }
  }
  .vue-grid-layout {
    position: relative;
    min-height: calc(100vh - 150px);
    z-index: 1;
    .vue-grid-item {
      position: absolute;
      width: 1000px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 4px;
      border: 1px solid #efefef;
      .deleteIem {
        position: absolute;
        top: 1px;
        right: 1px;
        padding: 2px;
        background: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        color: #666;
        font-size: 14px;
        z-index: 99;
        &:hover {
          font-size: 15px;
          color: #f56c6c;
        }
      }
    }
  }
  .tree {
    cursor: pointer;
    :hover {
      background: rgb(245, 247, 250);
    }
  }
  .canvasBg {
    background: rgb(242, 244, 249);
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .el-icon-caret-right {
    transition: all 0.5s ease;
  }
  .text {
    display: none;
    color: rgba(255, 255, 255, 1);
  }
  .el-icon-star-off {
    cursor: pointer;
  }
  .el-icon-star-off {
    cursor: pointer;
  }
  .el-icon-star-on {
    color: rgb(92, 182, 255);
  }
</style>
