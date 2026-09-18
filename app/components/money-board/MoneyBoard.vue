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

/** 네모의 중심과 반폭·반높이(보드 컨테이너 기준) */
interface BoxRect {
  cx: number
  cy: number
  hw: number
  hh: number
}

/** 이 거리(px) 미만으로 움직이고 떼면 탭 */
const TAP_THRESHOLD = 8
/** 곡선이 휘는 정도: 두 점 거리 대비 수직 오프셋 비율 */
const BEND_RATIO = 0.25

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

/**
 * 사각형 중심에서 `toward` 방향으로 쏜 반직선이 사각형 테두리와 만나는 점.
 * t = min(hw/|dx|, hh/|dy|) — 먼저 닿는 변까지의 비율.
 */
function rectEdgePoint(rect: BoxRect, toward: ArrowPoint): ArrowPoint {
  const dx = toward.x - rect.cx
  const dy = toward.y - rect.cy
  if (dx === 0 && dy === 0)
    return { x: rect.cx, y: rect.cy }
  const t = Math.min(
    dx === 0 ? Infinity : rect.hw / Math.abs(dx),
    dy === 0 ? Infinity : rect.hh / Math.abs(dy),
  )
  return { x: rect.cx + dx * t, y: rect.cy + dy * t }
}

function isInside(rect: BoxRect, p: ArrowPoint): boolean {
  return Math.abs(p.x - rect.cx) <= rect.hw && Math.abs(p.y - rect.cy) <= rect.hh
}

/**
 * 화살표 SVG path. 대상 네모가 있으면 대상 중심 기준으로 제어점을 잡고,
 * 끝점을 "대상 중심 → 제어점" 반직선과 테두리의 교점으로 옮긴다.
 * 끝 접선(제어점 → 끝점)이 대상 중심을 향하므로 화살촉이 네모 쪽을 똑바로 가리킨다.
 * 출발도 같은 방식으로 출발 네모 테두리에서 시작해 선이 네모 글자 위를 지나가지 않게 한다.
 * 포인터가 아직 출발 네모 안이면 테두리가 포인터보다 멀어 선이 뒤로 꺾이므로 그때만 중심에서 출발한다.
 */
function arrowPath(source: BoxRect, pointer: ArrowPoint, target: BoxRect | null): string {
  const center = { x: source.cx, y: source.cy }
  const aim = target ? { x: target.cx, y: target.cy } : pointer
  const ctrl = controlPoint(center, aim)
  const start = isInside(source, pointer) ? center : rectEdgePoint(source, ctrl)
  const end = target ? rectEdgePoint(target, ctrl) : pointer
  return `M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`
}

interface DragState {
  pointerId: number
  fromId: string
  /** 드래그 시작 시 측정한 보드의 뷰포트 좌상단 */
  origin: ArrowPoint
  /** 드래그 시작 시 측정한 모든 네모 위치 */
  rects: Map<string, BoxRect>
  /** 누른 지점(뷰포트 좌표) — 탭 판정용 */
  downClient: ArrowPoint
  /** 현재 포인터(보드 좌표) */
  pointer: ArrowPoint
  moved: boolean
}

const boardRef = ref<HTMLElement | null>(null)
const drag = ref<DragState | null>(null)
const hoverId = ref<string | null>(null)
const markerId = `money-arrow-head-${useId()}`

const markerUrl = computed(() => `url(#${markerId})`)

const arrowD = computed(() => {
  const d = drag.value
  if (!d?.moved)
    return ''
  const start = d.rects.get(d.fromId)
  if (!start)
    return ''
  const target = hoverId.value ? d.rects.get(hoverId.value) ?? null : null
  return arrowPath(start, d.pointer, target)
})

const showArrow = computed(() => arrowD.value !== '')

const highlightedIds = computed(() => {
  const ids = new Set<string>()
  if (drag.value?.moved)
    ids.add(drag.value.fromId)
  if (hoverId.value)
    ids.add(hoverId.value)
  return ids
})

function measureRects(board: HTMLElement, origin: ArrowPoint): Map<string, BoxRect> {
  const rects = new Map<string, BoxRect>()
  board.querySelectorAll<HTMLElement>('[data-actor-id]').forEach((el) => {
    const r = el.getBoundingClientRect()
    rects.set(el.dataset.actorId!, {
      cx: r.left - origin.x + r.width / 2,
      cy: r.top - origin.y + r.height / 2,
      hw: r.width / 2,
      hh: r.height / 2,
    })
  })
  return rects
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
    rects: measureRects(boardRef.value, origin),
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
  <div ref="boardRef" class="relative flex flex-wrap select-none gap-4">
    <MoneyBox
      v-for="actor in actors"
      :key="actor.id"
      :actor="actor"
      :highlighted="highlightedIds.has(actor.id)"
      @pointerdown="onPointerDown($event, actor.id)"
    />
    <svg
      v-show="showArrow"
      class="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <marker
          :id="markerId"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" class="arrow-head" />
        </marker>
      </defs>
      <path
        :d="arrowD"
        class="arrow-line"
        fill="none"
        stroke-width="3.5"
        stroke-linecap="round"
        :marker-end="markerUrl"
      />
    </svg>
  </div>
</template>

<style scoped>
.arrow-line {
  stroke: var(--shell-accent);
}

.arrow-head {
  fill: var(--shell-accent);
}
</style>
