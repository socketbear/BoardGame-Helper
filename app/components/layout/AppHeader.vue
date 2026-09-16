<script setup lang="ts">
import { devNavItems, gameNavItems } from '~/constants/navigation'

const route = useRoute()
const drawerOpen = ref(false)
const gamesMenuOpen = ref(false)
const devMenuOpen = ref(false)
const { isLocalhost } = useHostCheck()

function isActive(path: string) {
  return route.path === path
}

function isGameSectionActive() {
  return route.path.startsWith('/games/')
}

onMounted(() => {
  document.addEventListener('click', closeAllMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeAllMenus)
})

function closeAllMenus() {
  gamesMenuOpen.value = false
  devMenuOpen.value = false
}

function toggleGamesMenu(event: Event) {
  event.stopPropagation()
  devMenuOpen.value = false
  gamesMenuOpen.value = !gamesMenuOpen.value
}

function toggleDevMenu(event: Event) {
  event.stopPropagation()
  gamesMenuOpen.value = false
  devMenuOpen.value = !devMenuOpen.value
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <NuxtLink to="/" class="app-header__brand">
        <img src="/board-icon.svg" alt="" class="app-header__logo" aria-hidden="true">
        <span class="app-header__title">Board Helper</span>
      </NuxtLink>

      <nav class="app-header__nav" aria-label="주 메뉴">
        <NuxtLink
          to="/"
          class="app-header__link"
          :class="{ 'app-header__link--active': isActive('/') }"
        >
          홈
        </NuxtLink>

        <div class="app-header__dropdown-wrap">
          <button
            type="button"
            class="app-header__link app-header__link--dropdown"
            :class="{ 'app-header__link--active': isGameSectionActive() }"
            :aria-expanded="gamesMenuOpen"
            aria-haspopup="true"
            @click="toggleGamesMenu"
          >
            보드게임
            <div class="i-carbon-chevron-down app-header__chevron" :class="{ 'app-header__chevron--open': gamesMenuOpen }" />
          </button>

          <div
            v-if="gamesMenuOpen"
            class="app-header__dropdown"
            @click.stop
          >
            <NuxtLink
              v-for="item in gameNavItems"
              :key="item.path"
              :to="item.path"
              class="app-header__dropdown-item"
              :class="{ 'app-header__dropdown-item--active': isActive(item.path) }"
              @click="closeAllMenus"
            >
              <div v-if="item.icon" :class="item.icon" />
              {{ item.title }}
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          to="/about"
          class="app-header__link"
          :class="{ 'app-header__link--active': isActive('/about') }"
        >
          About
        </NuxtLink>

        <template v-if="isLocalhost">
          <div class="app-header__dropdown-wrap">
            <button
              type="button"
              class="app-header__link app-header__link--dropdown"
              :class="{ 'app-header__link--active': route.path === '/sandbox' }"
              :aria-expanded="devMenuOpen"
              aria-haspopup="true"
              @click="toggleDevMenu"
            >
              Dev
              <div class="i-carbon-chevron-down app-header__chevron" :class="{ 'app-header__chevron--open': devMenuOpen }" />
            </button>

            <div
              v-if="devMenuOpen"
              class="app-header__dropdown"
              @click.stop
            >
              <NuxtLink
                v-for="item in devNavItems"
                :key="item.path"
                :to="item.path"
                class="app-header__dropdown-item"
                :class="{ 'app-header__dropdown-item--active': isActive(item.path) }"
                @click="closeAllMenus"
              >
                <div v-if="item.icon" :class="item.icon" />
                {{ item.title }}
              </NuxtLink>
            </div>
          </div>
        </template>
      </nav>

      <div class="app-header__actions">
        <DarkToggle />
        <button
          type="button"
          class="app-header__menu-btn"
          aria-label="메뉴 열기"
          @click="drawerOpen = true"
        >
          <div class="i-carbon-menu text-xl" />
        </button>
      </div>
    </div>

    <LayoutAppNavDrawer v-model="drawerOpen" />
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--shell-border);
  background: color-mix(in srgb, var(--shell-bg) 88%, transparent);
  backdrop-filter: blur(10px);
  padding-top: env(safe-area-inset-top, 0);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 3.5rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0.5rem max(1rem, env(safe-area-inset-right, 0)) 0.5rem max(1rem, env(safe-area-inset-left, 0));
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  color: var(--shell-text);
  text-decoration: none;
}

.app-header__logo {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
}

.app-header__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

@media (min-width: 480px) {
  .app-header__title {
    font-size: 1.05rem;
  }
}

.app-header__nav {
  display: none;
  align-items: center;
  gap: 0.25rem;
}

@media (min-width: 768px) {
  .app-header__nav {
    display: flex;
  }
}

.app-header__link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--shell-text-muted);
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}

.app-header__link:hover {
  background-color: var(--shell-hover-bg);
  color: var(--shell-text);
}

.app-header__link--active {
  background-color: var(--shell-accent-muted);
  color: var(--shell-accent);
}

.app-header__link--dropdown {
  border: none;
  background: transparent;
  cursor: pointer;
}

.app-header__chevron {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.app-header__chevron--open {
  transform: rotate(180deg);
}

.app-header__dropdown-wrap {
  position: relative;
}

.app-header__dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 60;
  min-width: 13rem;
  max-height: min(24rem, 70vh);
  overflow-y: auto;
  padding: 0.375rem;
  border: 1px solid var(--shell-border);
  border-radius: 0.75rem;
  background: var(--shell-bg-elevated);
  box-shadow: var(--shell-shadow);
}

.app-header__dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 2.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--shell-text-muted);
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}

.app-header__dropdown-item:hover {
  background-color: var(--shell-hover-bg);
  color: var(--shell-text);
}

.app-header__dropdown-item--active {
  background-color: var(--shell-accent-muted);
  color: var(--shell-accent);
  font-weight: 600;
}

.app-header__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.125rem;
}

.app-header__menu-btn {
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
  transition: background-color 0.15s, color 0.15s;
}

@media (min-width: 768px) {
  .app-header__menu-btn {
    display: none;
  }
}

.app-header__menu-btn:hover {
  background-color: var(--shell-hover-bg);
  color: var(--shell-text);
}

.app-header__menu-btn:focus-visible {
  outline: 2px solid var(--shell-accent);
  outline-offset: 2px;
}
</style>
