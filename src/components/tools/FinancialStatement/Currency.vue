<script setup lang="ts">
import { UNIT_POSITION } from '~/enums'
const { amount } = defineProps<{ amount: number }>()
const unit = useUnitStore()
</script>

<template>
  <p>
    <span v-if="unit.currency.unitPosition === UNIT_POSITION.FRONT" class="mr-1">{{ unit.currency.unit }}</span>
    {{ amount.toLocaleString() }}
    <span v-if="unit.currency.unitPosition === UNIT_POSITION.BACK" class="ml-1" />{{ unit.currency.unit }}
  </p>
</template>
