<script setup>
import { computed, ref } from 'vue'
import { ElButton, ElCard, ElInput, ElOption, ElSelect } from 'element-plus'
import NumberPad from '~/components/tools/NumberPad.vue'

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

const calculateCardTotal = (index) => {
  const card = cardScores.value[index]
  card.total = Number(card.basePoints) + Number(card.bonusPoints) - Number(card.penaltyPoints)
}

const saveScore = () => {
  playerScores.value[currentPlayer.value - 1] = {
    cards: cardScores.value.map(card => ({
      ...card,
      cardType: card.cardType,
    })),
    finalTotal: finalTotal.value,
  }
}

const nextPlayer = () => {
  saveScore()
  currentPlayer.value++
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

const openNumberPad = (cardIndex, field) => {
  activeInput.value = { cardIndex, field }
  showNumberPad.value = true
}

const handleNumberInput = (value) => {
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
  <div class="fantasy-kingdom">
    <ElCard class="main-card">
      <template #header>
        <h1 class="title">
          판타지 왕국 점수 계산기
        </h1>
      </template>

      <div class="score-container">
        <ElCard class="player-section">
          <template #header>
            <h2>플레이어 {{ currentPlayer }}</h2>
          </template>

          <div class="cards-list">
            <ElCard v-for="(card, index) in cardScores" :key="index" class="card-score">
              <template #header>
                <div class="card-header">
                  <span>카드 {{ index + 1 }}</span>
                  <ElSelect v-model="card.cardType" placeholder="카드 종류" size="small">
                    <ElOption v-for="(value, key) in CARD_TYPES" :key="key" :label="value" :value="key" />
                  </ElSelect>
                </div>
              </template>

              <div class="score-inputs">
                <div class="score-row">
                  <div class="score-item">
                    <span>기본 힘:</span>
                    <div class="input-trigger" @click="openNumberPad(index, 'basePoints')">
                      {{ card.basePoints }}
                    </div>
                  </div>

                  <div class="score-item">
                    <span>보너스:</span>
                    <div class="input-trigger" @click="openNumberPad(index, 'bonusPoints')">
                      {{ card.bonusPoints }}
                    </div>
                  </div>

                  <div class="score-item">
                    <span>페널티:</span>
                    <div class="input-trigger" @click="openNumberPad(index, 'penaltyPoints')">
                      {{ card.penaltyPoints }}
                    </div>
                  </div>
                </div>

                <div class="card-total">
                  카드 총점: {{ card.total }}
                </div>
              </div>
            </ElCard>

            <div class="final-total">
              최종 총점: {{ finalTotal }}
            </div>

            <div class="buttons">
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
          <div v-for="(score, index) in playerScores" :key="index" class="player-score">
            <h4>플레이어 {{ index + 1 }}</h4>
            <div class="final-score">
              최종 점수: {{ score.finalTotal }}점
            </div>
            <div class="used-cards">
              <div v-for="(card, cardIndex) in score.cards" :key="cardIndex">
                카드 {{ cardIndex + 1 }}:
                <ElTag size="small">
                  {{ CARD_TYPES[card.cardType] }}
                </ElTag>
                <span class="card-points">({{ card.total }}점)</span>
              </div>
            </div>
          </div>
        </ElCard>
      </div>
    </ElCard>
  </div>
  <NumberPad
    v-model="currentValue"
    v-model:visible="showNumberPad"
    :title="activeInput ? `${activeInput.field === 'basePoints' ? '기본 힘' : activeInput.field === 'bonusPoints' ? '보너스' : '페널티'} 입력` : ''"
  />
</template>

<style scoped>
.fantasy-kingdom {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.main-card {
  background-color: var(--el-bg-color);
}

.title {
  text-align: center;
  color: var(--el-text-color-primary);
  margin: 0;
}

.score-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-selection {
  margin: 20px 0;
}

.total-score {
  font-size: 1.2em;
  font-weight: bold;
  margin: 20px 0;
  text-align: right;
  color: var(--el-color-primary);
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.player-score {
  padding: 10px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.player-score:last-child {
  border-bottom: none;
}

.used-cards {
  margin-top: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

:deep(.el-select) {
  width: 100%;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-score {
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.score-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-item span {
  font-size: 0.9em;
  color: var(--el-text-color-secondary);
}

.input-trigger {
  width: 100%;
  background-color: var(--el-fill-color-blank);
  padding: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}

.card-total {
  text-align: right;
  font-weight: bold;
  color: var(--el-color-primary);
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.final-total {
  font-size: 1.4em;
  font-weight: bold;
  text-align: right;
  margin: 20px 0;
  color: var(--el-color-success);
}

.card-points {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
}

:deep(.el-select) {
  width: 150px;
}

.used-cards {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-trigger {
  background-color: var(--el-bg-color-page);
  padding: 8px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  min-width: 80px;
  text-align: center;
}

.input-trigger:hover {
  border-color: var(--el-color-primary);
}
</style>

<route lang="yaml">
meta:
  layout: board
</route>
