<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PopoverItem } from '@/types/HanabiTypes'

const props = defineProps<{
  index: number
}>()

const selectedNumber = ref<number | null>(null)
const selectedColor = ref<string | null>(null)
const isPopoverOpen = ref(false)
const isHintPopoverOpen = ref(false)

const impossibleNumbers = ref<number[]>([])
const impossibleColors = ref<string[]>([])

// 정렬된 impossibleNumbers를 반환하는 computed 속성 추가
const sortedImpossibleNumbers = computed(() => [...impossibleNumbers.value].sort((a, b) => a - b))
const sortedImpossibleColors = computed(() => [...impossibleColors.value].sort())

const popoverPosition = ref({ top: 0, left: 0 })

function openPopover(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  popoverPosition.value = {
    top: rect.bottom,
    left: rect.left + rect.width / 2, // 중앙 정렬을 위해 수정
  }
  closeAllPopovers()
  isPopoverOpen.value = true
}

function openHintPopover(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  popoverPosition.value = {
    top: rect.bottom,
    left: rect.left + rect.width / 2, // 중앙 정렬을 위해 수정
  }
  closeAllPopovers()
  isHintPopoverOpen.value = true
}

function closeAllPopovers() {
  const allCards = document.querySelectorAll('.card-container')
  allCards.forEach((card) => {
    card.dispatchEvent(new CustomEvent('close-popover'))
  })
}

function handleClosePopover() {
  isPopoverOpen.value = false
  isHintPopoverOpen.value = false
}

onMounted(() => {
  const cardContainer = document.querySelector('.card-container')
  cardContainer?.addEventListener('close-popover', handleClosePopover)
})

onUnmounted(() => {
  const cardContainer = document.querySelector('.card-container')
  cardContainer?.removeEventListener('close-popover', handleClosePopover)
})

function selectNumber(number: number) {
  selectedNumber.value = number
  isPopoverOpen.value = false
}

function selectColor(color: string) {
  selectedColor.value = color
  isPopoverOpen.value = false
}

function resetCard() {
  selectedNumber.value = null
  selectedColor.value = null
  impossibleNumbers.value = []
  impossibleColors.value = []
  isPopoverOpen.value = false
  isHintPopoverOpen.value = false
}

function toggleImpossibleNumber(number: number) {
  const index = impossibleNumbers.value.indexOf(number)
  if (index > -1) {
    impossibleNumbers.value.splice(index, 1)
  }
  else {
    impossibleNumbers.value.push(number)
  }
  isHintPopoverOpen.value = false
}

function toggleImpossibleColor(color: string) {
  const index = impossibleColors.value.indexOf(color)
  if (index > -1) {
    impossibleColors.value.splice(index, 1)
  }
  else {
    impossibleColors.value.push(color)
  }
  isHintPopoverOpen.value = false
}

const numbers = [1, 2, 3, 4, 5]
const colors = [
  { name: '흰색', value: '#FFFFFF', textColor: '#000000' },
  { name: '빨간색', value: '#FF0000', textColor: '#FFFFFF' },
  { name: '노란색', value: '#FFFF00', textColor: '#000000' },
  { name: '초록색', value: '#00FF00', textColor: '#000000' },
  { name: '파란색', value: '#0000FF', textColor: '#FFFFFF' },
]

const popoverItems = computed<PopoverItem[]>(() => [
  ...numbers.map(n => ({
    value: n,
    label: n.toString(),
    selected: selectedNumber.value === n,
    impossible: impossibleNumbers.value.includes(n),
  })),
  ...colors.map(c => ({
    value: c.value,
    label: '',
    style: { backgroundColor: c.value },
    selected: selectedColor.value === c.value,
    impossible: impossibleColors.value.includes(c.value),
  })),
])

const hintPopoverItems = computed(() => [
  ...numbers.map(n => ({ value: n, label: n.toString(), impossible: impossibleNumbers.value.includes(n) })),
  ...colors.map(c => ({
    value: c.value,
    label: '',
    style: { backgroundColor: c.value },
    impossible: impossibleColors.value.includes(c.value),
  })),
])

function handlePopoverSelect(item: { value: string | number, label: string }) {
  if (typeof item.value === 'number') {
    selectNumber(item.value)
  }
  else {
    selectColor(item.value as string)
  }
  closePopover()
}

function handleHintPopoverSelect(item: { value: string | number, label: string }) {
  if (typeof item.value === 'number') {
    toggleImpossibleNumber(item.value)
  }
  else {
    toggleImpossibleColor(item.value)
  }
  closeHintPopover()
}

function closePopover() {
  isPopoverOpen.value = false
}

function closeHintPopover() {
  isHintPopoverOpen.value = false
}
</script>

<template>
  <div class="card-container">
    <button class="reset-button" @click="resetCard">
      리셋
    </button>
    <div class="card-wrapper">
      <div class="card" @click="openPopover">
        <div class="card-inner" :class="{ 'is-flipped': selectedNumber !== null || selectedColor !== null }">
          <div class="card-back">
            <div class="pattern" />
          </div>
          <div class="card-front" :style="{ backgroundColor: selectedColor, color: selectedColor ? colors.find(c => c.value === selectedColor)?.textColor : '#000000' }">
            {{ selectedNumber }}
          </div>
        </div>
      </div>
    </div>

    <button class="hint-button" @click="openHintPopover">
      힌트
    </button>

    <HanabiCardPopover
      :is-open="isPopoverOpen"
      :items="popoverItems"
      :position="popoverPosition"
      @select="handlePopoverSelect"
      @close="isPopoverOpen = false"
    />

    <HanabiCardPopover
      :is-open="isHintPopoverOpen"
      :items="hintPopoverItems"
      :position="popoverPosition"
      @select="handleHintPopoverSelect"
      @close="isHintPopoverOpen = false"
    />

    <div class="hint-icons">
      <div class="hint-row">
        <span v-for="number in sortedImpossibleNumbers" :key="number" class="hint-icon number-hint">{{ number }}</span>
      </div>
      <div class="hint-row">
        <span
          v-for="color in impossibleColors"
          :key="color"
          class="hint-icon color-hint"
          :style="{ backgroundColor: color }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
}

.card-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.reset-button {
  width: 100%;
  padding: 5px 0;
  margin-bottom: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.card {
  z-index: 1;
}

.reset-button {
  z-index: 0;
}

.card {
  width: 80px;
  height: 120px;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
}

.card-back {
  background-color: #2c3e50;
}

.card-front {
  background-color: #ecf0f1;
  transform: rotateY(180deg);
}

.pattern {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  background-image: linear-gradient(45deg, #34495e 25%, transparent 25%),
    linear-gradient(-45deg, #34495e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #34495e 75%),
    linear-gradient(-45deg, transparent 75%, #34495e 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
  border: 2px solid #3498db;
  border-radius: 4px;
}

.reset-button {
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.reset-button:hover {
  background-color: #c0392b;
}

.hint-button {
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.hint-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  width: 100%;
}

.hint-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  margin-bottom: 2px;
  width: 100%;
}

.hint-icon {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 50%;
  font-size: 12px;
}

.number-hint {
  background-color: #f0f0f0;
}

.color-hint {
  border: 1px solid #ccc; /* 모든 색상 힌트에 테두리 추가 */
}

/* 하얀색 힌트를 위한 특별한 스타일 */
.color-hint[style*='background-color: #FFFFFF'] {
  border: 1px solid #000; /* 하얀색 힌트에 검은색 테두리 추가 */
}
</style>
