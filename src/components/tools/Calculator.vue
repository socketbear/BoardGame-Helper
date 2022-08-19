<script setup lang="ts">
import type { Ref } from 'vue'

const printNumber = ref(0)
const accStrings: Ref<string[]> = ref([])
interface keyType {
  text: string
  action: string
  value?: string[]
  span?: string
}

const keyArray: keyType[] = [
  {
    text: 'C', action: 'set', value: ['return 0'],
  },
  {
    text: '/', action: 'acc',
  },
  {
    text: '*', action: 'acc',
  },
  {
    text: '-', action: 'acc',
  },
  {
    text: '7', action: 'set', value: ['n', 'return n * 10 + 7'],
  },
  {
    text: '8', action: 'set', value: ['n', 'return n * 10 + 8'],
  },
  {
    text: '9', action: 'set', value: ['n', 'return n * 10 + 9'],
  },
  {
    text: '+', action: 'acc', span: 'row-span-2',
  },
  {
    text: '4', action: 'set', value: ['n', 'return n * 10 + 4'],
  },
  {
    text: '5', action: 'set', value: ['n', 'return n * 10 + 5'],
  },
  {
    text: '6', action: 'set', value: ['n', 'return n * 10 + 6'],
  },
  {
    text: '1', action: 'set', value: ['n', 'return n * 10 + 1'],
  },
  {
    text: '2', action: 'set', value: ['n', 'return n * 10 + 2'],
  },
  {
    text: '3', action: 'set', value: ['n', 'return n * 10 + 3'],
  },
  {
    text: '=', action: 'done', span: 'row-span-2',
  },
  {
    text: '0', action: 'set', value: ['n', 'return n * 10'],
  },
  {
    text: '00', action: 'set', value: ['n', 'return n * 100'],
  },
  {
    text: '000', action: 'set', value: ['n', 'return n * 1000'],
  },
]

const clickKeyPad = (k: keyType) => {
  if (k.action === 'set') {
    if (k.value) {
      // set 기능 시, new Function 기능을 통해 처리
      // eslint-disable-next-line no-new-func
      const retNum = new Function(...k.value)(printNumber.value)
      printNumber.value = retNum
    }
  }
  else if (k.action === 'acc') {
    accStrings.value.push(printNumber.value.toString())
    accStrings.value.push(k.text)
    printNumber.value = 0
  }
  else if (k.action === 'done') {
    if (accStrings.value.length === 0)
      return
    accStrings.value.push(printNumber.value.toString())
    // eslint-disable-next-line no-new-func
    const retNum = new Function(`return ${accStrings.value.join('')}`)()
    printNumber.value = retNum
    accStrings.value = []
  }
}

const getNum = () => {
  return printNumber.value
}

defineExpose({ getNum })
</script>

<template>
  <div class="grid grid-cols-4 grid-rows-6 gap-2">
    <div class="col-span-4 calc-border">
      <div class="text-slate-400 text-sm text-right my-1 mr-2 h-4">
        {{ `${accStrings.join(' ')}` }}
      </div>
      <div class="text-xl text-right mr-2 mb-1">
        {{ printNumber.toLocaleString() }}
      </div>
    </div>
    <div
      v-for="k in keyArray" :key="`key-type-${k.text}`"
      class="calc-border text-xl flex items-center justify-center hover:bg-slate-400 active:bg-slate-700 active:text-white hover:cursor-pointer"
      :class="k.span"
      @click="clickKeyPad(k)"
    >
      {{ k.text }}
    </div>
  </div>
</template>

<style>
</style>
