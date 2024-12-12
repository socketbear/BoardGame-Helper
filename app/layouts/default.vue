<template>
  <main class="h-full flex flex-col overflow-y-auto px-10 text-center">
    <Header />
    <slot />
    <Footer />
    <div class="mx-auto mt-5 text-center text-sm opacity-25">
      [Default Layout]
    </div>
  </main>
</template>
