# 🔬 Quantum Academy

A gamified **zero-to-hero** learning platform for **quantum security**. Built with React + Vite.

Complete path: math foundations → Python & simulators → quantum mechanics → algorithms (Shor, Grover) → classical crypto (RSA, AES, ECC, PKI, TLS) → quantum threat & migration → NIST PQC defenses (Kyber, Dilithium, hybrid TLS) → **PQC & cryptanalysis tracks** → hands-on labs → career launch.

**71 topics · 10 levels · 14 games · 10 coding exercises · spaced repetition · dashboard · glossary · search.**

Each topic: **Learn → Do → Play → Exercise (where applicable) → Recall**. Deep-dive sections, key points, flashcards, XP, streaks, progressive unlocks.

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

## 📁 Project structure

```
quantum-academy/
└── src/
    ├── App.jsx
    ├── data/
    │   ├── curriculum.js      # Main curriculum + spreads L8 tracks
    │   ├── l8Tracks.js        # PQC (7) + Cryptanalysis (6) sub-tracks
    │   └── glossary.js
    ├── components/
    │   ├── Topic.jsx          # Learn / Do / Play / Exercise / Recall
    │   ├── Level.jsx          # Collapsible track sections (L8)
    │   ├── Review.jsx
    │   ├── Dashboard.jsx
    │   ├── SearchBar.jsx
    │   └── Glossary.jsx
    ├── games/Games.jsx
    └── hooks/useProgress.js   # localStorage key: qacad_react_v1
```

## ✏️ Customizing

**Topic shape:** `title`, `learn`, optional `deep`, `keyPoints`, `flashcards`, `analogy`, `res`, `steps`, optional `code`, optional `exercise`, optional `game`, `quiz`.

**L8 tracks:** set `track: 'pqc' | 'cryptanalysis'` and `trackLabel` on the first topic of a section.

**Exercises:** `exercise: { prompt, starter, tests: [{input, expected}], solution }` — user implements `solve(input)` in JS.

## 🎮 Games (14)

Vector Plotter · Gate Lab · Quantum Coin · Entanglement · Bloch Sphere · Bra-Ket · Shor Factoring · Attack RSA · LWE Lattice · BB84 · Grover Search · Migration Triage · Hybrid TLS Builder · Entropy Meter

## 📚 Levels

| Level | Focus |
|-------|--------|
| 0–4 | Motivation, math, code, quantum mechanics, algorithms |
| 5 | Classical crypto: RSA, AES, ECC, PKI/TLS, signatures |
| 6 | Threat: mapping, timelines, resource estimates, CNSA, side channels |
| 7 | Defenses: NIST PQC, Kyber, Dilithium, hybrid TLS, QKD limits |
| 8 | **PQC track (7)** + **Cryptanalysis track (6)** + other branches + labs |
| 9 | Capstone projects, CTFs, career |

---

Progress saves in your browser (`localStorage`). Use **Dashboard → Export progress** to back up.

---

## Deploy (GitHub + Netlify)

The repo includes `netlify.toml` (build: `npm run build`, publish: `dist`, SPA redirects).

### 1. Push to GitHub

From this folder (git is already initialized with an initial commit):

```powershell
# Install GitHub CLI if needed: winget install GitHub.cli --source winget
gh auth login

gh repo create quantum-academy --public --source=. --remote=origin --push
```

If the repo name is taken, pick another name and use that in the `gh repo create` command.

If you created an empty repo on GitHub manually:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/quantum-academy.git
git branch -M main
git push -u origin main
```

### 2. Connect Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Choose **GitHub** and select `quantum-academy`.
3. Netlify should read `netlify.toml` automatically. If not, set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy. Your site will get a `*.netlify.app` URL.

On university/corporate networks, set `NODE_OPTIONS=--use-system-ca` in Netlify **Environment variables** if `npm install` fails on SSL.
