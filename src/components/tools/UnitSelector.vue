<script setup lang="ts">
import { CUnits } from '~/enums'

const emit = defineEmits(['select'])
const selectedUnit = ref<string>('')
const select = (unit: string) => {
  selectedUnit.value = unit
  emit('select', unit)
}
</script>

<template>
  <div class="w-full flex flex-wrap">
    <div v-for="u in CUnits" :key="u" class="w-24 h-24 bg-gray-200 flex items-center justify-center text-2xl font-bold border-2  hover:border-green-400" :class="`${u === selectedUnit ? 'border-green-600' : 'border-white-0'}`" @click="select(u)">
      {{ u }}
    </div>
  </div>
</template>
