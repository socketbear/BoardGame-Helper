<script setup lang="ts">
import type { MoneyActor } from '~/types/MoneyBoardTypes'
import AmountDialog from '~/components/money-board/AmountDialog.vue'
import HistoryPanel from '~/components/money-board/HistoryPanel.vue'
import MoneyBoard from '~/components/money-board/MoneyBoard.vue'
import MoneyBoardSetup from '~/components/money-board/MoneyBoardSetup.vue'

definePageMeta({ layout: 'game' })

const { actors, histories, addActor, transfer, setBalance, revert, reset } = useMoneyBoard()

const isPlaying = ref(false)
const showHistory = ref(false)

/** 금액 입력창이 확인되면 무엇을 할지. 드래그/탭 시점에 정해 둔다. */
type PendingAction =
  | { type: 'transfer', fromId: string, toId: string }
  | { type: 'set', actorId: string }

const pending = ref<PendingAction>()
const dialogOpen = ref(false)
const dialogTitle = ref('')

function nameOf(id: string) {
  return actors.value.find(a => a.id === id)?.name ?? ''
}

function start(setupActors: Omit<MoneyActor, 'id'>[]) {
  reset()
  setupActors.forEach(addActor)
  isPlaying.value = true
}

function openTransfer(fromId: string, toId: string) {
  pending.value = { type: 'transfer', fromId, toId }
  dialogTitle.value = `${nameOf(fromId)} → ${nameOf(toId)}`
  dialogOpen.value = true
}

function openSet(actorId: string) {
  pending.value = { type: 'set', actorId }
  dialogTitle.value = `${nameOf(actorId)} 잔액 변경`
  dialogOpen.value = true
}

function applyAmount(amount: number) {
  const action = pending.value
  if (!action)
    return

  if (action.type === 'transfer') {
    if (!transfer(action.fromId, action.toId, amount))
      ElMessage.warning('0보다 큰 금액을 입력해 주세요.')
  }
  else {
    setBalance(action.actorId, amount)
  }
  pending.value = undefined
}

async function restart() {
  try {
    await ElMessageBox.confirm('처음부터 다시 설정할까요? 지금까지의 잔액과 기록이 사라집니다.', '새로 시작', {
      confirmButtonText: '새로 시작',
      cancelButtonText: '취소',
      type: 'warning',
    })
  }
  catch {
    return
  }
  reset()
  isPlaying.value = false
}

// 영속 저장이 없으므로(메모리만) 진행 중 이탈은 한 번 확인한다.
onBeforeRouteLeave(async (to, from, next) => {
  if (!isPlaying.value) {
    next()
    return
  }
  try {
    await ElMessageBox.confirm('페이지를 나가면 진행 상황이 사라집니다. 나갈까요?', '나가기', {
      confirmButtonText: '나가기',
      cancelButtonText: '취소',
      type: 'warning',
    })
    next()
  }
  catch {
    next(false)
  }
})
</script>

<template>
  <div class="w-full">
    <el-page-header class="ml-4 mt-2" @back="() => $router.push('/')">
      <template #content>
        <span class="text-large mr-3 font-bold">머니 보드</span>
        <span class="text-sm text-gray-500">
          {{ isPlaying ? '진행 중' : '설정' }}
        </span>
      </template>
    </el-page-header>

    <MoneyBoardSetup v-if="!isPlaying" @start="start" />

    <template v-else>
      <p class="px-4 pt-2 text-sm text-[var(--shell-text-muted)]">
        네모를 끌어 다른 네모에 놓으면 송금, 네모를 누르면 잔액을 바꿉니다.
      </p>
      <MoneyBoard :actors="actors" class="p-4" @transfer="openTransfer" @select="openSet" />

      <div class="flex justify-center py-4">
        <button class="tiny-del-btn" @click="restart">
          새로 시작
        </button>
      </div>

      <div class="fixed right-4 top-15 z-50">
        <button
          class="rounded-full bg-[var(--shell-bg-elevated)] p-3 shadow-lg hover:bg-[var(--shell-hover-bg)]"
          aria-label="거래 기록 보기"
          @click="showHistory = true"
        >
          <div i-carbon-document class="h-6 w-6" />
        </button>
      </div>

      <AmountDialog v-model:open="dialogOpen" :title="dialogTitle" @confirm="applyAmount" />
      <HistoryPanel v-model:open="showHistory" :histories="histories" :actors="actors" @revert="revert" />
    </template>
  </div>
</template>
