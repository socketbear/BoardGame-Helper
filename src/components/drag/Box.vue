<script setup lang="ts">
import type { PropType } from 'vue'
// https://interactjs.io/docs/
import interact from 'interactjs'
interface BoxData {
  id: string
}

const props = defineProps({
  boxData: { type: Object as PropType<BoxData>, required: true },
})

const emit = defineEmits<{
  (event: 'dropped', from: string, to: string): void
}>()

const position = { x: 0, y: 0 }

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
    class="w-32 h-32 bg-blue-400 rounded-lg border-4 border-blue-600 touch-none select-none"
    :class="`${props.boxData.id}-draggable`" :data-id="props.boxData.id"
  >
    <slot />
  </div>
</template>
