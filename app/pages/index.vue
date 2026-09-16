<script setup lang="ts">
let destoryTypers: () => void
onMounted(() => {
  const { destroy } = TyperSetup()
  destoryTypers = destroy
})
onUnmounted(() => {
  destoryTypers()
})
</script>

<template>
  <div class="flex flex-1 items-center justify-center px-4">
    <p class="my-4 text-center text-2xl text-[var(--shell-text)] font-bold sm:text-4xl">
      Board <span
        id="main-title"
        class="typer text-emerald-500 dark:text-emerald-400" data-words="Game Helper,Assistant,Another Gamer,_(:зゝ∠)_" data-delay="100"
        data-deleteDelay="1000"
      />
      <span class="cursor" data-owner="main-title" />
    </p>
  </div>
</template>
