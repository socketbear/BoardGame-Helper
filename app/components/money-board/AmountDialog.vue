<script setup lang="ts">
import Calculator from '~/components/tools/Calculator.vue'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  confirm: [amount: number]
}>()

const open = defineModel<boolean>('open', { required: true })

const calc = ref<InstanceType<typeof Calculator>>()

function confirm() {
  if (calc.value)
    emit('confirm', calc.value.getNum())

  open.value = false
}
</script>

<template>
  <el-dialog v-model="open" :title="title" width="min(22rem, 92vw)" destroy-on-close append-to-body>
    <Calculator ref="calc" />
    <template #footer>
      <el-button type="primary" class="w-full" @click="confirm">
        확인
      </el-button>
    </template>
  </el-dialog>
</template>
