<script setup lang="ts">
import { BOARD_GAME } from '~/enums'
const unit = useUnitStore()

const boardData = await useBoardData(BOARD_GAME.RICH)
if (boardData)
  unit.setUnit(boardData.unit, boardData.unitPosition)
</script>

<template>
  <div>
    <p class="text-2xl">
      Drag n Drop (use vue.draggable)!
    </p>
    <tools-financial-statement-main v-if="boardData" title="AAAA" :type-list="boardData.typeList" financial-id="AAAA" />
  </div>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: board
</route>
