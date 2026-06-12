# Content rollout progress

One level per phase. Stop for approval between phases.

---

## Phase 0: Cleanup (complete)

**Date:** 2026-05-27  
**Build:** `npm run build` passes.

### Changes

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Entropy game 5 rounds | Done | Added 5th sample in `Games.jsx` (`ENTROPY_SAMPLES`); objective already said 5; `totalRounds` now 5. |
| 2 | `--card-bg` / `--card-shadow` | Done | Defined in `:root` (`styles.css`); also added `--sky`, `--r-pill` used elsewhere. |
| 3 | CSS consolidate | Done | Merged `.tab` transition into main `.tab` rule; single `.level-card` with tokens; migrated level/topic/game/callout spacing called out in audit. |
| 4 | Punctuation artifacts | Done | Replaced `  -  ` with `, ` in `curriculum.js` and `l8Tracks.js` via `scripts/phase0-cleanup.mjs`; fixed `topicEnrichment.js` `40-50` range. |
| 5 | Level icons (no emoji chrome) | Done | `icon:'globe'|'math'|…` in curriculum; `LevelIcon` SVGs in `Icons.jsx`; `Level.jsx` renders icons; lock uses `IconLock`. |
| 6 | Quiz exclamation cleanup | Done | Removed `!` from recall-facing quiz `ok` strings (t21, t22, t92); steps exclamation in t12 left in steps (not Recall chrome). |
| 7 | Dead dash helpers | Done | Deleted `src/utils/text.js` (unused). |

### Phase 0 self-check

| Check | Result |
|-------|--------|
| Entropy: 5 rounds, copy matches | Pass (code) |
| Card tokens defined | Pass |
| No Fraunces / duplicate `.level-card` background conflict | Pass |
| No emoji level icons in curriculum | Pass |
| No `  -  ` artifacts in data files | Pass (`rg` clean) |
| `text.js` removed, build passes | Pass |
| Six prior bugs regressed | Not re-tested in browser this pass; code paths unchanged |

### Manual verification (recommended before Phase 1)

- [ ] Dashboard / level cards show solid `--surface` background (not transparent).
- [ ] Level headers show SVG icons (not emoji).
- [ ] Entropy Play tab: 5 rounds, bar shows "Round 5 of 5".
- [ ] Fx export/import still works.

---

## Phase 1: L2 (complete — approved)

**Date:** 2026-05-27  
**Build:** `npm run build` passes.  
**Verify:** `node scripts/verify-l2.mjs` passes.

### Topics (3)

| Topic | Do | Recall | Exercise scaffold | Play |
|-------|-----|--------|-------------------|------|
| t21 Python setup | fillBlank ×5 | 5 Q, passAt 4 | Yes | — |
| t22 NumPy / matrices | mcq ×5 | 5 Q, passAt 4 | Yes | `gate` (shared Gate Lab) |
| t23 Simulator | trueFalse ×5 | 5 Q, passAt 4 | Yes | — |

### Changes

- `src/data/learningLoop.js`: `DO_ACTIVITIES`, `RECALL_BANK`, `EXERCISE_SCAFFOLD` for t21–t23 (L1-quality bar: 5 Do rounds, 5 Recall / pass 4, authored scaffolds).
- `scripts/verify-l2.mjs`: exercise test vectors + loop coverage check.

### Phase 1 self-check

| Check | Result |
|-------|--------|
| No L2 topic on `defaultGuided` | Pass |
| No Recall `todo:true` fallback | Pass |
| Exercise solutions match curriculum tests | Pass |
| t22 Play still shared `gate` game | By design (no custom objective) |

### Manual verification (recommended before Phase 2)

- [ ] L2 → t21–t23: Do tab shows authored rounds (not generic guided steps).
- [ ] Recall: 5 questions each, pass at 4/5.
- [ ] Exercise hints/scaffold visible; t21 sum, t22 X swap, t23 H probabilities run green.

---

## Phase 2: L3 (complete — awaiting approval)

**Date:** 2026-05-27  
**Build:** `npm run build` passes.  
**Verify:** `node scripts/verify-l3.mjs` passes.

### Topics (6)

| Topic | Do | Recall | Exercise | Play |
|-------|-----|--------|----------|------|
| t31 Superposition | mcq ×5 | 5 Q, passAt 4 | — | `coin` |
| t32 Bloch sphere | mcq ×5 | 5 Q, passAt 4 | — | `bloch` |
| t33 Entanglement | trueFalse ×5 | 5 Q, passAt 4 | — | `entangle` |
| t34 Multi-qubit | fillBlank ×5 | 5 Q, passAt 4 | — | — |
| t35 Measurement / decoherence | trueFalse ×5 | 5 Q, passAt 4 | — | — |
| t36 QEC | mcq ×5 | 5 Q, passAt 4 | — | — |

### Changes

- `src/data/learningLoop.js`: `DO_ACTIVITIES` + `RECALL_BANK` for t31–t36.
- `scripts/verify-l3.mjs`: loop coverage for L3.
- No curriculum exercises added (L3 has none; optional t34–t36 exercises deferred).

### Phase 2 self-check

| Check | Result |
|-------|--------|
| No L3 topic on `defaultGuided` | Pass |
| No Recall `todo:true` fallback | Pass |
| Play games unchanged (`coin`, `bloch`, `entangle`) | Pass |

### Manual verification (recommended before Phase 3)

- [ ] L3 → t31–t36: Do shows authored content; Recall 5 Q / pass 4.
- [ ] t31 coin, t32 bloch, t33 entangle Play tabs still win normally.
- [ ] t34–t36: no Play tab (expected).

**Next:** Phase 3 — L4 (6 topics). Stop here for approval.

---

## Totals (target end state)

| Metric | Current | Target |
|--------|---------|--------|
| Authored Do | 16 | 71 |
| Full Recall banks | 16 | 71 |
| Authored exercise scaffolds | 7 | 16 (all exercises) |
