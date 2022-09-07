<template>
  <el-card
    class="shop-card-wrap app-card-item"
    shadow="always"
    :key="info.id"
    @mouseleave="handleWatchMouseOver('')"
    @mouseover="handleWatchMouseOver(info.id)"
  >
    <div class="app-card-item-con">
      <div class="app-card-item-con-top flex">
        <div class="app-card-rightIcon" @click.stop>
          <slot name="rightIcon"></slot>
        </div>
        <div class="app-card-rightTriangle" @click.stop>
          <slot name="rightTriangle"></slot>
        </div>
        <!-- <HeadImg :name="info.name" :url="appImg" :imgWidth="48" :limit="1" :isSquare="false" /> -->
        <slot name="icon"></slot>
        <div class="app-con" v-if="!cardContent">
          <p class="app-con-title">{{ info.name }}</p>
          <div class="app-card-item-con-desc">
            {{ info.remark }}
          </div>
        </div>
        <slot v-else name="content"></slot>
      </div>
    </div>
    <!-- v-show="hoverItem === info.id" -->
    <div class="app-card-item-footer" v-show="state.hoverItem === info.id" @click.stop>
      <slot />
    </div>
  </el-card>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue'
  import HeadImg from '@/components/headImg.vue'
  import appImg from '@/assets/img/whatsapp.png'
  // hoverItem--鼠标移入item的id 用于展示按钮区域
  const state: { hoverItem: string } = reactive({ hoverItem: '' })
  type shopInfoType = {
    key?: string
    info: ProductType
    overId?: string //当前鼠标移入id
    cardContent?: boolean // 卡片内容是否自定义
  }
  const props = defineProps<shopInfoType>()
  const { info } = props
  const emit = defineEmits(['handleMouseOver'])
  const handleWatchMouseOver = (selectId: string) => {
    // emit('handleMouseOver', selectId)
    state.hoverItem = selectId || ''
  }
</script>

<style lang="scss" scoped>
  :deep(.el-card__body) {
    padding: 0;
  }
  .app-card-rightIcon {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .app-card-rightTriangle {
    position: absolute;
    right: 0px;
    top: 0px;
  }
  .app-card-item {
    position: relative;
    width: 24%;
    min-width: 200px;
    height: 184px;
    margin-bottom: 10px;
    margin-right: 1%;
    // background-color: aqua;
    &-con {
      display: flex;
      flex-direction: column;
      padding: 24px;
      .app-con-title {
        color: #000000d9;
        font-size: 16px;
        font-weight: 400;
      }
      &-desc {
        padding: 10px 0;
        height: 70px;
        font-size: 14px;
        font-weight: 400;
        color: #00000073;
        overflow: hidden;
        text-overflow: 5;
        display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; // 从上到下垂直排列子元素
        -webkit-line-clamp: 3; //显示的行数
        // white-space: nowrap;
      }
    }
    &-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      max-height: 48px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      // padding: 0 30px;
      background-color: #f7f7f7;
      .btn {
        padding: 6px 10px;
      }
    }
  }
</style>
