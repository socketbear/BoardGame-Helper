<script setup lang="ts">
import gsap from 'gsap'

const counter = ref<HTMLDListElement>()
const counter2 = ref(6000)

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
    <tools-count-number v-model="counter2" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
</route>
