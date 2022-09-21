<script setup lang="ts">
import type { PropType } from 'vue'
import interact from 'interactjs'
import type { avatar } from '~/types'
// https://interactjs.io/docs/

const props = defineProps({
  boxData: { type: Object as PropType<avatar>, required: true },
})

const emit = defineEmits<{
  (event: 'dropped', from: string, to: string): void
}>()

const position = { x: 0, y: 0 }

const boxStyle = computed(() => {
  // props.boxData.color 문자열 내 gray가 있으면 true
  const isGray = props.boxData.color?.includes('gray')
  // borderColor 상수 값에 props.boxData.color 값의 앞의 bg를 제거하고, border로 변경하고 뒤 숫자를 제거하고 600으로 변경
  const borderColor = props.boxData.color?.replace('bg-', 'border-').replace(/-[0-9]{3}/, '-600')

  if (isGray)
    return `${borderColor} ${props.boxData.color} text-white`

  else
    return `${props.boxData.color} ${borderColor}`
})

onMounted(() => {
  // drag 가능하게 구성
  interact(`.${props.boxData.id}-draggable`).draggable({
    listeners: {
      move(event) {
        position.x += event.dx
        position.y += event.dy

        event.target.style.transform
        = `translate(${position.x}px, ${position.y}px)`
      },
      end(event) {
        position.x = 0
        position.y = 0
        event.target.style.transform
        = `translate(${position.x}px, ${position.y}px)`
      },
    },
  })

  // drop 가능하게 구성
  interact(`.${props.boxData.id}-draggable`).dropzone({
    ondrop(event) {
      const from = event.relatedTarget.getAttribute('data-id')
      const to = event.target.getAttribute('data-id')
      // console.log('drop event :>>>', event, `from[${from}] -> to[${to}]`)
      emit('dropped', from, to)
    },
  })
})

onBeforeUnmount(() => {
  // interact(`.${props.boxData.title}-draggable`).off(['draggable', 'dropzone'])
  interact.stop()
})
</script>

<template>
  <div
    class="w-32 h-32 rounded-lg border-4 touch-none select-none"
    :class="`${props.boxData.id}-draggable ${boxStyle}`" :data-id="props.boxData.id"
  >
    <slot />
  </div>
</template>
