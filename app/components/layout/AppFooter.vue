<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <p class="app-footer__copy">
        Board Game Helper
      </p>

      <div class="app-footer__links">
        <NuxtLink to="/" class="app-footer__link" aria-label="홈">
          <div class="i-carbon-home text-lg" />
        </NuxtLink>
        <a
          href="https://github.com/socketbear/BoardGame-Helper"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
          aria-label="GitHub"
        >
          <div class="i-carbon-logo-github text-lg" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--shell-border);
  background: color-mix(in srgb, var(--shell-bg-muted) 90%, transparent);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.app-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem max(1rem, env(safe-area-inset-right, 0)) 1rem max(1rem, env(safe-area-inset-left, 0));
}

.app-footer__copy {
  font-size: 0.8rem;
  color: var(--shell-text-subtle);
}

.app-footer__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.app-footer__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  color: var(--shell-text-subtle);
  transition:
    color 0.15s,
    background-color 0.15s;
}

.app-footer__link:hover {
  color: var(--shell-accent);
  background-color: var(--shell-accent-muted);
}

.app-footer__link:focus-visible {
  outline: 2px solid var(--shell-accent);
  outline-offset: 2px;
}
</style>
