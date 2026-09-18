<script setup lang="ts">
import type { MoneyActor, MoneyTx } from '~/types/MoneyBoardTypes'
import dayjs from 'dayjs'
import { UNIT_POSITION } from '~/types/RichEnums'

const props = defineProps<{
  histories: MoneyTx[]
  actors: MoneyActor[]
}>()

const emit = defineEmits<{
  (e: 'revert', txId: string): void
}>()

const open = defineModel<boolean>('open', { required: true })

// 앱 컨텍스트 없이 confirm 을 부르면 element-plus 가 앱에 주입한 z-index 카운터 대신 전역 카운터를 써서 서랍 딤 아래로 깔린다.
const appContext = getCurrentInstance()?.appContext ?? null

const unit = useUnitStore()

function formatAmount(amount: number): string {
  const value = Number.isFinite(amount) ? amount.toLocaleString() : '∞'
  return unit.currency.unitPosition === UNIT_POSITION.FRONT
    ? `${unit.currency.unit}${value}`
    : `${value}${unit.currency.unit}`
}

const actorNames = computed(() => new Map(props.actors.map(actor => [actor.id, actor.name])))
const txById = computed(() => new Map(props.histories.map(tx => [tx.id, tx])))

function nameOf(id: string | undefined): string {
  return (id && actorNames.value.get(id)) || '(삭제됨)'
}

/** revert 체인을 거슬러 올라가 원거래(transfer/set)와 체인 깊이를 찾는다. 못 찾으면 origin 은 undefined. */
function resolveOrigin(tx: MoneyTx): { origin?: MoneyTx, depth: number } {
  let current: MoneyTx | undefined = tx
  let depth = 0
  // 순환 참조 방어: 기록 길이보다 깊은 체인은 있을 수 없다.
  while (current?.type === 'revert' && depth <= props.histories.length) {
    current = current.revertOfId ? txById.value.get(current.revertOfId) : undefined
    depth++
  }
  return { origin: current?.type === 'revert' ? undefined : current, depth }
}

function describe(tx: MoneyTx | undefined): { label: string, amount: string } {
  if (!tx)
    return { label: '(알 수 없는 거래)', amount: '' }
  if (tx.type === 'transfer')
    return { label: `${nameOf(tx.fromId)} → ${nameOf(tx.toId)}`, amount: formatAmount(tx.amount) }
  return { label: `${nameOf(tx.toId)} 잔액 변경`, amount: `→ ${formatAmount(tx.amount)}` }
}

const rows = computed(() => props.histories.map((tx) => {
  const isRevert = tx.type === 'revert'
  const { origin, depth } = resolveOrigin(tx)
  return {
    id: tx.id,
    time: dayjs(tx.timestamp).format('HH:mm:ss'),
    isRevert,
    badge: isRevert ? (depth % 2 === 1 ? '취소' : '다시 적용') : '',
    ...describe(origin),
    reverted: Boolean(tx.revertedById),
  }
}))

const isEmpty = computed(() => rows.value.length === 0)

async function confirmRevert(txId: string, isRevert: boolean) {
  try {
    await ElMessageBox.confirm(
      isRevert ? '이 취소를 되돌릴까요? 잔액이 다시 적용됩니다.' : '이 거래를 취소할까요? 잔액이 되돌려집니다.',
      isRevert ? '취소 되돌리기' : '거래 취소',
      {
        confirmButtonText: isRevert ? '되돌리기' : '취소하기',
        cancelButtonText: '닫기',
        type: 'warning',
      },
      appContext,
    )
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
          <div class="flex items-center gap-2 text-xs text-[var(--shell-text-subtle)]">
            <span>{{ row.time }}</span>
            <span
              v-if="row.isRevert"
              class="border border-[var(--shell-border)] rounded px-1 text-[var(--shell-text-muted)]"
            >
              {{ row.badge }}
            </span>
          </div>
          <div class="truncate text-[var(--shell-text)]">
            {{ row.label }}
          </div>
          <div v-if="row.amount" class="text-[var(--shell-text)] font-bold">
            {{ row.amount }}
          </div>
        </div>
        <span v-if="row.reverted" class="shrink-0 text-sm text-[var(--shell-text-muted)]">
          취소됨
        </span>
        <el-button v-else size="small" class="shrink-0" @click="confirmRevert(row.id, row.isRevert)">
          취소
        </el-button>
      </li>
    </ul>
  </el-drawer>
</template>
