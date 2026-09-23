<script setup lang="ts">
import type { MoneyActor } from '~/types/MoneyBoardTypes'
import NumberSetter from '~/components/tools/NumberSetter.vue'
import { UNIT_POSITION } from '~/types/RichEnums'

type ActorDraft = Omit<MoneyActor, 'id'>

/** 설정 중인 플레이어. key 는 v-for 전용이고 emit 에는 싣지 않는다. */
interface PlayerDraft {
  key: string
  name: string
  color: string
  budget: number
}

const emit = defineEmits<{
  start: [actors: ActorDraft[]]
}>()

const { getUniqueId } = useUtils()

interface UnitPreset {
  label: string
  unit: string
  position: UNIT_POSITION
}

const UNIT_PRESETS: UnitPreset[] = [
  { label: '만원', unit: '만원', position: UNIT_POSITION.BACK },
  { label: '원', unit: '원', position: UNIT_POSITION.BACK },
  { label: '₩', unit: '₩', position: UNIT_POSITION.FRONT },
  { label: '$', unit: '$', position: UNIT_POSITION.FRONT },
  { label: 'G', unit: 'G', position: UNIT_POSITION.BACK },
  { label: '점', unit: '점', position: UNIT_POSITION.BACK },
  { label: '없음', unit: '', position: UNIT_POSITION.BACK },
]

const unitStore = useUnitStore()
// 설정 화면이 열릴 때 기본 단위는 만원(뒤). 다른 게임에서 남은 값에 의존하지 않는다.
const DEFAULT_UNIT = '만원'
unitStore.setUnit(DEFAULT_UNIT, UNIT_POSITION.BACK)

/** 직접 입력 칸. 비어 있지 않으면 프리셋 대신 이 값이 뒤에 붙는 단위로 적용된다. */
const customUnit = ref('')

const unitChips = computed(() => UNIT_PRESETS.map(preset => ({
  ...preset,
  selected: customUnit.value === ''
    && unitStore.currency.unit === preset.unit
    && unitStore.currency.unitPosition === preset.position,
})))

function selectPreset(preset: UnitPreset) {
  customUnit.value = ''
  unitStore.setUnit(preset.unit, preset.position)
}

function applyCustomUnit() {
  // 칸을 비우면 기본값으로 — 지우는 도중의 마지막 글자가 단위로 남지 않게
  unitStore.setUnit(customUnit.value.trim() || DEFAULT_UNIT, UNIT_POSITION.BACK)
}

const bank = reactive({
  name: '은행',
  color: 'bg-gray-500',
  isInfinite: true,
  budget: 0,
})

const players = ref<PlayerDraft[]>([])

function addPlayer() {
  const firstBudget = players.value[0] ? players.value[0].budget : 0

  players.value.push({
    key: getUniqueId(),
    name: `Player${players.value.length + 1}`,
    color: 'bg-blue-400',
    budget: firstBudget,
  })
}

addPlayer()

function deletePlayer(player: PlayerDraft) {
  players.value = players.value.filter(p => p.key !== player.key)
}

const canStart = computed(() => players.value.length > 0)

function start() {
  const bankActor: ActorDraft = {
    name: bank.name,
    color: bank.color,
    balance: bank.isInfinite ? Number.POSITIVE_INFINITY : bank.budget,
    isBank: true,
  }
  const playerActors: ActorDraft[] = players.value.map(p => ({
    name: p.name,
    color: p.color,
    balance: p.budget,
    isBank: false,
  }))

  emit('start', [bankActor, ...playerActors])
}
</script>

<template>
  <div class="p-4">
    <h2 class="text-left text-xl">
      단위
    </h2>
    <div class="my-2 flex flex-wrap items-center gap-2">
      <button
        v-for="chip in unitChips"
        :key="`unit-${chip.label}`"
        class="h-8 flex cursor-pointer items-center rounded-xl p-2 text-center name-tag"
        :class="chip.selected ? 'bg-green-600 text-white' : 'bg-gray-200'"
        :aria-pressed="chip.selected"
        @click="selectPreset(chip)"
      >
        {{ chip.label }}
      </button>
      <input
        v-model="customUnit"
        type="text"
        class="h-8 w-28 border rounded-xl p-2"
        :class="{ 'border-green-600': customUnit }"
        placeholder="직접 입력"
        @input="applyCustomUnit"
      >
    </div>
    <div class="my-2 w-full border-b-2" />
    <h2 class="text-left text-xl">
      은행
    </h2>
    <div class="my-2 flex items-center">
      <div class="relative min-w-0">
        <input v-model="bank.name" type="text" class="w-full border p-2 pr-8" placeholder="이름을 입력해 주세요.">
        <button
          class="absolute right-2 top-3 hover:text-red-600 active:hover:text-red-400"
          @click="bank.name = ''"
        >
          <div i-carbon-close-filled />
        </button>
      </div>
    </div>
    <tools-color-selector :is-mono="true" :color="bank.color" @select="(color: string) => bank.color = color" />
    <div class="my-2 flex items-center">
      <el-switch v-model="bank.isInfinite" active-text="무한대" />
    </div>
    <NumberSetter v-if="!bank.isInfinite" :budget="bank.budget" @change="(amount: number) => bank.budget = amount" />
    <div class="my-2 w-full border-b-2" />
    <h2 class="text-left text-xl">
      플레이어
    </h2>
    <div class="my-2 w-full border-b-2" />
    <div v-for="(player, idx) in players" :key="`prepare-${player.key}`" class="w-full">
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0 flex items-center">
          <h2 class="mr-2 shrink-0 text-left text-lg">
            플레이어 {{ idx + 1 }}
          </h2>
          <div class="relative min-w-0">
            <input v-model="player.name" type="text" class="w-full border p-2 pr-8" placeholder="이름을 입력해 주세요.">
            <button
              class="absolute right-2 top-3 hover:text-red-600 active:hover:text-red-400"
              @click="player.name = ''"
            >
              <div i-carbon-close-filled />
            </button>
          </div>
        </div>
        <button class="my-1 shrink-0 tiny-del-btn" @click="deletePlayer(player)">
          삭제
        </button>
      </div>
      <tools-color-selector :color="player.color" @select="(color: string) => player.color = color" />
      <NumberSetter :budget="player.budget" @change="(amount: number) => player.budget = amount" />
      <div class="my-2 w-full border-b-2" />
    </div>
    <div class="flex justify-center">
      <button class="mr-2 flex items-center tiny-btn" @click="addPlayer">
        추가
        <div class="i-carbon-add w-4" />
      </button>
      <button
        class="flex items-center disabled:cursor-not-allowed tiny-btn disabled:opacity-50"
        :disabled="!canStart"
        @click="start"
      >
        완료
        <div class="i-carbon-task-complete w-4" />
      </button>
    </div>
  </div>
</template>
