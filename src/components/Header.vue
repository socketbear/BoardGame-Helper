<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
</script>

<template>
  <header>
    <div class="h-12 flex items-center">
      <router-link class="ml-4 text-xl font-bold hover:text-green-500 cursor-pointer" to="/">
        Board Game Helper
      </router-link>
      <div class="ml-12">
        <Menu>
          <MenuButton>Games</MenuButton>
          <div class="fixed">
            <MenuItems class="flex flex-col bg-white border border-gray-200 rounded-md shadow-md">
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/game/rich">
                  Rich!
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/game/hanabi">
                  하나비 헬퍼
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/game/hanabi/game-v2">
                  하나비 헬퍼 V2
                </a>
              </MenuItem>
            </MenuItems>
          </div>
        </Menu>
      </div>
      <div class="ml-12">
        <Menu>
          <MenuButton>Sandbox</MenuButton>
          <div class="fixed">
            <MenuItems class="flex flex-col bg-white border border-gray-200 rounded-md shadow-md">
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/sandbox/dice-pad">
                  Dice
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/sandbox/gesture">
                  Gesture
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/sandbox/el-drag-drop">
                  Element Drag n Drop
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/sandbox/calc">
                  Calculator
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/sandbox/gsap">
                  GSAP
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/sandbox/vue-drag">
                  Drag n Drop
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/sandbox/dragger">
                  Draggable
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" class="px-4 py-2 hover:bg-gray-100" href="/sandbox/image-overlay">
                  Image Overlay
                </a>
              </MenuItem>
            </MenuItems>
          </div>
        </Menu>
      </div>
    </div>
  </header>
</template>
