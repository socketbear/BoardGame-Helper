<template>
  <div>
    <el-page-header @back="() => $router.push('/')" class="mt-2 ml-4">
      <template #content>
        <span class="text-large font-bold mr-3">세븐 원더스 듀얼 점수 계산기</span>
      </template>
    </el-page-header>

    <div class="max-w-4xl min-w-[560px] mx-auto p-6">
      
      <div class="mb-8">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              v-model="player1Name"
              placeholder="플레이어 1 이름"
              class="w-full"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
            <div class="flex gap-2 mt-2">
              <el-tag
                v-for="name in quickNames"
                :key="name"
                :type="player1Name === name ? 'success' : 'info'"
                class="cursor-pointer"
                @click="player1Name = name"
              >
                {{ name }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="12">
            <el-input
              v-model="player2Name"
              placeholder="플레이어 2 이름"
              class="w-full"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
            <div class="flex gap-2 mt-2">
              <el-tag
                v-for="name in quickNames"
                :key="name"
                :type="player2Name === name ? 'success' : 'info'"
                class="cursor-pointer"
                @click="player2Name = name"
              >
                {{ name }}
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table :data="scoreData" border class="w-full">
        <el-table-column prop="category" label="점수 항목" width="180">
          <template #default="scope">
            <div class="flex items-center gap-2">
              <div :class="['icon-wrapper', scope.row.key]"></div>
              <span class="font-medium">{{ scope.row.category }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column :label="player1Name || '플레이어 1'">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-input-number 
                v-model="scores.player1[scope.row.key]"
                :min="0"
                :max="scope.row.max || 99"
                class="w-full"
                @focus="openNumberPad('player1', scope.row.key, $event)"
              />
            </div>
          </template>
        </el-table-column>
        
        <el-table-column :label="player2Name || '플레이어 2'">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-input-number 
                v-model="scores.player2[scope.row.key]"
                :min="0"
                :max="scope.row.max || 99"
                class="w-full"
                @focus="openNumberPad('player2', scope.row.key, $event)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>

      <tools-number-pad
        v-model="currentScore"
        v-model:visible="numberPadVisible"
        :title="numberPadTitle"
      />

      <div class="mt-8 bg-gray-100 rounded-lg p-6">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="text-center">
              <h3 class="text-xl font-bold mb-2">{{ player1Name || '플레이어 1' }}</h3>
              <div class="text-3xl text-blue-600">{{ calculateTotal('player1') }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="text-center">
              <h3 class="text-xl font-bold mb-2">승자</h3>
              <div class="text-3xl text-red-600">{{ winner }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="text-center">
              <h3 class="text-xl font-bold mb-2">{{ player2Name || '플레이어 2' }}</h3>
              <div class="text-3xl text-blue-600">{{ calculateTotal('player2') }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'

const player1Name = ref('')
const player2Name = ref('')

const scores = ref({
  player1: {
    military: 0,
    treasury: 0,
    wonders: 0,
    civilian: 0,
    commercial: 0,
    guilds: 0,
    science: 0,
    progress: 0
  },
  player2: {
    military: 0,
    treasury: 0,
    wonders: 0,
    civilian: 0,
    commercial: 0,
    guilds: 0,
    science: 0,
    progress: 0
  }
})

const scoreData = [
  { category: '시민 건물', key: 'civilian' },
  { category: '과학 건물', key: 'science' },
  { category: '상업 건물', key: 'commercial' },
  { category: '길드 카드', key: 'guilds' },
  { category: '불가사의', key: 'wonders' },
  { category: '진보 토큰', key: 'progress' },
  { category: '코인', key: 'treasury' },
  { category: '군사 점수', key: 'military' },
]

const calculateTotal = (player) => {
  return Object.values(scores.value[player]).reduce((sum, score) => sum + Number(score), 0)
}

const winner = computed(() => {
  const total1 = calculateTotal('player1')
  const total2 = calculateTotal('player2')
  
  if (total1 > total2) return player1Name.value || '플레이어 1'
  if (total2 > total1) return player2Name.value || '플레이어 2'
  return '무승부'
})

const currentScore = ref(0)
const numberPadVisible = ref(false)
const numberPadTitle = ref('')
const currentPlayer = ref('')
const currentKey = ref('')

const openNumberPad = (player, key, event) => {
  event.target.blur()
  
  currentPlayer.value = player
  currentKey.value = key
  currentScore.value = scores.value[player][key]
  numberPadTitle.value = `${scoreData.find(item => item.key === key).category} 점수 입력`
  numberPadVisible.value = true
}

watch(currentScore, (newValue) => {
  if (currentPlayer.value && currentKey.value) {
    scores.value[currentPlayer.value][currentKey.value] = newValue
  }
})

const quickNames = ['도바킨', '아빠', '엄마', '삼촌', '친구']
</script>

<style scoped>
:deep(.el-input-number .el-input__wrapper) {
  padding: 0;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}

.icon-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 시민 건물 - 파란색 카드 */
.civilian {
  background-color: #2563eb;
  border: 1px solid #1e40af;
}

/* 과학 건물 - 녹색 카드 */
.science {
  background-color: #22c55e;
  border: 1px solid #15803d;
}

/* 상업 건물 - 노란색 카드 */
.commercial {
  background-color: #eab308;
  border: 1px solid #ca8a04;
}

/* 길드 카드 - 보라색 카드 */
.guilds {
  background-color: #9333ea;
  border: 1px solid #7e22ce;
}

/* 불가사의 - 피라미드 */
.wonders {
  position: relative;
  background: transparent;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 24px solid #92400e;
}

/* 진보 토큰 - 녹색 원 */
.progress {
  background-color: #22c55e;
  border-radius: 50%;
  border: 2px solid #15803d;
}

/* 코인 - 노란색 원 */
.treasury {
  background-color: #fbbf24;
  border-radius: 50%;
  border: 2px solid #b45309;
}

/* 군사 점수 - 붉은 방패와 검 */
.military {
  background-color: #dc2626;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  position: relative;
}

.military::before {
  content: '⚔';
  color: white;
  font-size: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

:deep(.el-table__header .cell) {
  text-align: center;
}
</style>
