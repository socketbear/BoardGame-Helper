<script setup lang="ts">
import gsap from 'gsap'
import throttle from 'lodash/throttle'
const props = defineProps({
  modelValue: { type: Number, required: true },
})
const counter = ref<HTMLParagraphElement>()
const countNumber = { val: 0 }
const animateNumber = throttle(() => {
  gsap.to(countNumber, {
    duration: 1,
    val: props.modelValue,
    onUpdate() {
      if (counter.value)
        counter.value.innerHTML = Math.floor(countNumber.val).toLocaleString()
    },
  })
}, 100)
watchEffect(() => {
  animateNumber()
})
// const num = ref(0)
</script>

<template>
  <p ref="counter" class="animate-count" />
</template>
