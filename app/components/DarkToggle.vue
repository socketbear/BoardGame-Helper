<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#111827' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="dark-toggle"
    :aria-label="color.value === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'"
    @click="toggleDark"
  >
    <div class="i-carbon-sun dark:i-carbon-moon text-lg" />
  </button>
</template>

<style scoped>
.dark-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--shell-text-muted);
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.dark-toggle:hover {
  background-color: var(--shell-hover-bg);
  color: var(--shell-text);
}

.dark-toggle:focus-visible {
  outline: 2px solid var(--shell-accent);
  outline-offset: 2px;
}
</style>
