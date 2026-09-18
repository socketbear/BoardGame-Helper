<script setup lang="ts">
import type { MoneyActor } from '~/types/MoneyBoardTypes'
import { UNIT_POSITION } from '~/types/RichEnums'

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

const unitStore = useUnitStore()
const unit = computed(() => unitStore.currency.unit)
const unitInFront = computed(() => unitStore.currency.unitPosition === UNIT_POSITION.FRONT)

/**
 * CountNumber 가 previous → next 로 굴리는 동안 화면에 나올 수 있는 숫자 문자열 중 가장 긴 후보들.
 * 중간값은 두 끝값 사이라 자릿수가 끝값을 넘지 않는다. 증감 표시는 CountNumber 가 콤마 없이 그린다.
 * CountNumber 는 마운트 때 0 에서 출발하므로 이전 값이 없거나 무한이면 0 으로 본다.
 */
function numberTexts(next: number, previous: number) {
  if (!Number.isFinite(next))
    return ['∞']
  const from = Number.isFinite(previous) ? previous : 0
  return [next.toLocaleString(), from.toLocaleString(), String(next - from)]
}

// 폭 계산 대상. 금액이 바뀌면 이전·새 후보를 더해 즉시 줄이고, 카운트가 끝나면 새 금액만 남겨 다시 키운다
const measureTexts = ref(numberTexts(actor.balance, 0))

// CountNumber: 스로틀 100ms + 카운트 1초. 여유를 둬서 끝난 뒤에 되돌린다
const { start: settleAfterCount } = useTimeoutFn(() => {
  measureTexts.value = [hasFiniteBalance.value ? actor.balance.toLocaleString() : '∞']
}, 1200, { immediate: false })

watch(() => actor.balance, (next, previous) => {
  measureTexts.value = [...new Set([...measureTexts.value, ...numberTexts(next, previous)])]
  settleAfterCount()
})

const amountRef = useTemplateRef('amount')
const numberProbes = useTemplateRef('numberProbe')
const unitProbe = useTemplateRef('unitProbe')

const availableWidth = ref(0)
const numberWidth = ref(0)
const unitWidth = ref(0)

// 측정용 span 은 기본 글자 크기로 그려진다. 금액·단위·네모 크기가 바뀔 때만 잰다(매 프레임 아님)
function measure() {
  numberWidth.value = Math.max(0, ...(numberProbes.value ?? []).map(el => el.getBoundingClientRect().width))
  unitWidth.value = unitProbe.value?.getBoundingClientRect().width ?? 0
}

useResizeObserver(amountRef, ([entry]) => {
  if (!entry)
    return
  availableWidth.value = entry.contentRect.width
  // sm 경계에서 기본 글자 크기가 바뀌므로 크기 변화 때 다시 잰다
  measure()
})

watch([measureTexts, unit], measure, { flush: 'post' })

onMounted(() => {
  // 마운트 때도 CountNumber 가 0 에서 굴러오므로 끝난 뒤 정리한다
  settleAfterCount()
  // 웹폰트가 늦게 오면 폭이 달라진다
  document.fonts.ready.then(measure)
})

// 기본 크기보다 커지지 않는다(최대 1). 소수점 오차로 1px 넘치지 않게 내림
const scale = computed(() => {
  const total = numberWidth.value + unitWidth.value
  if (!availableWidth.value || total <= availableWidth.value)
    return 1
  return Math.floor((availableWidth.value / total) * 1000) / 1000
})

const amountStyle = computed(() => ({ fontSize: `${scale.value}em` }))
// 숫자 칸을 가장 긴 후보 폭으로 잡아 둔다: 증감 표시(숫자 칸 폭 기준 absolute)도 이 폭 안에 들어간다
const numberStyle = computed(() => ({ minWidth: `${numberWidth.value * scale.value}px` }))
</script>

<template>
  <div
    class="aspect-[4/3] max-w-72 w-full flex flex-col cursor-grab touch-none select-none border-4 rounded-lg p-2 transition-shadow sm:p-3"
    :class="[colorClass, ringClass]"
    :data-actor-id="actor.id"
  >
    <span class="truncate text-base font-bold sm:text-xl">{{ actor.name }}</span>
    <div ref="amount" class="relative mt-auto text-right text-2xl font-bold tabular-nums sm:text-4xl">
      <div class="flex items-baseline justify-end whitespace-nowrap" :style="amountStyle">
        <span v-if="unitInFront">{{ unit }}</span>
        <div :style="numberStyle">
          <!-- 상태 소유자는 useMoneyBoard. CountNumber 는 읽기만 하므로 v-model 이 아닌 단방향 전달 -->
          <tools-count-number v-if="hasFiniteBalance" :model-value="actor.balance" />
          <span v-else>∞</span>
        </div>
        <span v-if="!unitInFront">{{ unit }}</span>
      </div>
      <!-- 폭 측정 전용: 보이지 않고 배치에도 영향 없음 -->
      <div aria-hidden="true" class="invisible absolute h-0 w-0 overflow-hidden">
        <span v-for="text in measureTexts" ref="numberProbe" :key="text" class="block w-max whitespace-nowrap">{{ text }}</span>
        <span ref="unitProbe" class="block w-max whitespace-nowrap">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>
