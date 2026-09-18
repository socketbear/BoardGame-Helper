<script setup lang="ts">
import type { MoneyActor } from '~/types/MoneyBoardTypes'

const { actor, highlighted } = defineProps<{
  actor: MoneyActor
  /** 드래그 출발 네모이거나 화살표가 가리키는 대상 네모 */
  highlighted: boolean
}>()

// drag/Box.vue 와 같은 규칙: bg-xxx-NNN → border-xxx-600, 회색 계열은 흰 글자
const colorClass = computed(() => {
  const borderColor = actor.color.replace('bg-', 'border-').replace(/-\d{3}/, '-600')
  const textColor = actor.color.includes('gray') ? 'text-white' : ''
  return `${actor.color} ${borderColor} ${textColor}`
})

const ringClass = computed(() => highlighted ? 'ring-4 ring-teal-600 dark:ring-teal-400' : '')

const balanceText = computed(() => Number.isFinite(actor.balance) ? actor.balance.toLocaleString() : '∞')
</script>

<template>
  <div
    class="h-32 w-32 flex flex-col cursor-grab touch-none select-none border-4 rounded-lg p-2 transition-shadow"
    :class="[colorClass, ringClass]"
    :data-actor-id="actor.id"
  >
    <span class="truncate font-bold">{{ actor.name }}</span>
    <span class="mt-auto break-all text-right">{{ balanceText }}</span>
  </div>
</template>
