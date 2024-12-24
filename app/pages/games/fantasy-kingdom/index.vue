<script setup>
import { User } from '@element-plus/icons-vue'

// 카드 종류별 상수 정의
const CARD_TYPES = {
  WATER: '물',
  FIRE: '불',
  EARTH: '땅',
  WEATHER: '날씨',
  WIZARD: '마법사',
  LEADER: '지도자',
  ARMY: '군대',
  WEAPON: '무기',
  BEAST: '야수',
  ARTIFACT: '유물',
  WILD: '불명',
}

const currentPlayer = ref(1)
const playerScores = ref([])
const playerName = ref('')
const quickNames = ['도바킨', '아빠', '엄마', '삼촌', '친구']

// 카드별 점수 구조 변경
const cardScores = ref([
  { basePoints: 0, bonusPoints: 0, penaltyPoints: 0, cardType: '', total: 0 },
  { basePoints: 0, bonusPoints: 0, penaltyPoints: 0, cardType: '', total: 0 },
  { basePoints: 0, bonusPoints: 0, penaltyPoints: 0, cardType: '', total: 0 },
  { basePoints: 0, bonusPoints: 0, penaltyPoints: 0, cardType: '', total: 0 },
  { basePoints: 0, bonusPoints: 0, penaltyPoints: 0, cardType: '', total: 0 },
  { basePoints: 0, bonusPoints: 0, penaltyPoints: 0, cardType: '', total: 0 },
  { basePoints: 0, bonusPoints: 0, penaltyPoints: 0, cardType: '', total: 0 },
])

const finalTotal = computed(() => {
  return cardScores.value.reduce((sum, card) => sum + card.total, 0)
})

function calculateCardTotal(index) {
  const card = cardScores.value[index]
  card.total = Number(card.basePoints) + Number(card.bonusPoints) - Number(card.penaltyPoints)
}

function saveScore() {
  playerScores.value[currentPlayer.value - 1] = {
    name: playerName.value,
    cards: cardScores.value.map(card => ({
      ...card,
      cardType: card.cardType,
    })),
    finalTotal: finalTotal.value,
  }
}

function nextPlayer() {
  saveScore()
  currentPlayer.value++
  playerName.value = ''
  cardScores.value = cardScores.value.map(() => ({
    basePoints: 0,
    bonusPoints: 0,
    penaltyPoints: 0,
    cardType: '',
    total: 0,
  }))
}

const activeInput = ref(null)
const showNumberPad = ref(false)

function openNumberPad(cardIndex, field) {
  activeInput.value = { cardIndex, field }
  showNumberPad.value = true
}

function handleNumberInput(value) {
  if (activeInput.value) {
    const { cardIndex, field } = activeInput.value
    cardScores.value[cardIndex][field] = value
    calculateCardTotal(cardIndex)
  }
}

const currentValue = computed({
  get: () => activeInput.value ? cardScores.value[activeInput.value.cardIndex][activeInput.value.field] : 0,
  set: (val) => {
    if (activeInput.value) {
      cardScores.value[activeInput.value.cardIndex][activeInput.value.field] = val
      handleNumberInput(val)
    }
  },
})
</script>

<template>
  <div>
    <el-page-header class="ml-4 mt-2" @back="() => $router.push('/')">
      <template #content>
        <span class="text-large mr-3 font-bold">판타지 왕국 점수 계산기</span>
      </template>
    </el-page-header>

    <div class="mx-auto max-w-7xl p-5">
      <div class="grid grid-cols-[2fr_1fr] gap-5">
        <ElCard class="player-section">
          <template #header>
            <div class="flex items-center gap-4">
              <h2>플레이어 {{ currentPlayer }}</h2>
              <div class="flex-1">
                <el-input
                  v-model="playerName"
                  placeholder="플레이어 이름"
                  class="w-full"
                >
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
                <div class="mt-2 flex gap-2">
                  <el-tag
                    v-for="name in quickNames"
                    :key="name"
                    :type="playerName === name ? 'success' : 'info'"
                    class="cursor-pointer"
                    @click="playerName = name"
                  >
                    {{ name }}
                  </el-tag>
                </div>
              </div>
            </div>
          </template>

          <div class="flex flex-col gap-5">
            <ElCard v-for="(card, index) in cardScores" :key="index" class="mb-4">
              <template #header>
                <div class="flex items-center justify-between">
                  <span class="w-[100px]">카드 {{ index + 1 }}</span>
                  <ElSelect v-model="card.cardType" placeholder="카드 종류" size="small" class="w-[150px]">
                    <ElOption v-for="(value, key) in CARD_TYPES" :key="key" :label="value" :value="key" />
                  </ElSelect>
                </div>
              </template>

              <div class="flex flex-col gap-4">
                <div class="grid grid-cols-3 gap-3">
                  <div class="flex flex-col gap-2">
                    <span class="text-sm text-gray-600">기본 힘:</span>
                    <div
                      class="min-w-[80px] cursor-pointer border border-gray-200 rounded bg-gray-50 p-2 text-center hover:border-blue-500"
                      @click="openNumberPad(index, 'basePoints')"
                    >
                      {{ card.basePoints }}
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <span class="text-sm text-gray-600">보너스:</span>
                    <div
                      class="min-w-[80px] cursor-pointer border border-gray-200 rounded bg-gray-50 p-2 text-center hover:border-blue-500"
                      @click="openNumberPad(index, 'bonusPoints')"
                    >
                      {{ card.bonusPoints }}
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <span class="text-sm text-gray-600">페널티:</span>
                    <div
                      class="min-w-[80px] cursor-pointer border border-gray-200 rounded bg-gray-50 p-2 text-center hover:border-blue-500"
                      @click="openNumberPad(index, 'penaltyPoints')"
                    >
                      {{ card.penaltyPoints }}
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-200 pt-2 text-right text-blue-600 font-bold">
                  카드 총점: {{ card.total }}
                </div>
              </div>
            </ElCard>

            <div class="my-5 text-right text-xl text-green-600 font-bold">
              최종 총점: {{ finalTotal }}
            </div>

            <div class="flex justify-end gap-2.5">
              <ElButton type="primary" @click="saveScore">
                점수 저장
              </ElButton>
              <ElButton type="success" @click="nextPlayer">
                다음 플레이어
              </ElButton>
            </div>
          </div>
        </ElCard>

        <ElCard class="scores-summary">
          <template #header>
            <h3>플레이어 점수</h3>
          </template>
          <div v-for="(score, index) in playerScores" :key="index" class="border-b border-gray-200 p-2.5 last:border-b-0">
            <h4>{{ score.name || `플레이어 ${index + 1}` }}</h4>
            <div class="final-score">
              최종 점수: {{ score.finalTotal }}점
            </div>
            <div class="mt-2.5 flex flex-col gap-1.5">
              <div v-for="(card, cardIndex) in score.cards" :key="cardIndex">
                카드 {{ cardIndex + 1 }}:
                <ElTag size="small">
                  {{ CARD_TYPES[card.cardType] }}
                </ElTag>
                <span class="ml-2 text-gray-600">({{ card.total }}점)</span>
              </div>
            </div>
          </div>
        </ElCard>
      </div>
    </div>
    <tools-number-pad
      v-model="currentValue"
      v-model:visible="showNumberPad"
      :title="activeInput ? `${activeInput.field === 'basePoints' ? '기본 힘' : activeInput.field === 'bonusPoints' ? '보너스' : '페널티'} 입력` : ''"
    />
  </div>
</template>
