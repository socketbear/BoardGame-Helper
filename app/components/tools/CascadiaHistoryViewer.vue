<script setup>
defineProps({
  histories: {
    type: Array,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['close'])
</script>

<template>
  <el-dialog
    title="게임 기록"
    :model-value="visible"
    @close="$emit('close')"
  >
    <div class="max-h-[60vh] overflow-y-auto">
      <div v-for="history in histories" :key="history.id" class="mb-4 border rounded-lg p-4">
        <div class="text-gray-500">
          {{ new Date(history.timestamp).toLocaleString() }}
        </div>
        <div class="grid grid-cols-2 mt-2 gap-4">
          <div v-for="score in history.scores" :key="score.playerName" class="rounded bg-gray-50 p-2">
            <div class="font-bold">
              {{ score.playerName }}
            </div>
            <div class="mt-1 text-right text-lg text-blue-500 font-bold">
              {{ score.total }}점
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
