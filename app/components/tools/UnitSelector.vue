<script setup lang="ts">
import { CUnits } from '~/types/RichEnums'

const emit = defineEmits(['select'])
const selectedUnit = ref<string>('')
function select(unit: string) {
  selectedUnit.value = unit
  emit('select', unit)
}
</script>

<template>
  <div class="w-full flex flex-wrap">
    <div v-for="u in CUnits" :key="u" class="h-24 w-24 flex items-center justify-center border-2 bg-gray-200 text-2xl font-bold hover:border-green-400" :class="`${u === selectedUnit ? 'border-green-600' : 'border-white-0'}`" @click="select(u)">
      {{ u }}
    </div>
  </div>
</template>
