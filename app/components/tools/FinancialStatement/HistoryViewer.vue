<script setup lang="ts">
import type { IHistory, HistoryType } from '~/types/RichTypes'

defineProps<{
  histories: IHistory[]
  visible: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <el-dialog
    title="거래 내역"
    :model-value="visible"
    @close="$emit('close')"
  >
    <div class="max-h-[60vh] overflow-y-auto">
      <div v-for="history in histories" :key="history.id" class="mb-4 rounded-lg border p-4">
        <div class="flex justify-between">
          <span class="text-gray-500">{{ new Date(history.timestamp).toLocaleString() }}</span>
          <span class="font-bold">
            {{ 
              history.type === 'add' ? '입금' : 
              history.type === 'withdraw' ? '출금' : 
              history.type === 'transfer' ? '이체' :
              history.type === 'settlement' ? '정산' :
              ''
            }}
          </span>
        </div>
        <div class="mt-2">
          <template v-if="history.type === 'transfer'">
            {{ history.from }} → {{ history.to }}
          </template>
          <template v-else>
            {{ history.to }}
          </template>
        </div>
        <div class="mt-1 text-right text-lg font-bold" 
          :class="{
            'text-red-500': history.type === 'withdraw',
            'text-green-500': ['add', 'settlement'].includes(history.type)
          }"
        >
          {{ history.amount.toLocaleString() }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
