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

// 무한 은행은 CountNumber 에 넘기지 않는다: gsap 가 Infinity 를 보간하면 NaN 이 된다
const hasFiniteBalance = computed(() => Number.isFinite(actor.balance))
</script>

<template>
  <div
    class="aspect-[4/3] max-w-72 w-full flex flex-col cursor-grab touch-none select-none border-4 rounded-lg p-2 transition-shadow sm:p-3"
    :class="[colorClass, ringClass]"
    :data-actor-id="actor.id"
  >
    <span class="truncate text-base font-bold sm:text-xl">{{ actor.name }}</span>
    <div class="mt-auto text-right text-2xl font-bold tabular-nums sm:text-4xl">
      <!-- 상태 소유자는 useMoneyBoard. CountNumber 는 읽기만 하므로 v-model 이 아닌 단방향 전달 -->
      <tools-count-number v-if="hasFiniteBalance" :model-value="actor.balance" />
      <span v-else>∞</span>
    </div>
  </div>
</template>
