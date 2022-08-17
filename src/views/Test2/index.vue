<template>
  <div>
    <DiyTable :hasTabs="true">
      <template v-slot:slot-title>
        <div class="group-select">
          <div>123123</div>
        </div>
      </template>
      <template v-slot:slot-tabs>
        <div>tabs</div>
      </template>
      <template v-slot:slot-tabsBtn>
        <div>tabsBtn</div>
      </template>
      <template v-slot:buttons>
        <div>4213123</div>
      </template>
    </DiyTable></div
  >
</template>

<script setup lang="ts">
  import DiyTable from '@/components/diyTable/index.vue'
</script>

<style scoped></style>
