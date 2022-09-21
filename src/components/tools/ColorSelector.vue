<script setup lang="ts">
const { isMono } = defineProps<{
  isMono?: boolean
}>()
const emit = defineEmits(['select'])
const colorList = ref<string[]>([])
const selectedColor = ref<string>('')

if (isMono)
  colorList.value = getColorAdjusts().map(adj => `bg-gray-${adj}`)

else
  colorList.value = getColors().map(color => `bg-${color}-400`)
const select = (color: string) => {
  selectedColor.value = color
  emit('select', color)
}
</script>

<template>
  <div class="w-full flex flex-wrap">
    <div class="hidden border-green-600">
      Color cached div
    </div>
    <div v-for="c in colorList" :key="c" class="w-24 h-24 border-2  hover:border-green-400" :class="`${c} ${c === selectedColor ? 'border-green-600' : 'border-white-0'}`" @click="select(c)" />
  </div>
</template>
