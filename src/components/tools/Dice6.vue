<script setup lang="ts">
import gsap from 'gsap'
import random from 'lodash/random.js'
import { useSound } from '@vueuse/sound'
import diceSfx from '/assets/sounds/dice.mp3'
const props = defineProps({
  modelValue: { type: Number, required: true },
  useColor: { type: Boolean, required: false, default: true },
})
const { play: playDiceSfx } = useSound(diceSfx)
const dice = ref<HTMLDListElement>()
const diceValue = ref(props.modelValue)
const colors: string[] = ['red', 'blue', 'green', 'orange', 'amber', 'yellow', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'pink', 'rose']
const colorClass = ref('')

const changeDiceColor = () => {
  if (!props.useColor)
    return
  const randomedColor = colors[random(colors.length - 1)]
  colorClass.value = `bg-${randomedColor}-400 border-${randomedColor}-600`
}

changeDiceColor()

let tween: gsap.core.Tween
const roll = () => {
  playDiceSfx()
  if (dice.value && !tween) {
    tween = gsap.to(dice.value, {
      keyframes: [{
        duration: 0.5,
        rotation: 180,
        onComplete: () => {
          changeDiceColor()
          diceValue.value = random(1, 6)
        },
      }, {
        duration: 0.5,
        rotation: 360,
      }],
      paused: true,
    })
  }
  else if (tween) {
    tween.restart()
  }
}
onBeforeUnmount(() => {
  if (tween)
    tween.kill()
})

// roll function expose
defineExpose({ roll })
</script>

<template>
  <div ref="dice" class="flex items-center justify-center w-12 h-12 border-2 rounded-md text-xl font-bold" :class="colorClass" @click="roll">
    {{ diceValue }}
  </div>
</template>
