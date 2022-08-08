<template>
  <div id="dice-box" class="w-64 h-64 b-1" @click="reRoll"></div>
</template>

<script setup lang="ts">
import DiceBox from "@3d-dice/dice-box";
let diceBox;
onMounted(() => {
  diceBox = new DiceBox("#dice-box", {
    assetPath: "/assets/dice-box/", // required
  });
  diceBox.init().then(() => {
    diceBox.onRollComplete = (rollResult) => console.log('roll results', rollResult)
    diceBox.roll("2d6");
  });

});
const reRoll = () => {
  diceBox.roll('2d6')
}
</script>

<style scoped>
#dice-box::v-deep canvas {
  width: 100%;
  height: 100%;
}
</style>
