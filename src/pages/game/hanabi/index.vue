<script setup lang="ts">
// hanabi board game style - button control
import { ref, reactive, onMounted } from 'vue'

const deckCount = ref(5)
enum Color {
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  WHITE = 'white',
}
enum CardNumber {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
}
interface Deck {
  currentDeck: {
    number: CardNumber | '',
    color: Color | '',
  },
  incurredDeck: {
    number: CardNumber[],
    color: Color[],
  },
  count: number
}
const colors = Object.values(Color)
const numbers: CardNumber[] = [CardNumber.ONE, CardNumber.TWO, CardNumber.THREE, CardNumber.FOUR, CardNumber.FIVE]
const invertColor: Color[] = [Color.YELLOW, Color.WHITE]

const getDeckTemplate = () => (reactive<Deck>({
  currentDeck: {
    number: '',
    color: '',
  },
  incurredDeck: {
    number: [],
    color: [],
  },
  count: 0
}))

const history = ref<string[]>([])

const deckState = ref<Deck[]>([])

const initDeck = () => {
  deckState.value = []
  for (let i = 0; i < deckCount.value; i++) {
    deckState.value.push(getDeckTemplate())
  }
}
const reset = () => {
  initDeck()
}
const redo = () => {
  console.log('redo')
}

const resetLine = (deck) => {
  deck.currentDeck.number = ''
  deck.currentDeck.color = ''
  deck.incurredDeck.number = []
  deck.incurredDeck.color = []
  deck.count = 0
}

const incrCount = (deck) => {
  deck.count = deck.count + 1
}

onMounted(() => {
  initDeck()
})
</script>

<template>
  <div class="text-xl">Button Control Sandbox</div>
  <div class="flex flex-col gap-8">
    <div class="flex items-center gap-4">
      <p>Decks<span class="color-red">*</span></p>
      <el-input-number v-model="deckCount" :min="3" :max="5" />
    </div>
    <div class="flex items-center gap-4">
      <p>State Control</p>
      <div class="flex">
        <el-button type="primary" @click="reset">Reset</el-button>
        <el-button type="primary" @click="redo">Redo</el-button>
      </div>
    </div>
    <div class="flex flex-col gap-8" v-for="(deck, deckIndex) in deckState">
      <div class="deck flex items-center gap-4">
        <p>{{ deckIndex + 1 }} 🂠</p>
        <div class="flex flex-col h-22 items-center justify-between">
          <p class="p-1" :class="{'invert-bg': invertColor.includes(deck.currentDeck.color)}" :style="{color: deck.currentDeck.color}">{{ deck.currentDeck.number }} <span>{{ deck.currentDeck.color }}</span></p>
          <el-button @click="resetLine(deck)">Reset</el-button>
        </div>
        <div class="flex flex-col gap-2">
          <div v-if="!deckIndex">정답지</div>
          <el-radio-group v-model="deck.currentDeck.color" size="large" @change="incrCount(deck)">
            <el-radio-button v-for="color in Object.values(Color)" :value="color" :disabled="deck.incurredDeck.color.includes(color)">
              <div :style="{ color }" class="w-10 h-10 flex items-center justify-center font-bold">{{ color }}
              </div>
            </el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="deck.currentDeck.number" size="large" @change="incrCount(deck)">
            <el-radio-button v-for="number in numbers" :value="number" :disabled="deck.incurredDeck.number.includes(number)">
              <div class="w-10 h-10 text-xl flex items-center justify-center">{{ number }}</div>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="flex flex-col gap-2">
          <div v-if="!deckIndex">오답지</div>
          <el-checkbox-group v-model="deck.incurredDeck.color" size="large" @change="incrCount(deck)">
            <el-checkbox-button v-for="color in Object.keys(Color)" :value="Color[color]">
              <div :style="{ color: Color[color] }" class="w-10 h-10 flex items-center justify-center font-bold">{{ Color[color] }}
              </div>
            </el-checkbox-button>
          </el-checkbox-group>
          <el-checkbox-group v-model="deck.incurredDeck.number" size="large" @change="incrCount(deck)">
            <el-checkbox-button v-for="number in numbers" :value="number">
              <div class="w-10 h-10 text-xl flex items-center justify-center">{{ number }}</div>
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div>Play<p>{{ deck.count }}</p></div>
      </div>
    </div>
  </div>
</template>

<style scoped>

:deep(.el-radio-button) {
  --el-button-disabled-bg-color: #f0f0f0;
}

:deep(.el-checkbox-button) {
  --el-button-disabled-bg-color: #f0f0f0;
}

.deck {
  .invert-bg {
    background-color: gray;
  }
}
</style>