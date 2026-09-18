<script setup lang="ts">
import type { MoneyActor, MoneyTx } from '~/types/MoneyBoardTypes'
import dayjs from 'dayjs'

const props = defineProps<{
  histories: MoneyTx[]
  actors: MoneyActor[]
}>()

const emit = defineEmits<{
  (e: 'revert', txId: string): void
}>()

const open = defineModel<boolean>('open', { required: true })

function formatAmount(amount: number): string {
  return Number.isFinite(amount) ? amount.toLocaleString() : '∞'
}

const actorNames = computed(() => new Map(props.actors.map(actor => [actor.id, actor.name])))

function nameOf(id: string | undefined): string {
  return (id && actorNames.value.get(id)) || '(삭제됨)'
}

const rows = computed(() => props.histories.map(tx => ({
  id: tx.id,
  time: dayjs(tx.timestamp).format('HH:mm:ss'),
  label: tx.type === 'transfer'
    ? `${nameOf(tx.fromId)} → ${nameOf(tx.toId)}`
    : `${nameOf(tx.toId)} 잔액 변경`,
  amount: tx.type === 'transfer' ? formatAmount(tx.amount) : `→ ${formatAmount(tx.amount)}`,
  reverted: Boolean(tx.revertedAt),
})))

const isEmpty = computed(() => rows.value.length === 0)

async function confirmRevert(txId: string) {
  try {
    await ElMessageBox.confirm('이 거래를 취소할까요? 잔액이 되돌려집니다.', '거래 취소', {
      confirmButtonText: '취소하기',
      cancelButtonText: '닫기',
      type: 'warning',
    })
  }
  catch {
    // 사용자가 닫음 — 아무 것도 하지 않는다.
    return
  }
  emit('revert', txId)
}
</script>

<template>
  <el-drawer
    v-model="open"
    title="거래 기록"
    direction="rtl"
    size="min(90%, 420px)"
  >
    <p v-if="isEmpty" class="py-8 text-center text-[var(--shell-text-muted)]">
      아직 거래가 없습니다.
    </p>
    <ul v-else class="flex flex-col gap-2">
      <li
        v-for="row in rows"
        :key="row.id"
        class="flex items-center gap-3 border border-[var(--shell-border)] rounded-lg px-3 py-2"
        :class="{ 'opacity-50': row.reverted }"
      >
        <div class="min-w-0 flex-1" :class="{ 'line-through': row.reverted }">
          <div class="text-xs text-[var(--shell-text-subtle)]">
            {{ row.time }}
          </div>
          <div class="truncate text-[var(--shell-text)]">
            {{ row.label }}
          </div>
          <div class="text-[var(--shell-text)] font-bold">
            {{ row.amount }}
          </div>
        </div>
        <span v-if="row.reverted" class="shrink-0 text-sm text-[var(--shell-text-muted)]">
          취소됨
        </span>
        <el-button v-else size="small" class="shrink-0" @click="confirmRevert(row.id)">
          취소
        </el-button>
      </li>
    </ul>
  </el-drawer>
</template>
