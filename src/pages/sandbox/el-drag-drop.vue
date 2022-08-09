<script setup lang="ts">
// import interact from 'interactjs'
// const position = { x: 0, y: 0 }

// onMounted(() => {
//   interact('.draggable').draggable({
//     listeners: {
//       move(event) {
//         position.x += event.dx
//         position.y += event.dy

//         event.target.style.transform
//         = `translate(${position.x}px, ${position.y}px)`
//       },
//     },
//   })
// })
</script>

<template>
  <div class="flex w-128 h-128">
    <!-- <div class="draggable w-32 h-32 bg-blue-400 rounded-lg border-4 border-blue-600 cursor-grab">
      A
    </div>
    <div class="draggable w-32 h-32 bg-green-400 rounded-lg border-4 border-green-600 cursor-grab">
      B
    </div>
    <div class="draggable w-32 h-32 bg-red-400 rounded-lg border-4 border-red-600 cursor-grab">
      C
    </div> -->
    <Box key="1" :box-data="{ title: 'A' }" />
    <Box key="2" :box-data="{ title: 'B' }" />
    <Box key="3" :box-data="{ title: 'C' }" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
</route>
