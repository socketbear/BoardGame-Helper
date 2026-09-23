<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  min-height: 100dvh;
  margin: 0;
  padding: 0;
}

html {
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}
</style>
