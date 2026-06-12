/** Labeled 2D plot grid for Do/Play vector activities. y increases upward. */

export const GRID_SIZE = 280
export const GRID_ORIGIN = 140
export const GRID_CELL = 28
export const GRID_MIN = -5
export const GRID_MAX = 5

export function gridToPixel(vx, vy) {
  return {
    x: GRID_ORIGIN + vx * GRID_CELL,
    y: GRID_ORIGIN - vy * GRID_CELL
  }
}

export function pixelToGrid(px, py) {
  return {
    vx: Math.round((px - GRID_ORIGIN) / GRID_CELL),
    vy: Math.round((GRID_ORIGIN - py) / GRID_CELL)
  }
}

export function drawPlotGrid(ctx, vector) {
  const { vx, vy } = vector || {}
  const size = GRID_SIZE
  const o = GRID_ORIGIN
  const cell = GRID_CELL

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = 'oklch(0.08 0 0)'
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'oklch(0.16 0 0)'
  ctx.lineWidth = 1
  for (let i = GRID_MIN; i <= GRID_MAX; i++) {
    const x = o + i * cell
    const y = o - i * cell
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()
  }

  ctx.strokeStyle = 'oklch(0.35 0 0)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(o, 0)
  ctx.lineTo(o, size)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, o)
  ctx.lineTo(size, o)
  ctx.stroke()

  ctx.fillStyle = 'oklch(0.48 0 0)'
  ctx.font = '10px JetBrains Mono, ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  for (let i = GRID_MIN; i <= GRID_MAX; i++) {
    if (i === 0) continue
    const x = o + i * cell
    ctx.fillText(String(i), x, o + 4)
  }
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (let i = GRID_MIN; i <= GRID_MAX; i++) {
    if (i === 0) continue
    const y = o - i * cell
    ctx.fillText(String(i), o - 6, y)
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('x', size - 14, o + 4)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'
  ctx.fillText('+y', o + 6, 12)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillStyle = 'oklch(0.66 0 0)'
  ctx.font = '9px JetBrains Mono, ui-monospace, monospace'
  ctx.fillText('(0, 0)', o + 6, o + 6)

  if (vx !== undefined && vy !== undefined) {
    const tip = gridToPixel(vx, vy)
    ctx.strokeStyle = 'oklch(0.72 0.18 280)'
    ctx.fillStyle = 'oklch(0.72 0.18 280)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(o, o)
    ctx.lineTo(tip.x, tip.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2)
    ctx.fill()
  }
}
