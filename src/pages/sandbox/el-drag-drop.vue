<script setup lang="ts">
const boxData = [
  { id: 'A', title: 'A' },
  { id: 'B', title: 'B' },
  { id: 'C', title: 'C' },
]
</script>

<template>
  <div class="flex w-128 h-128">
    <Box v-for="b in boxData" :key="'box-' + b.id" :box-data="b" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
</route>
