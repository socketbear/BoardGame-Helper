<script setup lang="ts">
const emit = defineEmits(['update'])
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
    text: 'C',
    action: 'set',
    value: ['return 0'],
  },
  {
    text: '/',
    action: 'acc',
  },
  {
    text: '*',
    action: 'acc',
  },
  {
    text: '-',
    action: 'acc',
  },
  {
    text: '7',
    action: 'set',
    value: ['n', 'return n * 10 + 7'],
  },
  {
    text: '8',
    action: 'set',
    value: ['n', 'return n * 10 + 8'],
  },
  {
    text: '9',
    action: 'set',
    value: ['n', 'return n * 10 + 9'],
  },
  {
    text: '+',
    action: 'acc',
    span: 'row-span-2',
  },
  {
    text: '4',
    action: 'set',
    value: ['n', 'return n * 10 + 4'],
  },
  {
    text: '5',
    action: 'set',
    value: ['n', 'return n * 10 + 5'],
  },
  {
    text: '6',
    action: 'set',
    value: ['n', 'return n * 10 + 6'],
  },
  {
    text: '1',
    action: 'set',
    value: ['n', 'return n * 10 + 1'],
  },
  {
    text: '2',
    action: 'set',
    value: ['n', 'return n * 10 + 2'],
  },
  {
    text: '3',
    action: 'set',
    value: ['n', 'return n * 10 + 3'],
  },
  {
    text: '=',
    action: 'done',
    span: 'row-span-2',
  },
  {
    text: '0',
    action: 'set',
    value: ['n', 'return n * 10'],
  },
  {
    text: '00',
    action: 'set',
    value: ['n', 'return n * 100'],
  },
  {
    text: '000',
    action: 'set',
    value: ['n', 'return n * 1000'],
  },
]

function clickKeyPad(k: keyType) {
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
    emit('update', printNumber.value)
    if (accStrings.value.length === 0)
      return
    accStrings.value.push(printNumber.value.toString())
    // eslint-disable-next-line no-new-func
    const retNum = new Function(`return ${accStrings.value.join('')}`)()
    printNumber.value = retNum
    accStrings.value = []
  }
}

function getNum() {
  clickKeyPad({ text: '=', action: 'done' })
  return printNumber.value
}

defineExpose({ getNum })
</script>

<template>
  <div class="mx-auto max-w-[400px] w-full">
    <div class="mx-auto max-w-md rounded-xl bg-white p-4 shadow-lg">
      <div class="grid grid-cols-4 gap-3">
        <!-- 디스플레이 영역 -->
        <div class="col-span-4 mb-3 rounded-lg bg-gray-100 p-3">
          <div class="my-1 text-right text-sm text-gray-500">
            {{ `${accStrings.join(' ')}` }}
          </div>
          <div class="text-right text-2xl text-gray-800 font-semibold">
            {{ printNumber.toLocaleString() }}
          </div>
        </div>

        <!-- 키패드 영역 -->
        <template v-for="k in keyArray" :key="`key-type-${k.text}`">
          <div
            class="flex cursor-pointer items-center justify-center rounded-lg py-3 text-xl font-medium transition-colors duration-150 active:scale-95"
            :class="[
              k.span,
              k.text === '=' ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : ['/', '*', '-', '+'].includes(k.text) ? 'bg-gray-200 hover:bg-gray-300'
                : k.text === 'C' ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200',
            ]"
            @click="clickKeyPad(k)"
          >
            {{ k.text }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
