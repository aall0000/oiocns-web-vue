<template>
  <div class="sandboxLayout">
    <iframe
      v-if="containLink"
      id="myIframe"
      class="iframe"
      ref="myIframe"
      allow="payment"
      allowfullscreen="true"
      :src="containLink"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    cover: {
      type: Boolean,
      required: true
    },
    containLink: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  })
</script>

<style lang="scss" scoped>
  .sandboxLayout {
    height: 100%;
    width: 100%;
  }
</style>
