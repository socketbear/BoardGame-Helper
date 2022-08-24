<script setup lang="ts">
// import DiceBox from '@3d-dice/dice-box'
// import { useSound } from '@vueuse/sound'
// import diceSfx from '/assets/sounds/dice.mp3'

// const { play: playDiceSfx } = useSound(diceSfx)

// let diceBox
// onMounted(() => {
//   diceBox = new DiceBox('#dice-box', {
//     assetPath: '/assets/dice-box/', // required
//   })
//   diceBox.init().then(() => {
//     diceBox.onRollComplete = rollResult => console.log('roll results', rollResult)
//     playDiceSfx()
//     diceBox.roll('2d6')
//   })
// })
// const reRoll = () => {
//   playDiceSfx()
//   diceBox.roll('2d6')
// }
</script>

<template>
  dice-page
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
