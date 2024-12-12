<script setup lang="ts">
import gsap from 'gsap'

const props = defineProps({
  modelValue: { type: Number, required: true },
})
const appliedValue = ref(0)
const counter = ref<HTMLParagraphElement>()
const applied = ref<HTMLParagraphElement>()
const showApplied = ref(false)
const countNumber = { val: 0 }

onMounted(() => {
  let tween: gsap.core.Tween
  if (applied.value) {
    tween = gsap.fromTo(applied.value, {
      y: 10,
      opacity: 0,
    }, {
      y: -40,
      opacity: 1,
      duration: 1,
      ease: 'power1.out',
      onComplete() {
        showApplied.value = false
      },
    })
  }
  const animateNumber = useThrottleFn(() => {
    appliedValue.value = props.modelValue - countNumber.val
    gsap.to(countNumber, {
      duration: 1,
      val: props.modelValue,
      onUpdate() {
        if (counter.value)
          counter.value.innerHTML = Math.floor(countNumber.val).toLocaleString()
      },
    })
    if (applied.value) {
      showApplied.value = true
      tween.restart()
    }
  }, 100)
  watchEffect(() => {
    animateNumber()
  })
})
// const num = ref(0)
</script>

<template>
  <div class="relative">
    <p ref="counter" class="animate-count" />
    <p
      v-show="showApplied"
      ref="applied"
      class="absolute left-0 top-0 w-full"
      :class="{ 'text-red-600': appliedValue < 0, 'text-green-600': appliedValue > 0 }"
    >
      {{ appliedValue }}
    </p>
  </div>
</template>
