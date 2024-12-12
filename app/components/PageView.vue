<script setup lang="ts">
const data = {
  pageview: 100,
  startAt: new Date(),
}

const time = useTimeAgo(() => data.startAt)
</script>

<template>
  <div text-gray:80>
    <span text-gray font-500>{{ data?.pageview }}</span>
    page views since
    <span text-gray>{{ time }}</span>
  </div>
</template>
