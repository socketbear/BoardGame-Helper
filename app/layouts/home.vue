<template>
  <div class="home-shell">
    <main class="home-shell__main">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style scoped>
.home-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.home-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  text-align: center;
}
</style>
