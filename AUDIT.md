# Quantum Academy — Re-audit (post first-pass)

**Date:** 2026-05-27  
**Scope:** Code inspection only (no fixes). Traces what the app renders from current source.  
**Sources:** `DESIGN.md`, four-tab learning model, first-pass completion claims.  
**Curriculum size:** 71 topics across L0–L9 (`src/data/curriculum.js` + `src/data/l8Tracks.js`).

---

### Section 1: Did the first pass hold?

#### CSS

| Claim | Status | Evidence |
|-------|--------|----------|
| Exactly one definition per component class | **INCOMPLETE** | `.tab` is split across `src/styles.css` ~148 and ~343 (second block adds transitions only). `.level-card` is defined at ~102 (`background: var(--surface)`) and overridden at ~348 (`background: var(--card-bg)`). Legacy topic/level blocks still use off-scale values (e.g. `.level-head` `padding:18px 20px`, `.callout` `border-radius:10px`, `.game` `padding:16px`) alongside tokenized rules later in the file. |
| No Fraunces/serif in chrome | **HELD** | `rg Fraunces` / `serif` in `src/styles.css`: no matches. Buttons/search/track use `var(--font-sans)` (e.g. `.btn-action` ~336, `.search-item` ~239). |
| No gradients outside hero | **HELD** (with notes) | No `linear-gradient` on dashboard/review/level cards. `.coin` uses `radial-gradient` inside game body (`styles.css` ~191), which fits “playful game context.” `.hero` has no gradient (flat typography block ~73–76). DESIGN allows a single hero accent; none is present now. |
| Spacing on 4px scale | **INCOMPLETE** | Tokens exist (`--space-*` in `:root` ~29). Many legacy rules still use 10px, 11px, 13px, 14px, 15px, 18px, 20px gaps/padding (e.g. `.topic-head`, `.steps`, `.ex-actions`). |

#### Games (all 14 types — GameShell + objective + rounds + completion)

Dispatcher: `src/games/Games.jsx` ~1068–1085. Shared shell: `src/games/GameShell.jsx` (objective, round bar, `.game-feedback` ok/no, completion with Done / Play again).

| Game `type` | GameShell in Challenge? | Rounds | Free play (no shell)? | Notes |
|-------------|-------------------------|--------|------------------------|-------|
| `vector` | Yes (~86–102) | 5 (`ROUNDS` L7) | Yes (~73–82) | Objective + score + completion. |
| `gate` | Yes (~169–189) | 5 (`GATE_ROUNDS` L105) | Yes (~153–166) | Same. |
| `coin` | Yes (~234–253) | 5 (`COIN_STATES` L193) | No | Challenge only. |
| `entangle` | Yes (~292–322) | 5 (`total` L265) | No | |
| `factor` | Yes (~363–393) | 5 (`ROUNDS`) | No | Shared `FactorGame` component. |
| `rsa` | Yes (same component) | 5 | No | Different target pool via dispatcher ~1074–1075. |
| `braket` | Yes (~408–428) | 5 (`BRAKET_ROUNDS` L396) | Yes (~393–405) | |
| `bloch` | Yes (~624–644) | 5 (`BLOCH_ROUNDS` L472) | Yes (~612–621) | Challenge + Free play. |
| `lattice` | Yes (~687–712) | 5 (`ROUNDS`) | No | |
| `bb84` | Yes (~768–789) | 5 (`BB84_ROUNDS` L723) | No | |
| `grover` | Yes (~857–871) | 5 (`GROVER_ROUNDS` L795) | Yes (~835–854) | Free play is slider explorer. |
| `triage` | Yes (~916–931) | 5 (`TRIAGE_ITEMS` L884, 5 items) | No | |
| `hybrid` | Yes (~979–1004) | 5 (`HYBRID_PAIRS` L948) | No | |
| `entropy` | Yes (~1045–1063) | **4** (`ENTROPY_SAMPLES` L1009–1014) | No | **Objective text says “5”** (`Games.jsx` ~1048) but `totalRounds={total}` is 4. |

**Summary:** **HELD** for GameShell framing on all 14 types in Challenge mode. **INCOMPLETE** for strict “~5 rounds” on `entropy` (4 rounds; copy mismatch).

#### Game copy (dashes, glyphs, title emoji)

| Claim | Status | Evidence |
|-------|--------|----------|
| No em/en-dash or ✓/✗ in `Games.jsx` | **HELD** | `rg '—|–|✓|✗|🎮' src/games`: no matches. Feedback uses words (“Correct.” / “Not quite.”) via `feedback.ok` + `GameShell` ~27–28. |
| No emoji in game titles | **HELD** | Titles are plain strings (e.g. “Lattice Puzzle (LWE)” ~688, “BB84 Eavesdrop Detector” ~769). |
| Runtime dash sanitizer removed | **HELD** | `cleanTopicStrings` / `stripHtmlDashes` not called from `src/data/topicEnrichment.js` (import removed; enrichment no longer strips). Functions remain unused in `src/utils/text.js` ~2–13. |
| Source strings clean | **INCOMPLETE (curriculum)** | Bulk replace turned many em-dashes into spaced hyphens `  -  ` in `curriculum.js` / `l8Tracks.js` (visible in Learn copy). `topicEnrichment.js` ~93 still has en-dash in a key point: `40–50 qubits`. `Games.jsx` is clean; Learn/Recall/Do strings are not fully normalized to DESIGN punctuation rules. |

#### State (`particles` / Fx)

| Claim | Status | Evidence |
|-------|--------|----------|
| `importState` and `loadState` agree | **HELD** | `src/hooks/useProgress.js` ~19 and ~86: both use `particles: obj.settings?.particles === true`. App reads `state.settings?.particles === true` (`App.jsx` ~161). Export/import UI: `Dashboard.jsx` ~86–111. |

#### Six prior bugs

| # | Issue | Status | Evidence |
|---|--------|--------|----------|
| 1 | Single tab row on topic pages | **CONFIRMED FIXED** | `Topic.jsx` ~220–226: one `tabs tabs-underline` row. No `loop-status` pill row in components (`rg loop-status src/components`: none). |
| 2 | Labeled plot grids | **CONFIRMED FIXED** | `src/utils/plotGrid.js` ~59–87: axis labels `x`, `+y`, tick numbers, origin `(0, 0)`. Used by `DoActivity.jsx` (`drawPlotGrid`) and vector/bloch games. |
| 3 | Do distinct from Play (L1) | **CONFIRMED FIXED** | L1: e.g. `t11` `vectorGuided` Do (`learningLoop.js` ~6–18) vs `vector` Play; `t12` guided matrix Do vs `gate` Play; `t14` trueFalse Do vs `coin` Play. Not the same UI. |
| 4 | Recall free-text validation + teaching feedback | **CONFIRMED FIXED** | `RecallPanel.jsx` ~67–100: `isNumericInput`, `numericMatches`, `textMatches`; wrong answers use `wrongExplain` / echoed input, no trick “gotcha” path. |
| 5 | Auto-complete vs manual override | **CONFIRMED FIXED** | `Topic.jsx` ~77, ~316–327: `autoReady` when all loop parts done; otherwise small link “Having trouble? Mark complete anyway” before primary override button. |
| 6 | Reset in Settings, not topic footer | **CONFIRMED FIXED** | `Dashboard.jsx` ~80–83. `reset-link` class exists in CSS ~232 but no component usage in `src/components` (`rg reset-link src/components`: none). |

---

### Section 2: Critical bugs (current)

| ID | Location | What the user sees now | What it should do | Severity |
|----|----------|------------------------|-------------------|----------|
| **BUG-01** | `Games.jsx` `EntropyGame` ~1047–1050 vs `ENTROPY_SAMPLES` ~1009–1014 | Play tab says “Rate **5** key samples” and “Round X of **5**” in the bar, but the game ends after **4** rounds. | Objective and round count should match actual rounds (~5). | **medium** |
| **BUG-02** | `styles.css` ~348–349, ~380 | Cards using `var(--card-bg)` / `var(--card-shadow)` may get invalid backgrounds (tokens **not defined** in `:root`). | Define tokens or use `--surface` per DESIGN. | **medium** (visual; needs manual check) |
| **BUG-03** | `learningLoop.js` `getRecallSet` ~204–219; `RecallPanel.jsx` ~125 | On **64/71** topics, Recall shows **one** MCQ cloned from `topic.quiz`, `passAt: 1`, plus banner: “Full 3 to 5 question set coming in a later level pass.” | 3–5 questions, pass threshold ~80%, spaced-repetition queue without “todo” placeholder. | **high** (learning-loop gap for L0, L2–L9) |
| **BUG-04** | `learningLoop.js` `defaultGuided` ~96–115; `DoActivity.jsx` | **64/71** topics: Do is a 3-step text walkthrough derived from `topic.steps` (or generic Read/Connect/Check). Often repeats Learn/steps, not interactive scaffolding. | Guided practice distinct from Learn and Play, with topic-specific interactions (L1-quality). | **high** (content; expected pre-rollout) |
| **BUG-05** | `curriculum.js` / `l8Tracks.js` (many `learn` strings) | Prose shows awkward `  -  ` separators where em-dashes were mechanically replaced. | Clean punctuation per DESIGN (commas, periods, parentheses). | **low** |
| **BUG-06** | `curriculum.js` `t92` quiz `ok` string ~673 | Recall/Learn quiz feedback can include emoji (e.g. rocket) in passed message. | No emoji in chrome-adjacent feedback; celebration only where allowed. | **low** |

**Not classified as code bugs (by design / pre-rollout):** Reusing the same Play component on multiple topics (e.g. `gate` on `t12`, `t22`, `t41`) with identical mechanics but different curriculum context.

---

### Section 3: DESIGN.md violations (current)

| Rule (`DESIGN.md`) | Violation | Where |
|--------------------|-----------|--------|
| No emoji in chrome, navigation, **level icons**, section headers | Level icons are emoji in curriculum (`icon:'🌍'`, `'📐'`, … `'🚀'`) rendered in sidebar/map (`curriculum.js` L5, L34, …). L8 `trackLabel` uses emoji in topic titles (e.g. `t81` ~576). | **Chrome** |
| No em-dashes / en-dashes in user-facing content | Mechanical `  -  ` throughout curriculum; en-dash in `topicEnrichment.js` ~93 (`40–50`). | **Learn copy** |
| No exclamation marks in UI chrome | Quiz `ok` strings often use `!` (e.g. `curriculum.js` `t12` quiz ~74, `t92` ~673). Shown in Recall when using quiz fallback. | **Recall / quiz feedback** |
| Spacing: strict 4px scale | Widespread 10–20px values in legacy CSS (see Section 1). | **`styles.css`** |
| Typography: Inter/Geist + JetBrains Mono | **Held** for UI chrome fonts. | |
| Near-monochrome + one accent | **Mostly held**; legacy semantic color classes (`--cyan`, `--lime`, etc.) map to accent/success tokens in `:root` ~20–24. Game title color still `var(--violet)` (~177). | Minor |
| Level unlock: brief reveal, no confetti | `LevelUnlock.jsx` + `App.jsx` — needs **manual check** for confetti on level unlock vs exercise pass. | **needs manual check** |
| Motion: respect `prefers-reduced-motion` | **Held** in CSS ~486+ and `ParticleBackground.jsx` ~8. | |

---

### Section 4: Four-tab integrity across ALL levels

**Legend:** Learn = rich `learn`/`deep` in curriculum. Do = authored in `DO_ACTIVITIES` vs `defaultGuided`. Play = tab hidden if `game:null`; else GameShell challenge with objective+rounds+win. Exercise = tab if `topic.exercise`; scaffolded if `EXERCISE_SCAFFOLD[id]`. Recall = `RECALL_BANK` (5 Q, `passAt:4`) vs single quiz (`passAt:1`, `todo:true`).

#### L0 — Why Should I Care? (3 topics)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t01 | pass | fail: `defaultGuided` | n/a | n/a | fail: 1 Q, `passAt:1`, `todo` |
| t02 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t03 | pass | fail: fallback | n/a | n/a | fail: single quiz |

#### L1 — Math Foundation (7 topics) — reference level

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t11 | pass | pass: `vectorGuided` + grid practice | pass: `vector` GameShell ×5 | pass: scaffold `t11` | pass: 5 Q, `passAt:4` |
| t12 | pass | pass: guided matrix | pass: `gate` ×5 | pass: scaffold `t12` | pass: 5 Q |
| t13 | pass | pass: `fillBlank` **3** rounds (not 5) | n/a | n/a | pass: 5 Q |
| t14 | pass | pass: `trueFalse` ×5 | pass: `coin` ×5 | pass: scaffold `t14` | pass: 5 Q |
| t15 | pass | pass: `mcq` **3** rounds | pass: `braket` ×5 | n/a | pass: 5 Q |
| t16 | pass | pass: `fillBlank` **3** rounds | n/a | pass: scaffold `t16` | pass: 5 Q |
| t17 | pass | pass: `trueFalse` ×5 | pass: `entropy` **4** rounds (copy says 5) | n/a | pass: 5 Q |

**L1 summary:** Only level with full Recall banks and authored Do for every topic. Minor gaps: Do round counts on t13/t15/t16; entropy round/copy mismatch on t17 Play.

#### L2 — Code It in Python (3 topics)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t21 | pass | fail: fallback | n/a | fail: generic scaffold | fail: single quiz |
| t22 | pass | fail: fallback | pass: `gate` (same game as t12) | fail: generic | fail: single quiz |
| t23 | pass | fail: fallback | n/a | fail: generic | fail: single quiz |

#### L3 — Quantum Mechanics (6 topics)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t31 | pass | fail: fallback | pass: `coin` (same as t14) | n/a | fail: single quiz |
| t32 | pass | fail: fallback | pass: `bloch` GameShell | n/a | fail: single quiz |
| t33 | pass | fail: fallback | pass: `entangle` ×5 | n/a | fail: single quiz |
| t34 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t35 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t36 | pass | fail: fallback | n/a | n/a | fail: single quiz |

#### L4 — Circuits & Algorithms (4 topics)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t41 | pass | fail: fallback | pass: `gate` | n/a | fail: single quiz |
| t42 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t43 | pass | fail: fallback | pass: `factor` ×5 | fail: generic | fail: single quiz |
| t44 | pass | fail: fallback | pass: `grover` ×5 | fail: generic | fail: single quiz |

#### L5 — Classical Cryptography (8 topics)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t51 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t52 | pass | fail: fallback | pass: `rsa` ×5 | fail: generic | fail: single quiz |
| t53 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t54 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t55 | pass | fail: fallback | pass: `grover` | fail: generic | fail: single quiz |
| t56 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t57 | pass | fail: fallback | pass: `hybrid` ×5 | n/a | fail: single quiz |
| t58 | pass | fail: fallback | n/a | n/a | fail: single quiz |

#### L6 — The Quantum Threat (5 topics)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t61 | pass | fail: fallback | n/a | fail: generic | fail: single quiz |
| t62 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t63 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t64 | pass | fail: fallback | pass: `factor` | n/a | fail: single quiz |
| t65 | pass | fail: fallback | pass: `triage` ×5 | n/a | fail: single quiz |

#### L7 — The Defenses (9 topics)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t71 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t72 | pass | fail: fallback | pass: `bb84` ×5 | n/a | fail: single quiz |
| t73 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t74 | pass | fail: fallback | pass: `lattice` ×5 | fail: generic | fail: single quiz |
| t75 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t76 | pass | fail: fallback | pass: `hybrid` | n/a | fail: single quiz |
| t77 | pass | fail: fallback | pass: `bb84` | n/a | fail: single quiz |
| t78 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t79 | pass | fail: fallback | pass: `lattice` | fail: generic | fail: single quiz |

#### L8 — Specialization (22 topics: t81–t89 + PQC t8p1–p7 + crypt t8c1–c6)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t81 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t8p1 | pass | fail: fallback | pass: `lattice` | n/a | fail: single quiz |
| t8p2 | pass | fail: fallback | n/a | fail: generic (`t8p2` exercise) | fail: single quiz |
| t8p3 | pass | fail: fallback | pass: `hybrid` | n/a | fail: single quiz |
| t8p4–t8p6 | pass | fail: fallback each | n/a | n/a | fail: single quiz each |
| t8p7 | pass | fail: fallback | pass: `triage` | n/a | fail: single quiz |
| t82 | pass | fail: fallback | pass: `bb84` | n/a | fail: single quiz |
| t83 | pass | fail: fallback | pass: `rsa` | n/a | fail: single quiz |
| t8c1 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t8c2, t8c3 | pass | fail: fallback | pass: `factor` each | n/a | fail: single quiz |
| t8c4 | pass | fail: fallback | pass: `grover` | fail: generic | fail: single quiz |
| t8c5 | pass | fail: fallback | pass: `grover` | n/a | fail: single quiz |
| t8c6 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t84–t86, t89 | pass | fail: fallback | n/a | n/a | fail: single quiz |
| t87 | pass | fail: fallback | pass: `hybrid` | n/a | fail: single quiz |
| t88 | pass | fail: fallback | pass: `triage` | n/a | fail: single quiz |

#### L9 — Capstone (4 topics)

| Topic | Learn | Do | Play | Exercise | Recall |
|-------|-------|-----|------|----------|--------|
| t91–t93 | pass | fail: fallback each | n/a | n/a | fail: single quiz |
| t94 | pass | fail: fallback | pass: `entropy` (4 rounds) | n/a | fail: single quiz |

**Roll-up:** **71** topics · **71** Learn pass · **7** Do authored (L1 only) · **37** Play tabs (all use GameShell in challenge when present) · **16** Exercise tabs (**4** authored scaffolds, **12** generic) · **7** full Recall banks (L1 only).

---

### Section 5: Content rollout scope

#### Generic Do fallback (`defaultGuided`)

| Level | Topics on fallback | Count |
|-------|-------------------|------|
| L0 | t01, t02, t03 | 3 |
| L1 | — | 0 |
| L2 | t21, t22, t23 | 3 |
| L3 | t31–t36 | 6 |
| L4 | t41–t44 | 4 |
| L5 | t51–t58 | 8 |
| L6 | t61–t65 | 5 |
| L7 | t71–t79 | 9 |
| L8 | all except none authored | 22 |
| L9 | t91–t94 | 4 |
| **Total** | | **64** |

Implementation: `getDoActivity` → `defaultGuided` (`learningLoop.js` ~118–120). UI: `DoActivity.jsx` `GuidedDo` ~101–124.

#### Single-question Recall (`passAt:1`, `todo:true`)

Same **64** topics as above (every topic not in `RECALL_BANK`). Implementation: `getRecallSet` ~207–218; banner `RecallPanel.jsx` ~125.

**L1 only:** 7 topics × 5 questions, `passAt: 4` (~80%).

#### Exercises: authored scaffold vs generic

| | Count |
|---|------|
| Topics with Exercise tab | **16** |
| Authored `EXERCISE_SCAFFOLD` (t11, t12, t14, t16) | **4** |
| Generic scaffold via `getExerciseScaffold` fallback | **12** |

Topics with exercises include t21, t22, t23, t43, t44, t52, t55, t61, t74, t79, t8p2, t8c4 (verify in curriculum).

#### Games vs L1 reference set

- **Mechanically aligned:** All 14 types use `GameShell` for Challenge with objective, round bar, feedback classes, completion (first pass held).
- **Differs from L1 “reference” feel:**
  - **Free play** modes (`vector`, `gate`, `braket`, `bloch`, `grover`) render outside `GameShell` with no rounds (by pattern, not L1-style).
  - **Shared games** across levels (same component, no per-topic objective text): `gate`×3, `coin`×2, `factor`×4, `grover`×4, `rsa`×2, `hybrid`×4, `triage`×3, `bb84`×3, `lattice`×3, `entropy`×2.
  - **`entropy`:** 4 rounds vs stated 5.
  - **Grover free play:** slider demo only (`Games.jsx` ~835–854), not round-based.

---

### Section 6: Consistency issues

| Area | What varies | Notes |
|------|-------------|--------|
| **Do completion** | L1 uses unified `DoCompletionPanel` after child complete (`DoActivity.jsx` ~258–295). All types funnel through Continue. | **Held** post first-pass. |
| **Recall completion** | L1: multi-question + pass threshold + Review scheduling (`markRecallPass` ~107–136). Other levels: one quiz, still schedules one card if passed. | Functionally inconsistent depth. |
| **Play completion** | All GameShell games: Done + Play again + XP via `Topic.jsx` `handleGameWin` ~166–174. | Consistent. |
| **Exercise completion** | Pass/fail cases + optional hints (`ExercisePanel.jsx`). Generic pseudocode on 12 topics. | Scaffold depth varies. |
| **Feedback copy** | Games: “Correct.” / “Not quite.” Do/Recall: same `.do-feedback` classes. Quiz strings: exclamation marks and legacy tone. | |
| **Button labels** | GameShell: “Done” / “Play again”. Do: “Finish” on last guided step (~120). Recall: “Check” / “Retry recall”. | Minor label mix. |
| **Spacing / cards** | Mix of tokenized and legacy px in `styles.css`; undefined `--card-bg` on unified card block. | needs manual check in browser |
| **Punctuation in Learn** | Widespread `  -  ` from dash replacement. | |

---

### Section 7: Recommended fix order

#### (a) First-pass regressions / quick fixes (re-fix if approved)

1. **Entropy round count** — Add fifth sample or fix objective/bar text (`Games.jsx` ~1047–1050). *Small.*
2. **Define or remove `--card-bg` / `--card-shadow`** — Fix card backgrounds (`styles.css` ~348–349). *Small.*
3. **CSS consolidation pass** — Merge duplicate `.tab` / `.level-card` rules; migrate remaining 10–20px spacing to tokens. *Medium.*
4. **Curriculum punctuation** — Replace `  -  ` artifacts and remaining en-dashes; remove quiz emoji/exclamation where they appear in chrome-adjacent feedback. *Medium, content-only.*

#### (b) Per-level content rollout (L2–L9, plus L0 Recall/Do)

Realistic sequence (L1 remains the quality bar):

| Phase | Levels | Work |
|-------|--------|------|
| **1** | L2 | 3 topics: Python-aligned Do (editor-style / fill-blank), 5-question Recall banks, keep exercises on generic scaffold until authored. Reuse `gate` Play only if Do stays distinct. |
| **2** | L3 | 6 topics: superposition/Bloch/entangle Do activities; Recall banks; optional light exercises for t34–t36. |
| **3** | L4 | 4 topics: Shor/Grover Do + Recall; exercise scaffolds for t43/t44. |
| **4** | L5–L6 | 13 topics: crypto + threat Recall banks; Do for migration/triage concepts; RSA exercise already present. |
| **5** | L7 | 9 topics: PQC/Kyber/hybrid Do + Recall; scaffold t74/t79 exercises (partially there). |
| **6** | L8 | 22 topics: largest batch; prioritize PQC track (t8p1–p7) then cryptanalysis (t8c1–c6), then branch overviews. |
| **7** | L0, L9 | 7 topics: motivation/capstone Recall sets; light Do (no Play on most). |
| **8** | L0 | Optional: no Play/Exercise tabs already; focus Recall + Do quality. |

**Effort guide:** ~1–2 topics at L1 quality per day for full tab parity (Do + Recall + optional Exercise), so L2–L9 (~64 topics) is a **multi-week** content pass, not a single PR.

#### (c) Deferrable

- Per-topic custom Play objectives (shared game components are acceptable short-term).
- Removing unused `src/utils/text.js` dash helpers (dead code).
- Hero accent gradient (DESIGN allows; not implemented).
- Resource library / map polish.
- Expanding L1 Do to 5 rounds on t13/t15/t16 for strict parity.

---

### Manual verification checklist (not confirmed from code alone)

- `npm run build` still passes.
- Browser: L1 topic tab-by-tab; Fx export → reset → import; six Section 1 bugs in UI.
- Level unlock animation vs confetti policy.
- Visual result of undefined `--card-bg`.

---

*End of audit. No application code was modified for this document.*
