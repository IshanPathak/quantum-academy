export function isNumericInput(s) {
  const t = String(s).trim()
  if (!t) return false
  return /^[-+]?(\d+(\.\d+)?|\.\d+)$/.test(t)
}

export function parseNumeric(s) {
  const n = parseFloat(String(s).trim())
  return Number.isFinite(n) ? n : null
}

export function numericMatches(input, accept) {
  const n = parseNumeric(input)
  if (n === null) return false
  return accept.some((a) => {
    const t = parseNumeric(a)
    if (t === null) return false
    return Math.abs(n - t) < 0.001
  })
}

export function textMatches(input, accept) {
  const norm = (s) => String(s).replace(/\s/g, '').toLowerCase()
  const n = norm(input)
  return accept.some((a) => norm(a) === n)
}
