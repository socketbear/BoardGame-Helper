<script setup>
import { useIndexedDB } from '~/composables/useIndexedDB'

const { quickNames = ['도바킨', '아빠', '엄마', '삼촌', '친구'] } = defineProps({
  quickNames: {
    type: Array,
    default: () => ['도바킨', '아빠', '엄마', '삼촌', '친구'],
  },
})

const [visible] = defineModel('modelValue')
const [name] = defineModel('playerName')

const recentNames = ref([])
const MAX_RECENT = 5
const { getValue, setValue } = useIndexedDB('boardGameApp', 2)

// 초기 로드
onMounted(async () => {
  try {
    const saved = await getValue('boardGameData', 'recentPlayerNames')
    if (saved?.value) {
      recentNames.value = saved.value
    }
  }
  catch (error) {
    console.error('Failed to load recent names:', error)
  }
})

async function addToRecent(newName) {
  if (!newName || quickNames.includes(newName))
    return

  const updatedNames = [
    newName,
    ...recentNames.value.filter(n => n !== newName),
  ].slice(0, MAX_RECENT)

  recentNames.value = updatedNames

  try {
    await setValue('boardGameData', 'recentPlayerNames', updatedNames)
  }
  catch (error) {
    console.error('Failed to save recent names:', error)
  }
}

function handleSave() {
  if (name.value)
    addToRecent(name.value)
  visible.value = false
}

function handleClose() {
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="플레이어 이름 변경"
    width="300px"
  >
    <div class="flex flex-col gap-4">
      <el-input
        v-model="name"
        placeholder="이름을 입력하세요"
        class="w-full"
        clearable
      />

      <div class="flex flex-col gap-2">
        <div class="flex flex-wrap gap-2">
          <el-tag
            v-for="quickName in quickNames"
            :key="quickName"
            :type="name === quickName ? 'success' : 'info'"
            class="cursor-pointer"
            @click="name = quickName"
          >
            {{ quickName }}
          </el-tag>
        </div>

        <template v-if="recentNames.length > 0">
          <div class="mt-2 text-sm text-gray-500">
            최근 사용
          </div>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="recentName in recentNames"
              :key="recentName"
              :type="name === recentName ? 'success' : 'warning'"
              class="cursor-pointer"
              @click="name = recentName"
            >
              {{ recentName }}
            </el-tag>
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="handleClose">
          취소
        </el-button>
        <el-button type="primary" @click="handleSave">
          확인
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
