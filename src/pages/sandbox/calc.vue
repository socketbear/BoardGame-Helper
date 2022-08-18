<script setup lang="ts">
import Calculator from '~/components/tools/Calculator.vue'
// component type 지정
const calc = ref<InstanceType<typeof Calculator>>()
const getNumInCalc = () => {
  // child component에서 expose 된 항목이 있으면 이를 ref를 통해 사용 가능
  // eslint-disable-next-line no-console
  console.log('get :>>>', calc.value?.getNum())
}
</script>

<template>
  <div class="w-128 bg-slate-200">
    <Calculator ref="calc" />
    <button class="btn mt-2" @click="getNumInCalc">
      Done
    </button>
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
</route>
