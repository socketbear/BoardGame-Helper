<script setup lang="ts">
import { useBoardData } from '~/composables/data'
const { info } = useLogger()
const countNumber = ref(0)
const setterNumber = ref(0)
const unitStore = useUnitStore()
import { BOARD_GAME } from '~/types/RichEnums'
const boardData = await useBoardData(BOARD_GAME.RICH)

function handleUnitSelect(unit: string) {
  info('선택된 단위:', unit)
  unitStore.setUnit(unit)
}

function handleColorSelect(color: string) {
  info('선택된 색상:', color)
}

function handleCalculatorUpdate(value: number) {
  info('계산기 결과:', value)
  countNumber.value = value
}

function handleSetterUpdate(value: number) {
  info('숫자 설정값:', value)
  setterNumber.value = value
}

const treeValue = ref('')
</script>

<template>
  <div class="p-4 sandbox">
    <h2 class="mb-4 text-xl font-bold">
      단위 선택기 데모
    </h2>
    <tools-unit-selector @select="handleUnitSelect" />
    <tools-color-selector @select="handleColorSelect" />
    <tools-count-number v-model="countNumber" />
    <tools-calculator @update="handleCalculatorUpdate" />
    <tools-number-setter
      v-model="setterNumber"
      @update="handleSetterUpdate"
    />
    <el-tree-select
      v-model="treeValue"
      :data="boardData!.typeList"
      :props="{
        value: 'id',
        label: 'name'
      }"
      :render-after-expand="false"
      clearable
      placeholder="선택해주세요"
    />
  </div>
</template>

<style scoped>
.sandbox {
  --el-tree-node-content-height: 40px;
}
</style>
