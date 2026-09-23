<script setup lang="ts">
import type { ArrowPoint, MoneyActor } from '~/types/MoneyBoardTypes'
import MoneyBox from '~/components/money-board/MoneyBox.vue'

const { actors } = defineProps<{
  actors: MoneyActor[]
}>()

const emit = defineEmits<{
  (event: 'transfer', fromId: string, toId: string): void
  (event: 'select', actorId: string): void
}>()

/** 이 거리(px) 미만으로 움직이고 떼면 탭 */
const TAP_THRESHOLD = 8
/** 곡선이 휘는 정도: 두 점 거리 대비 수직 오프셋 비율 */
const BEND_RATIO = 0.25
/** 화살촉 길이(끝점 → 밑변 중앙)와 밑변 폭(px) */
const HEAD_LENGTH = 44
const HEAD_WIDTH = 44
/** 몸통을 화살촉 끝에서 이만큼 앞에서 끊는다. 둥근 끝이 화살촉 밖으로 삐져나오지 않게 화살촉 안쪽에서 끝난다. */
const BODY_TRIM = HEAD_LENGTH / 2

/** 화살표 한 벌: 몸통 path d 와 화살촉 polygon points */
interface ArrowShape {
  body: string
  head: string
}

/**
 * 2차 베지어 제어점. 두 점의 중점에서 진행 방향의 왼쪽 수직으로 거리 × BEND_RATIO 만큼 민다.
 * 두 점이 같으면 중점(= 그 점)을 돌려준다.
 */
function controlPoint(from: ArrowPoint, to: ArrowPoint): ArrowPoint {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
  const len = Math.hypot(dx, dy)
  if (len === 0)
    return mid
  // 단위 수직 벡터 (-dy, dx)/len 에 len × BEND_RATIO 를 곱하면 len 이 약분된다
  return { x: mid.x - dy * BEND_RATIO, y: mid.y + dx * BEND_RATIO }
}

function lerp(a: ArrowPoint, b: ArrowPoint, t: number): ArrowPoint {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

/**
 * 출발 = 누른 네모 중앙, 끝 = 포인터 위치인 곡선 화살표.
 *
 * - 끝 접선 방향 u = (끝 − 제어점)/|끝 − 제어점| (2차 베지어 B'(1) = 2(P − C)).
 * - 화살촉 삼각형: 꼭짓점 = 포인터, 밑변 중앙 = 포인터 − u·HEAD_LENGTH, 양 끝 = 밑변 중앙 ± n·HEAD_WIDTH/2 (n = u 의 수직).
 * - 몸통: 곡선을 t 에서 잘라(de Casteljau) 앞부분만 그린다. 끝 부근 속력 |B'(1)| = 2|P − C| 로
 *   t ≈ 1 − BODY_TRIM / (2|P − C|) 를 잡으면 몸통 끝이 포인터에서 약 BODY_TRIM 앞, 화살촉 안쪽에 온다.
 *   포인터가 출발점에 너무 가까워 잘라 낼 몸통이 없으면 화살촉만 그린다.
 *
 * 출발점과 포인터가 같으면 방향이 없으므로 null.
 */
function arrowShape(start: ArrowPoint, end: ArrowPoint): ArrowShape | null {
  const ctrl = controlPoint(start, end)
  const tx = end.x - ctrl.x
  const ty = end.y - ctrl.y
  const tLen = Math.hypot(tx, ty)
  if (tLen === 0)
    return null
  const u = { x: tx / tLen, y: ty / tLen }
  const n = { x: -u.y, y: u.x }
  const base = { x: end.x - u.x * HEAD_LENGTH, y: end.y - u.y * HEAD_LENGTH }
  const half = HEAD_WIDTH / 2
  const head = [
    end,
    { x: base.x + n.x * half, y: base.y + n.y * half },
    { x: base.x - n.x * half, y: base.y - n.y * half },
  ].map(p => `${p.x},${p.y}`).join(' ')

  const t = 1 - BODY_TRIM / (2 * tLen)
  if (t <= 0)
    return { body: '', head }
  // de Casteljau 로 [0, t] 구간만 남긴 2차 베지어: 제어점 = lerp(S, C, t), 끝 = B(t)
  const c1 = lerp(start, ctrl, t)
  const bodyEnd = lerp(c1, lerp(ctrl, end, t), t)
  return { body: `M ${start.x} ${start.y} Q ${c1.x} ${c1.y} ${bodyEnd.x} ${bodyEnd.y}`, head }
}

interface DragState {
  pointerId: number
  fromId: string
  /** 드래그 시작 시 측정한 보드의 뷰포트 좌상단 */
  origin: ArrowPoint
  /** 드래그 시작 시 측정한 모든 네모의 중앙(보드 좌표) */
  centers: Map<string, ArrowPoint>
  /** 누른 지점(뷰포트 좌표) — 탭 판정용 */
  downClient: ArrowPoint
  /** 현재 포인터(보드 좌표) */
  pointer: ArrowPoint
  moved: boolean
}

const boardRef = ref<HTMLElement | null>(null)
const drag = ref<DragState | null>(null)
const hoverId = ref<string | null>(null)

const arrow = computed(() => {
  const d = drag.value
  if (!d?.moved)
    return null
  const start = d.centers.get(d.fromId)
  return start ? arrowShape(start, d.pointer) : null
})

const highlightedIds = computed(() => {
  const ids = new Set<string>()
  if (drag.value?.moved)
    ids.add(drag.value.fromId)
  if (hoverId.value)
    ids.add(hoverId.value)
  return ids
})

function measureCenters(board: HTMLElement, origin: ArrowPoint): Map<string, ArrowPoint> {
  const centers = new Map<string, ArrowPoint>()
  board.querySelectorAll<HTMLElement>('[data-actor-id]').forEach((el) => {
    const r = el.getBoundingClientRect()
    centers.set(el.dataset.actorId!, {
      x: r.left - origin.x + r.width / 2,
      y: r.top - origin.y + r.height / 2,
    })
  })
  return centers
}

/** 포인터 아래 네모 id. 이 보드 밖이거나 출발 네모 자신이면 null. */
function targetAt(clientX: number, clientY: number, fromId: string): string | null {
  const el = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>('[data-actor-id]')
  if (!el || !boardRef.value?.contains(el))
    return null
  const id = el.dataset.actorId ?? null
  return id === fromId ? null : id
}

function onPointerDown(event: PointerEvent, actorId: string) {
  if (drag.value || !event.isPrimary || event.button !== 0 || !boardRef.value)
    return
  // 텍스트 선택·네이티브 드래그 방지
  event.preventDefault()
  const box = boardRef.value.getBoundingClientRect()
  const origin = { x: box.left, y: box.top }
  drag.value = {
    pointerId: event.pointerId,
    fromId: actorId,
    origin,
    centers: measureCenters(boardRef.value, origin),
    downClient: { x: event.clientX, y: event.clientY },
    pointer: { x: event.clientX - origin.x, y: event.clientY - origin.y },
    moved: false,
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', endDrag)
}

function onPointerMove(event: PointerEvent) {
  const d = drag.value
  if (!d || event.pointerId !== d.pointerId)
    return
  d.pointer = { x: event.clientX - d.origin.x, y: event.clientY - d.origin.y }
  if (!d.moved && Math.hypot(event.clientX - d.downClient.x, event.clientY - d.downClient.y) >= TAP_THRESHOLD)
    d.moved = true
  if (d.moved)
    hoverId.value = targetAt(event.clientX, event.clientY, d.fromId)
}

function onPointerUp(event: PointerEvent) {
  const d = drag.value
  if (!d || event.pointerId !== d.pointerId)
    return
  if (!d.moved) {
    emit('select', d.fromId)
  }
  else {
    const toId = targetAt(event.clientX, event.clientY, d.fromId)
    if (toId)
      emit('transfer', d.fromId, toId)
  }
  endDrag()
}

/** pointerup·pointercancel·언마운트 공통 정리 */
function endDrag() {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', endDrag)
  drag.value = null
  hoverId.value = null
}

onBeforeUnmount(endDrag)
</script>

<template>
  <div
    ref="boardRef"
    class="relative grid grid-cols-2 select-none gap-3 sm:grid-cols-[repeat(auto-fill,minmax(12rem,18rem))] sm:justify-center sm:gap-4"
  >
    <MoneyBox
      v-for="actor in actors"
      :key="actor.id"
      :actor="actor"
      :highlighted="highlightedIds.has(actor.id)"
      @pointerdown="onPointerDown($event, actor.id)"
    />
    <svg
      v-if="arrow"
      class="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <g class="arrow">
        <!-- 외곽선 먼저, 색 채움을 위에: 어떤 네모 색 위에서도 윤곽이 보인다 -->
        <path v-if="arrow.body" :d="arrow.body" class="arrow-body-outline" />
        <polygon :points="arrow.head" class="arrow-head-outline" />
        <path v-if="arrow.body" :d="arrow.body" class="arrow-body" />
        <polygon :points="arrow.head" class="arrow-head" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.arrow {
  filter: drop-shadow(0 3px 4px var(--shell-overlay));
}

/* 몸통 14px + 양쪽 외곽선 4px */
.arrow-body,
.arrow-body-outline {
  fill: none;
  stroke-linecap: round;
}

.arrow-body {
  stroke: var(--shell-accent);
  stroke-width: 14px;
}

.arrow-body-outline {
  stroke: var(--shell-bg);
  stroke-width: 22px;
}

/* 채움에는 stroke 를 두지 않는다: 꼭짓점이 포인터 좌표에 정확히 온다 */
.arrow-head {
  fill: var(--shell-accent);
}

.arrow-head-outline {
  stroke-linejoin: round;
  fill: var(--shell-bg);
  stroke: var(--shell-bg);
  stroke-width: 10px;
}
</style>
