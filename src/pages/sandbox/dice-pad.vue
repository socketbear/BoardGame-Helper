<script setup lang="ts">
import Dice6 from '~/components/tools/Dice6.vue'
const dices = ref([ref(1), ref(1)])

let diceRefs: InstanceType<typeof Dice6>[] = []
const setDiceRef = (el: InstanceType<typeof Dice6> | undefined) => {
  if (el)
    diceRefs.push(el)
}
onBeforeUpdate(() => {
  diceRefs = []
})

const roll = () => {
  for (const dice of diceRefs) {
    if (dice)
      dice.roll()
  }
}
</script>

<template>
  <Dice6 v-for="(d, idx) in dices" :key="`tool-dice-${idx}`" :ref="setDiceRef" v-model="d.value" />
  <button class="btn" @click="roll">
    GO
  </button>
</template>

<style scoped>
/* #dice-box::v-deep canvas {
  width: 100%;
  height: 100%;
} */
</style>

<route lang="yaml">
meta:
  layout: board
</route>
