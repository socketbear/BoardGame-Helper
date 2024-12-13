<script setup lang="ts">
import { ref } from 'vue'

const activeIndex = ref('/dashboard')

const { isLocalhost } = useHostCheck()
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="header-menu"
    mode="horizontal"
    router
  >
    <div class="logo-container">
      <img src="/board-icon.svg" alt="Board Helper Logo" class="logo-image">
      <span class="logo-text">Board Helper</span>
    </div>

    <el-menu-item index="/">
      홈
    </el-menu-item>
    <el-sub-menu index="games">
      <template #title>
        보드게임들
      </template>
      <el-menu-item index="/games/rich">
        부자 만들기
      </el-menu-item>
      <el-menu-item index="/games/hanabi">
        하나비
      </el-menu-item>
      <el-menu-item index="/games/fantasy-kingdom">
        판타지 왕국
      </el-menu-item>
      <el-menu-item index="/games/seven-wonders-duel">
        세븐 원더스 듀얼
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/about">
      About
    </el-menu-item>
    <ClientOnly>
      <el-sub-menu v-if="isLocalhost" index="dev-tools">
        <template #title>
          개발 도구
        </template>
        <el-menu-item index="/sandbox">
          Sandbox
        </el-menu-item>
      </el-sub-menu>
    </ClientOnly>
  </el-menu>
</template>

<style scoped>
.header-menu {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 40px;
}

.logo-image {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}
</style>
