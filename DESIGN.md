# Quantum Academy — Design System

This file is the source of truth for visual and interaction design. Every UI change must reference and respect it. If something is not specified here, default to Linear / Vercel restraint, not decoration.

## Design philosophy
Inspired by Vercel, Linear, and Brilliant. The product is a serious technical learning tool. The interface should feel like a precision instrument, not a toy.

Three principles, in priority order:
1. Clarity over cleverness. The learner's attention belongs on the content, not the chrome.
2. Confidence through restraint. One accent color, used sparingly, beats five competing colors.
3. Motion explains. Every animation must have a reason. Decoration without purpose is noise.

## Global content rules
- No em-dashes or en-dashes anywhere in user-facing content. Replace with periods, commas, or parentheses. Hyphens in compound words like "post-quantum" stay.
- No emoji in chrome, navigation, level icons, buttons, badges, or section headers. Emoji is permitted only inside game contexts where playfulness is intentional.
- No exclamation marks in UI chrome. Reserved for celebration moments only.
- Numbers always with their unit on first mention. "10 levels" not "10".

## Color tokens
Near-monochrome with one accent. Defined as CSS variables in styles.css.

- background: oklch(0.08 0 0)
- surface: oklch(0.12 0 0)
- surface-elevated: oklch(0.16 0 0)
- border: oklch(0.22 0 0)
- text-primary: oklch(0.96 0 0)
- text-secondary: oklch(0.66 0 0)
- text-muted: oklch(0.48 0 0)
- accent: oklch(0.72 0.18 280)
- success: oklch(0.78 0.16 145)
- warn: oklch(0.78 0.16 80)
- error: oklch(0.68 0.20 25)

## Typography
- Display and UI: Inter or Geist Sans, weights 400 / 500 / 700.
- Monospaced: JetBrains Mono for code, IDs, numbers in stats, and technical notation.

## Spacing
Use a strict 4px scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.

## Motion
- Durations: 120ms (micro), 200ms (standard), 320ms (deliberate).
- Easing: cubic-bezier(0.2, 0, 0, 1) for entrances, cubic-bezier(0.4, 0, 1, 1) for exits.
- Respect prefers-reduced-motion.

## Layout
- Persistent left sidebar on desktop showing the level and topic tree.
- Main content area focuses on one topic at a time.
- Thin breadcrumb: Level > Topic.
- Full journey map in a dedicated Map view.

## Gamification
- Level unlock: brief reveal, no confetti.
- XP gain: small floating label near source.
- Exercise pass and level complete: confetti permitted.
- Sound: off by default.
