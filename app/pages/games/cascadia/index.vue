<script setup>
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import CascadiaHistoryViewer from '~/components/tools/CascadiaHistoryViewer.vue'
import PlayerNameEditor from '~/components/tools/PlayerNameEditor.vue'
import { useIndexedDB } from '~/composables/useIndexedDB'

const ANIMALS = {
  BEAR: { name: '곰', color: '#4C3228' },
  ELK: { name: '엘크', color: '#C1801E' },
  SALMON: { name: '연어', color: '#E75D5D' },
  HAWK: { name: '매', color: '#4B9CD9' },
  FOX: { name: '여우', color: '#E67E22' },
}

const TERRAINS = {
  MOUNTAIN: { name: '산', color: '#A7C4E2', hasBonus: true },
  FOREST: { name: '숲', color: '#2E7D32', hasBonus: true },
  PRAIRIE: { name: '초원', color: '#FDD835', hasBonus: true },
  WETLAND: { name: '습지', color: '#81C784', hasBonus: true },
  RIVER: { name: '강', color: '#42A5F5', hasBonus: true },
}

const playerCount = 4
const players = ref(Array.from({ length: playerCount }, (_, i) => ({
  id: i + 1,
  name: `플레이어 ${i + 1}`,
  scores: {
    animals: {
      bear: 0,
      elk: 0,
      salmon: 0,
      hawk: 0,
      fox: 0,
    },
    terrains: {
      mountain: { base: 0, bonus: 0 },
      forest: { base: 0, bonus: 0 },
      prairie: { base: 0, bonus: 0 },
      wetland: { base: 0, bonus: 0 },
      river: { base: 0, bonus: 0 },
    },
    natureTokens: 0,
  },
})))

const activeInput = ref(null)
const showNumberPad = ref(false)

function openNumberPad(type, field, playerId, subType) {
  activeInput.value = { type, field, playerId, subType }
  showNumberPad.value = true
}

function handleNumberInput(value) {
  if (!activeInput.value)
    return

  const { type, field, playerId, subType } = activeInput.value
  const player = players.value.find(p => p.id === playerId)

  if (!player)
    return

  if (type === 'animals') {
    player.scores.animals[field] = value
  }
  else if (type === 'terrains') {
    if (subType === 'bonus')
      player.scores.terrains[field].bonus = value
    else
      player.scores.terrains[field].base = value
  }
  else if (type === 'natureTokens') {
    player.scores.natureTokens = value
  }
}

function calculateTotal(player) {
  const animalScore = Object.values(player.scores.animals)
    .reduce((sum, score) => sum + score, 0)
  const terrainScore = Object.values(player.scores.terrains)
    .reduce((sum, scores) => sum + scores.base + scores.bonus, 0)
  return animalScore + terrainScore + player.scores.natureTokens
}

const currentValue = computed({
  get: () => {
    if (!activeInput.value)
      return 0
    const { type, field, playerId, subType } = activeInput.value
    const player = players.value.find(p => p.id === playerId)

    if (!player)
      return 0

    if (type === 'animals')
      return player.scores.animals[field]
    if (type === 'terrains')
      return subType === 'bonus' ? player.scores.terrains[field].bonus : player.scores.terrains[field].base
    if (type === 'natureTokens')
      return player.scores.natureTokens
    return 0
  },
  set: val => handleNumberInput(val),
})

const showNameDialog = ref(false)
const editingPlayer = ref(null)
const editingPlayerName = computed({
  get: () => editingPlayer.value?.name || '',
  set: (newName) => {
    if (editingPlayer.value)
      editingPlayer.value.name = newName || `플레이어 ${editingPlayer.value.id}`
  },
})

function openNameDialog(player) {
  editingPlayer.value = player
  showNameDialog.value = true
}

const showHistory = ref(false)
const histories = ref([])
const { getValue, setValue } = useIndexedDB('boardGameApp', 2)
const MAX_HISTORIES = 50

onMounted(async () => {
  try {
    const saved = await getValue('boardGameData', 'cascadiaHistories')
    if (saved?.value) {
      histories.value = saved.value
    }
  }
  catch (error) {
    console.error('Failed to load histories:', error)
  }
})

async function saveGameResult() {
  const gameResult = {
    id: Date.now(),
    timestamp: new Date(),
    scores: players.value.map(player => ({
      playerName: player.name,
      total: calculateTotal(player),
    })),
  }

  const updatedHistories = [gameResult, ...histories.value].slice(0, MAX_HISTORIES)
  histories.value = updatedHistories

  try {
    await setValue('boardGameData', 'cascadiaHistories', updatedHistories)
    ElMessage.success('게임 결과가 저장되었습니다.')
  }
  catch (error) {
    console.error('Failed to save game result:', error)
    ElMessage.error('저장에 실패했습니다.')
  }
}
</script>

<template>
  <div>
    <el-page-header class="ml-4 mt-2" @back="() => $router.push('/')">
      <template #content>
        <span class="text-large font-bold">카스카디아 점수 계산기</span>
      </template>
    </el-page-header>

    <div class="mx-auto max-w-7xl p-5">
      <el-card class="score-card">
        <template #header>
          <div class="grid grid-cols-[minmax(100px,1fr)_repeat(4,1fr)] items-center gap-4">
            <div />
            <div
              v-for="player in players"
              :key="player.id"
              class="text-center"
            >
              <div
                class="cursor-pointer rounded px-2 py-1 font-bold hover:bg-gray-100"
                @click="openNameDialog(player)"
              >
                {{ player.name }}
              </div>
            </div>
          </div>
        </template>

        <div class="flex flex-col">
          <h3 class="my-5 text-gray-600 font-semibold">
            동물 점수
          </h3>
          <div v-for="(animal, key) in ANIMALS" :key="key" class="grid grid-cols-[minmax(100px,1fr)_repeat(4,1fr)] items-center gap-4 border-b border-gray-200 py-2.5 last:border-b-0">
            <div class="flex items-center">
              <div
                class="mr-2.5 h-10 w-10 flex items-center justify-center rounded-full text-white font-bold"
                :style="{ backgroundColor: animal.color }"
              >
                {{ animal.name }}
              </div>
            </div>
            <div v-for="player in players" :key="player.id" class="text-center">
              <div
                class="inline-block min-w-[60px] cursor-pointer border border-gray-300 rounded bg-gray-50 px-3 py-2 text-center hover:border-blue-500"
                @click="openNumberPad('animals', key.toLowerCase(), player.id)"
              >
                {{ player.scores.animals[key.toLowerCase()] }}
              </div>
            </div>
          </div>

          <h3 class="my-5 text-gray-600 font-semibold">
            지형 점수
          </h3>
          <div v-for="(terrain, key) in TERRAINS" :key="key" class="grid grid-cols-[minmax(100px,1fr)_repeat(4,1fr)] items-center gap-4 border-b border-gray-200 py-2.5 last:border-b-0">
            <div class="flex items-center">
              <div
                class="mr-2.5 h-10 w-10 flex items-center justify-center rounded-full text-white font-bold"
                :style="{ backgroundColor: terrain.color }"
              >
                {{ terrain.name }}
              </div>
            </div>
            <div v-for="player in players" :key="player.id" class="text-center">
              <div class="flex items-center justify-center gap-1">
                <div
                  class="inline-block min-w-[60px] cursor-pointer border border-gray-300 rounded bg-gray-50 px-3 py-2 text-center hover:border-blue-500"
                  @click="openNumberPad('terrains', key.toLowerCase(), player.id)"
                >
                  {{ player.scores.terrains[key.toLowerCase()].base }}
                </div>
                <div v-if="terrain.hasBonus" class="flex items-center">
                  <span class="mx-1 text-gray-400">+</span>
                  <div
                    class="inline-block min-w-[40px] cursor-pointer border border-gray-300 rounded bg-gray-50 px-2 py-2 text-center hover:border-blue-500"
                    @click="openNumberPad('terrains', key.toLowerCase(), player.id, 'bonus')"
                  >
                    {{ player.scores.terrains[key.toLowerCase()].bonus }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-[minmax(100px,1fr)_repeat(4,1fr)] items-center gap-4 border-b border-gray-200 py-2.5">
            <div class="flex items-center">
              <div class="text-gray-600 font-bold">
                솔방울
              </div>
            </div>
            <div v-for="player in players" :key="player.id" class="text-center">
              <div
                class="inline-block min-w-[60px] cursor-pointer border border-gray-300 rounded bg-gray-50 px-3 py-2 text-center hover:border-blue-500"
                @click="openNumberPad('natureTokens', null, player.id)"
              >
                {{ player.scores.natureTokens }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-[minmax(100px,1fr)_repeat(4,1fr)] mt-5 items-center gap-4 border-t-2 border-gray-300 py-2.5">
            <div class="flex items-center">
              <div class="text-gray-600 font-bold">
                총점
              </div>
            </div>
            <div v-for="player in players" :key="player.id" class="text-center">
              <div class="text-lg text-blue-500 font-bold">
                {{ calculateTotal(player) }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <el-button
            type="primary"
            class="flex-[3]"
            @click="saveGameResult"
          >
            <div i-carbon-save class="mr-1" />
            내용 저장
          </el-button>
          <el-button
            class="flex-1"
            @click="showHistory = true"
          >
            <div i-carbon-document class="h-5 w-5" />
          </el-button>
        </div>
      </el-card>
    </div>

    <tools-number-pad
      v-model="currentValue"
      v-model:visible="showNumberPad"
      :title="activeInput ? '점수 입력' : ''"
    />

    <PlayerNameEditor
      v-model="showNameDialog"
      v-model:player-name="editingPlayerName"
    />

    <CascadiaHistoryViewer
      :histories="histories"
      :visible="showHistory"
      @close="showHistory = false"
    />
  </div>
</template>
