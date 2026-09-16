<script setup lang="ts">
import { devNavItems, gameNavItems } from '~/constants/navigation'

const open = defineModel<boolean>({ default: false })

const route = useRoute()
const { isLocalhost } = useHostCheck()

function close() {
  open.value = false
}

function isActive(path: string) {
  return route.path === path
}

watch(() => route.path, close)

watch(open, (isOpen) => {
  if (!import.meta.client)
    return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client)
    document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="open"
        class="nav-drawer-overlay"
        @click="close"
      />
    </Transition>

    <Transition name="drawer-slide">
      <aside
        v-if="open"
        class="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="내비게이션 메뉴"
      >
        <div class="nav-drawer__header">
          <span class="nav-drawer__label">메뉴</span>
          <button
            type="button"
            class="nav-drawer__close"
            aria-label="메뉴 닫기"
            @click="close"
          >
            <div class="i-carbon-close text-lg" />
          </button>
        </div>

        <nav class="nav-drawer__body">
          <NuxtLink
            to="/"
            class="nav-drawer-link"
            :class="{ 'nav-drawer-link--active': isActive('/') }"
            @click="close"
          >
            <div class="i-carbon-home" />
            홈
          </NuxtLink>

          <p class="nav-drawer-section">
            보드게임
          </p>
          <NuxtLink
            v-for="item in gameNavItems"
            :key="item.path"
            :to="item.path"
            class="nav-drawer-link"
            :class="{ 'nav-drawer-link--active': isActive(item.path) }"
            @click="close"
          >
            <div v-if="item.icon" :class="item.icon" />
            {{ item.title }}
          </NuxtLink>

          <p class="nav-drawer-section">
            정보
          </p>
          <NuxtLink
            to="/about"
            class="nav-drawer-link"
            :class="{ 'nav-drawer-link--active': isActive('/about') }"
            @click="close"
          >
            <div class="i-carbon-information" />
            About
          </NuxtLink>

          <template v-if="isLocalhost">
            <p class="nav-drawer-section">
              개발 도구
            </p>
            <NuxtLink
              v-for="item in devNavItems"
              :key="item.path"
              :to="item.path"
              class="nav-drawer-link"
              :class="{ 'nav-drawer-link--active': isActive(item.path) }"
              @click="close"
            >
              <div v-if="item.icon" :class="item.icon" />
              {{ item.title }}
            </NuxtLink>
          </template>
        </nav>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.nav-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--shell-overlay);
  backdrop-filter: blur(4px);
}

.nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 101;
  display: flex;
  flex-direction: column;
  width: min(18rem, 85vw);
  height: 100%;
  height: 100dvh;
  border-left: 1px solid var(--shell-border);
  background: var(--shell-bg-elevated);
  box-shadow: var(--shell-shadow);
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

@media (min-width: 768px) {
  .nav-drawer-overlay,
  .nav-drawer {
    display: none;
  }
}

.nav-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--shell-border);
  padding: 0.75rem 1rem;
}

.nav-drawer__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--shell-text-subtle);
}

.nav-drawer__close {
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
  transition: background-color 0.15s;
}

.nav-drawer__close:hover {
  background-color: var(--shell-hover-bg);
}

.nav-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  -webkit-overflow-scrolling: touch;
}

.nav-drawer-section {
  margin: 1rem 0.75rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--shell-text-subtle);
}

.nav-drawer-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: var(--shell-text-muted);
  text-decoration: none;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.nav-drawer-link:hover {
  background-color: var(--shell-hover-bg);
  color: var(--shell-text);
}

.nav-drawer-link--active {
  background-color: var(--shell-accent-muted);
  color: var(--shell-accent);
  font-weight: 600;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s ease;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .drawer-fade-enter-active,
  .drawer-fade-leave-active,
  .drawer-slide-enter-active,
  .drawer-slide-leave-active {
    transition: none;
  }
}
</style>
