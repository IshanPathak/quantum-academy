/** Replace em/en dashes in user-facing strings. Normal hyphens in words are kept. */
export function stripEmDashes(text) {
  if (!text || typeof text !== 'string') return text
  return text
    .replace(/\s*—\s*/g, '. ')
    .replace(/\s*–\s*/g, ', ')
    .replace(/\.\s+\./g, '.')
    .replace(/,\s+,/g, ', ')
}

export function stripHtmlDashes(html) {
  if (!html) return html
  return stripEmDashes(html)
}
