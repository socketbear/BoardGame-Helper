<script setup>
const demo = ref()

// Find more about `set()` on the "Motion Integration" page

const dragHandler = ({ movement: [x, y], dragging }) => {
  console.log('x :>> ', x)
  console.log('y :>> ', y)
  // if (!dragging) {
  //   set({ x: 0, y: 0, cursor: 'grab' })
  //   return
  // }

  // set({
  //   cursor: 'grabbing',
  //   x,
  //   y,
  // })
}

// Composable usage
// useDrag(dragHandler, {
//   domTarget: demo,
// })
</script>

<template>
  <!-- Directive usage -->
  <div class="w-128 h-128">
    <div ref="demo" v-drag="dragHandler" class="w-12 h-12 bg-zinc-400">
      TEST
    </div>
  </div>
</template>
