<template>
  <div class="game-shell">
    <main class="game-shell__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.game-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.game-shell__main {
  flex: 1;
  width: 100%;
}
</style>
