# 🔬 Quantum Academy

A gamified **zero-to-hero** learning platform for **quantum security**. Built with React + Vite.

In the app, each topic follows `Learn`, `Do`, `Play`, `Exercise` (if available), then `Recall`.
Use **Review** for spaced repetition, and **Dashboard** to track XP and export or import your progress.

---

## 🚀 Quick start

You need [Node.js](https://nodejs.org) 18+ installed. On some networks (university/corporate), use:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

---

## 🧭 App views

| View | Purpose |
|------|---------|
| **Learn** | Full curriculum with level unlocks |
| **Review** | SM-2 spaced repetition (quizzes + flashcards), due badge in top bar |
| **Dashboard** | XP, streak, per-level bars, games/exercises stats, export/import progress |

**Keyboard:** `↑` / `↓` jump between topics (Learn view). `Esc` closes glossary.

---

## Project overview

Source code is in `src/`. The Learn and Exercise flow lives in `src/components/Topic.jsx`, and progress is stored under `qacad_react_v1`.

## Where the content lives

Topics are defined in `src/data/curriculum.js`. L8 tracks are defined in `src/data/l8Tracks.js`. The glossary is in `src/data/glossary.js`.

Games and exercises are embedded inside topics in the Learn flow.

## Levels at a glance

- Levels 0 to 4: foundations (math, code, quantum basics).
- Level 5: classical crypto (RSA, AES, ECC, PKI, TLS).
- Level 6: quantum threat and migration planning.
- Level 7: defenses and NIST post-quantum concepts.
- Level 8: PQC and cryptanalysis tracks.
- Level 9: capstones and next steps.

---

Progress saves in your browser (`localStorage`). Use Dashboard to export your progress JSON.

---

## Deploy to Netlify

This repo includes `netlify.toml`. Netlify builds with `npm run build` and publishes `dist`.

1. Push the repo to GitHub.
2. In Netlify, add a new site and import from Git.
3. Select the repo. Netlify should detect `netlify.toml`.
4. If you see SSL issues, set `NODE_OPTIONS=--use-system-ca` in Netlify environment variables.
