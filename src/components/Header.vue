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
            <MenuItems class="flex flex-col">
              <MenuItem disabled>
                <span class="opacity-75">Rich! (coming soon!)</span>
              </MenuItem>
            </MenuItems>
          </div>
        </Menu>
      </div>
      <div class="ml-12">
        <Menu>
          <MenuButton>Sandbox</MenuButton>
          <div class="fixed">
            <MenuItems class="flex flex-col">
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" href="/sandbox/dice-pad">
                  Dice
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" href="/sandbox/gesture">
                  Gesture
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" href="/sandbox/el-drag-drop">
                  Element Drag n Drop
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" href="/sandbox/calc">
                  Calculator
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" href="/sandbox/gsap">
                  GSAP
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" href="/sandbox/vue-drag">
                  Drag n Drop
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a :class="{ 'bg-blue-500': active }" href="/sandbox/dragger">
                  Draggable
                </a>
              </MenuItem>
            </MenuItems>
          </div>
        </Menu>
      </div>
    </div>
  </header>
</template>
