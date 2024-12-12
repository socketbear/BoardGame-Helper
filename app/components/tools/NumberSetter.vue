<script setup lang="ts">
import { useSound } from '@vueuse/sound'
import Calculator from '~/components/tools/Calculator.vue'
import cashResiterSfx from '/assets/sounds/cash-register.mp3'

const props = defineProps<{
  budget?: number
}>()
const emit = defineEmits(['change'])
const calc = ref<InstanceType<typeof Calculator>>()
const amount = ref(0)
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

function showCalc() {
  calcState.show = true
}

function closeCalcPop() {
  calcState.show = false
}

function doneUseCalc() {
  if (calc.value)
    amount.value = calc.value.getNum()

  emit('change', amount.value)

  playCashSfx()
  closeCalcPop()
}
</script>

<template>
  <div>
    <div class="h-12 w-48 flex cursor-pointer items-center justify-end rounded-lg bg-gray-100 pr-4 shadow-sm transition-colors hover:bg-gray-200" @click="showCalc">
      <tools-financial-statement-currency :amount="amount" />
    </div>
    <div
      v-if="calcState.show"
      ref="calcPop"
      :style="style"
      class="fixed z-[9999] border border-gray-200 rounded-lg bg-white shadow-lg"
    >
      <div class="flex items-center border-b border-gray-200 px-4 py-2">
        <h2 class="text-lg text-gray-800 font-semibold">
          {{ calcState.title }}
        </h2>
        <button
          class="ml-auto rounded-full p-1 transition-colors hover:bg-gray-100"
          @click="closeCalcPop"
        >
          <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="w-80 p-4">
        <Calculator ref="calc" />
      </div>
      <div class="px-4 pb-4">
        <button
          class="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          @click="doneUseCalc"
        >
          완료
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed {
  position: fixed;
}
</style>
