# Changelog

## Learner-friendly v1 polish (May 2026)

Refinement pass on the existing app (71 topics, games, review, dashboard). No rebuild of core architecture; progress still uses `qacad_react_v1`.

### Design system & UI
- Extended CSS variables: type scale, spacing, motion tokens, unified card styles.
- Consistent buttons (`btn-primary`, `btn-ghost`), tab/panel transitions, `prefers-reduced-motion` support.
- Polished locked-level, empty, and onboarding/unlock modals.

### Immersion
- Subtle particle background with top-bar toggle (off when reduced motion is preferred).
- XP/streak/unlock micro-toasts; optional sound (off by default).
- **Journey map** across all 10 levels; **level unlock** celebration modal.

### Content
- **Why this matters** line on every topic via `topicEnrichment.js` (runtime merge).
- Filled missing `deep` / `keyPoints` on shallow topics; em/en dashes stripped from displayed content.
- Glossary expanded (~50 terms); verified crypto facts unchanged from audit.

### Exercises (10 → 16)
- Clear **output format** examples; free **hints**; **show solution** after 2+ failed attempts.
- New exercises: **t12**, **t14**, **t52**, **t55**, **t61**, **t8p2** (plus existing set).

### Resources
- **Resource cards** with type badges (video, docs, course, paper, standard, code).
- `extraResources` on select topics; **Resource Library** view (search + filter).
- Top bar: Resources, About, background/sound toggles.

### Onboarding & polish
- Skippable 4-screen first-run onboarding (once).
- **About / How to use** page.
- Progress export/import includes `settings`, `onboardingDone`, `celebratedLevels`.

### New / updated files
- `src/data/topicEnrichment.js`, `src/utils/text.js`, `src/utils/resources.js`
- `ParticleBackground`, `JourneyMap`, `LevelUnlock`, `MicroFeedback`, `Onboarding`, `About`, `ResourceLibrary`, `ResourceCards`
- Updated: `App.jsx`, `Topic.jsx`, `Level.jsx`, `useProgress.js`, `styles.css`, `curriculum.js`, `l8Tracks.js`, `glossary.js`

### Build
- `npm run build` passes.
