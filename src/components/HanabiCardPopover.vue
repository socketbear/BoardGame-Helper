<script setup lang="ts">
import { computed } from 'vue'
import type { PopoverItem } from '@/types/HanabiTypes'

const props = defineProps<{
  isOpen: boolean
  items: PopoverItem[]
  position: { top: number, left: number }
}>()

const emit = defineEmits(['select', 'close'])

const popoverStyle = computed(() => ({
  top: `${props.position.top}px`,
  left: `${props.position.left}px`,
  transform: 'translateX(-50%)', // 중앙 정렬을 위해 추가
}))

function selectItem(item: PopoverItem) {
  emit('select', item)
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="hanabi-card-popover" :style="popoverStyle">
    <div class="popover-content">
      <div class="button-row">
        <button
          v-for="item in items"
          :key="item.value"
          class="popover-button"
          :class="{ selected: item.selected, impossible: item.impossible }"
          :style="item.style"
          @click="selectItem(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hanabi-card-popover {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 80px; /* 최소 너비 설정 */
  max-width: 200px; /* 최대 너비 설정 */
  transform-origin: top center; /* 추가 */
}

.popover-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
}

.popover-button {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #f0f0f0;
  padding: 0;
  margin: 0;
}

.popover-button.selected {
  background-color: #3498db;
  color: white;
}

.popover-button.impossible {
  opacity: 0.5;
  text-decoration: line-through;
}

/* 하얀색 버튼을 위한 특별한 스타일 */
.popover-button[style*='background-color: #FFFFFF'] {
  border: 1px solid #000;
}
</style>
