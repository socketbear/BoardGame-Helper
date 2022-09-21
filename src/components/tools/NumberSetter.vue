<script setup lang="ts">
import Calculator from '~/components/tools/Calculator.vue'
import { useSound } from '@vueuse/sound'
import cashResiterSfx from '/assets/sounds/cash-register.mp3'

const props = defineProps<{
  budget?: number
}>()
const emit = defineEmits(['change'])
const calc = ref<InstanceType<typeof Calculator>>()
const amount = ref<number>(0)
if (props.budget)
  amount.value = props.budget

const calcState = reactive({
  show: false,
  state: '', // add, transfer
  title: '',
})
const calcPop = ref<HTMLElement | null>(null)
const { style } = useDraggable(calcPop, {
  initialValue: { x: 40, y: 40 },
})

const { play: playCashSfx } = useSound(cashResiterSfx)

const showCalc = () => {
  calcState.show = true
}

const closeCalcPop = () => {
  calcState.show = false
}

const doneUseCalc = () => {
  if (calc.value)
    amount.value = calc.value.getNum()

  emit('change', amount.value)

  playCashSfx()
  closeCalcPop()
}
</script>

<template>
  <div>
    <div class="w-48 h-12 bg-gray-200 flex items-center justify-end pr-4" @click="showCalc">
      <tools-financial-statement-currency :amount="amount" />
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
  </div>
</template>
