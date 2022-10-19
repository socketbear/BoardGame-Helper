<script setup lang="ts">
const cv = ref<HTMLCanvasElement>()
interface IEdge {
  x: number
  y: number
  r: number
}

const drawEdge = (ctx: CanvasRenderingContext2D, data: IEdge) => {
  ctx.beginPath()
  ctx.arc(data.x, data.y, data.r, 0, 2 * Math.PI)
  ctx.stroke()
}

const drawLine = (ctx: CanvasRenderingContext2D, from: IEdge, to: IEdge) => {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}

onMounted(() => {
  const ctx = cv.value?.getContext('2d')
  if (!ctx)
    return

  // if (ctx) {
  //   ctx.fillStyle = 'red'
  //   ctx.fillRect(0, 0, 100, 100)
  // }
  const edges: IEdge[] = [
    { x: 50, y: 50, r: 2 },
    { x: 250, y: 50, r: 2 },
    { x: 250, y: 250, r: 2 },
    { x: 50, y: 250, r: 2 },
  ]
  const mainCircle: IEdge = { x: 150, y: 150, r: 4 }

  drawEdge(ctx, mainCircle)
  edges.forEach((element) => {
    drawEdge(ctx, element)
    drawLine(ctx, mainCircle, element)
  })
})
</script>

<template>
  <div>
    <sandbox-sdb-image-overlay />
    <div class="w-1/2 mx-auto">
      <canvas ref="cv" width="512" height="512" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
  </route>
