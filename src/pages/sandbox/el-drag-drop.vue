<script setup lang="ts">
import type { IPopupState, avatar } from '~/types'
import Calculator from '~/components/tools/Calculator.vue'
import { useSound } from '@vueuse/sound'
import cashResiterSfx from '/assets/sounds/cash-register.mp3'
const calc = ref<InstanceType<typeof Calculator>>()

const boxData: avatar[] = reactive([
  { id: 'A', name: '아빠', budget: 0, unit: '₩' },
  { id: 'B', name: '아들', budget: 0, unit: '₩' },
  { id: 'C', name: '기부금', budget: 0, unit: '₩' },
])

const calcState: IPopupState = reactive({
  show: false,
  state: '', // add, transfer
  title: '',
})

const { play: playCashSfx } = useSound(cashResiterSfx)

const dropped = (from: string, to: string) => {
  setTimeout(() => {
    const fromAvatar = boxData.find(b => b.id === from)
    const toAvatar = boxData.find(b => b.id === to)
    calcState.state = 'transfer'
    if (fromAvatar && toAvatar) {
      calcState.title = `${fromAvatar.name} -> ${toAvatar.name}`
      calcState.from = fromAvatar
      calcState.to = toAvatar
      calcState.show = true
    }
  }, 100)
}

const addMoney = (targetedAvatar: avatar) => {
  calcState.state = 'add'
  calcState.to = targetedAvatar
  calcState.title = targetedAvatar.name
  calcState.show = true
}

const calcPop = ref<HTMLElement | null>(null)
// const { x, y, style } = useDraggable(calcPop, {
const { style } = useDraggable(calcPop, {
  initialValue: { x: 40, y: 40 },
})

const closeCalcPop = () => {
  calcState.show = false
}

const doneUseCalc = () => {
  if (calcState.to && calc.value) {
    if (calcState.state === 'add') {
      calcState.to.budget += calc.value.getNum()
    }
    else if (calcState.state === 'transfer' && calcState.from) {
      // 금액을 전달
      const transMoney = calc.value.getNum()
      calcState.from.budget -= transMoney
      calcState.to.budget += transMoney
    }
  }
  playCashSfx()
  calcState.show = false
}
</script>

<template>
  <div class="flex w-128 h-128">
    <drag-box v-for="b in boxData" :key="`box-${b.id}`" :box-data="b" @dropped="dropped" @click="addMoney(b)">
      <div class="text-xl font-bold">
        {{ b.name }}
      </div>
      <div class="flex justify-end w-full pr-2 pt-8">
        <span class="mr-1">{{ `${b.unit}` }}</span>
        <tools-count-number v-model="b.budget" />
      </div>
    </drag-box>
  </div>
  <div v-if="calcState.show" ref="calcPop" :style="style" style="position: fixed" class="bg-slate-100">
    <div class="flex">
      <h2 class="my-1 text-xl font-bold flex-1">
        {{ calcState.title }}
      </h2>
      <div class="m-1 border-1 rounded cursor-pointer hover:bg-slate-400 active:bg-slate-600 active:text-white" @click="closeCalcPop">
        <p class="mx-2">
          X
        </p>
      </div>
    </div>
    <div class="w-64">
      <Calculator ref="calc" />
    </div>
    <button class="btn w-full mt-2 h-12" @click="doneUseCalc">
      Done
    </button>
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
</route>
