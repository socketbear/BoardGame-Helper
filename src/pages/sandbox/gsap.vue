<script setup lang="ts">
import gsap from 'gsap'

const counter = ref<HTMLDListElement>()

onMounted(() => {
  const zero = { val: 5000 }
  gsap.to(zero, {
    duration: 1,
    val: 10000,
    onUpdate() {
      if (counter.value)
        counter.value.innerHTML = Math.floor(zero.val).toLocaleString()
    },
  })
})
</script>

<template>
  <div>
    GSAP
    <div ref="counter" class="animate-num">
      5000
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
</route>
