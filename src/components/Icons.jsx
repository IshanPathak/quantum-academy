/** Minimal monoline icons (1.5px stroke). No external icon library. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

export function IconBook(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path {...base} d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

export function IconMap(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M3 6h18M3 12h12M3 18h6" />
      <circle {...base} cx="18" cy="12" r="2" />
      <circle {...base} cx="15" cy="18" r="2" />
    </svg>
  )
}

export function IconRepeat(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M17 1l4 4-4 4" />
      <path {...base} d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path {...base} d="M7 23l-4-4 4-4" />
      <path {...base} d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

export function IconChart(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  )
}

export function IconLink(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path {...base} d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export function IconInfo(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...props}>
      <circle {...base} cx="12" cy="12" r="10" />
      <path {...base} d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

export function IconMenu(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function IconSearch(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden {...props}>
      <circle {...base} cx="11" cy="11" r="8" />
      <path {...base} d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function IconLock(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden {...props}>
      <rect {...base} x="3" y="11" width="18" height="11" rx="2" />
      <path {...base} d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M20 6 9 17l-5-5" />
    </svg>
  )
}

/** Level chrome icons (24×24 in 46px box) */
export function IconLevelGlobe(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <circle {...base} cx="12" cy="12" r="10" />
      <path {...base} d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export function IconLevelMath(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M4 20 20 4M7 4v4M3 8h8M17 16v4M13 20h8" />
    </svg>
  )
}

export function IconLevelCode(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  )
}

export function IconLevelAtom(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <circle {...base} cx="12" cy="12" r="1.5" />
      <path {...base} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <ellipse {...base} cx="12" cy="12" rx="10" ry="4" />
    </svg>
  )
}

export function IconLevelCircuit(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M4 8h4v8H4zM16 8h4v8h-4zM8 12h8" />
      <path {...base} d="M12 4v4M12 16v4" />
    </svg>
  )
}

export function IconLevelKey(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78Z" />
      <path {...base} d="m15 9 6 6" />
    </svg>
  )
}

export function IconLevelThreat(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M12 9v4M12 17h.01" />
      <path {...base} d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  )
}

export function IconLevelShield(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export function IconLevelGraduate(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path {...base} d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

export function IconLevelCapstone(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...base} d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path {...base} d="M4 22v-7" />
    </svg>
  )
}

const LEVEL_ICON_MAP = {
  globe: IconLevelGlobe,
  math: IconLevelMath,
  code: IconLevelCode,
  atom: IconLevelAtom,
  circuit: IconLevelCircuit,
  key: IconLevelKey,
  threat: IconLevelThreat,
  shield: IconLevelShield,
  graduate: IconLevelGraduate,
  capstone: IconLevelCapstone
}

export function LevelIcon({ name, ...props }) {
  const Icon = LEVEL_ICON_MAP[name] || IconLevelGlobe
  return <Icon {...props} />
}
