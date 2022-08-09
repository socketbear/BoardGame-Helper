<script setup>
import { useDrag } from '@vueuse/gesture'
import { useSpring } from '@vueuse/motion'

const joystick = ref()

const { set } = useSpring(joystick, {
  damping: 50,
  stiffness: 1000,
})

// Find more about `set()` on the "Motion Integration" page
useDrag(
  ({ movement: [x, y], dragging }) => {
    console.log('drag :>>>', dragging, x, y)
    // if (!dragging) {
    //   set({
    //     cursor: 'grab',
    //     x: 0,
    //     y: 0,
    //   })
    //   return
    // }
    // set({
    //   cursor: 'grabbing',
    //   x,
    //   y,
    // })
  },
  {
    domTarget: joystick,
  },
)
</script>

<template>
  <!-- Directive usage -->
  <div class="w-128 h-128">
    <!-- <div ref="joystick" class="w-12 h-12 bg-zinc-400">
      TEST
    </div> -->
    <div
      ref="joystick"
      class="w-32 h-32 bg-blue-400 rounded-lg border-4 border-blue-600 cursor-grab"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
</route>
