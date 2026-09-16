<template>
  <div class="app-shell">
    <LayoutAppHeader />
    <main class="app-shell__main">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.app-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
