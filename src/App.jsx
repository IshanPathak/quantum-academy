import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { CURRICULUM, LORDER } from './data/curriculum.js'
import Level from './components/Level.jsx'
import SearchBar from './components/SearchBar.jsx'
import Glossary from './components/Glossary.jsx'
import Review from './components/Review.jsx'
import Dashboard from './components/Dashboard.jsx'
import Onboarding from './components/Onboarding.jsx'
import About from './components/About.jsx'
import ResourceLibrary from './components/ResourceLibrary.jsx'
import JourneyMap from './components/JourneyMap.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import MicroFeedback, { useMicroFeedback } from './components/MicroFeedback.jsx'
import LevelUnlock from './components/LevelUnlock.jsx'
import { useProgress } from './hooks/useProgress.js'
import fireConfetti from './components/Confetti.jsx'

export default function App() {
  const {
    state, toggleTopic, addXP, reset, importState, recordGame, passExercise, rateReview,
    isUnlocked, levelProgress, totals, setSettings, completeOnboarding, celebrateLevel
  } = useProgress()
  const { toast, show: showFeedback } = useMicroFeedback()
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [view, setView] = useState('curriculum')
  const [unlockLevel, setUnlockLevel] = useState(null)
  const levelRefs = useRef({})
  const topicRefs = useRef({})
  const navIndex = useRef(0)
  const prevUnlocked = useRef({})
  const unlockInit = useRef(false)

  const topicOrder = useMemo(() => {
    const list = []
    LORDER.forEach((lv) => {
      CURRICULUM[lv].topics.forEach((t) => list.push({ id: t.id, lv }))
    })
    return list
  }, [])

  const unlockedFlags = LORDER.map((lv) => isUnlocked(lv))

  const currentLevel = useMemo(() => {
    for (let i = LORDER.length - 1; i >= 0; i--) {
      if (unlockedFlags[i]) return LORDER[i]
    }
    return LORDER[0]
  }, [unlockedFlags])

  useEffect(() => {
    if (!unlockInit.current) {
      LORDER.forEach((lv, i) => { prevUnlocked.current[lv] = unlockedFlags[i] })
      unlockInit.current = true
      return
    }
    LORDER.forEach((lv, i) => {
      if (i === 0) return
      const now = unlockedFlags[i]
      const was = prevUnlocked.current[lv]
      if (now && !was && !state.celebratedLevels?.[lv]) {
        setUnlockLevel(lv)
        showFeedback('Level unlocked: ' + CURRICULUM[lv].name, 'unlock')
      }
      prevUnlocked.current[lv] = now
    })
  }, [unlockedFlags, state.celebratedLevels, showFeedback])

  const handleToggle = (id) => {
    const nowDone = !state.done[id]
    toggleTopic(id)
    if (nowDone) fireConfetti()
  }

  const jumpToTopic = useCallback((levelId, topicId) => {
    const idx = topicOrder.findIndex((t) => t.id === topicId)
    if (idx >= 0) navIndex.current = idx
    setView('curriculum')
    const el = topicRefs.current[topicId]
    const lvEl = levelRefs.current[levelId]
    if (lvEl) lvEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => {
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('highlight-flash')
        setTimeout(() => el.classList.remove('highlight-flash'), 2000)
      }
    }, 300)
  }, [topicOrder])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setGlossaryOpen(false)
        if (unlockLevel) setUnlockLevel(null)
        return
      }
      if (view !== 'curriculum') return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      const delta = e.key === 'ArrowDown' ? 1 : -1
      navIndex.current = (navIndex.current + delta + topicOrder.length) % topicOrder.length
      const t = topicOrder[navIndex.current]
      jumpToTopic(t.lv, t.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, topicOrder, jumpToTopic, unlockLevel])

  const registerTopicRef = useCallback((id, el) => {
    if (el) topicRefs.current[id] = el
  }, [])

  const dueCount = (() => {
    const now = Date.now()
    const cards = state.review?.cards || {}
    let total = 0
    LORDER.forEach((lv) => {
      CURRICULUM[lv].topics.forEach((t) => {
        const qid = `quiz:${t.id}`
        if ((cards[qid]?.due ?? 0) <= now) total++
        ;(t.flashcards || []).forEach((_, i) => {
          const id = `fc:${t.id}:${i}`
          if ((cards[id]?.due ?? 0) <= now) total++
        })
      })
    })
    return total
  })()

  const dismissUnlock = () => {
    if (unlockLevel) celebrateLevel(unlockLevel)
    setUnlockLevel(null)
  }

  const showOnboarding = !state.onboardingDone

  return (
    <>
      <ParticleBackground enabled={state.settings?.particles !== false} />
      <MicroFeedback toast={toast} soundEnabled={state.settings?.sound === true} />

      <div className="app">
        <div className="topbar">
          <div className="brand"><span className="brand-dot" />Quantum<em>Academy</em></div>
          <button type="button" className={'nav-btn ' + (view === 'curriculum' ? 'active' : '')} onClick={() => setView('curriculum')}>Learn</button>
          <button type="button" className={'nav-btn ' + (view === 'review' ? 'active' : '')} onClick={() => setView('review')}>
            Review
            <span className="review-badge">🔁 {dueCount}</span>
          </button>
          <button type="button" className={'nav-btn ' + (view === 'dashboard' ? 'active' : '')} onClick={() => setView('dashboard')}>Dashboard</button>
          <button type="button" className={'nav-btn ' + (view === 'resources' ? 'active' : '')} onClick={() => setView('resources')}>Resources</button>
          <button type="button" className={'nav-btn ' + (view === 'about' ? 'active' : '')} onClick={() => setView('about')}>About</button>
          <SearchBar onJump={jumpToTopic} />
          <button type="button" className="glossary-btn" onClick={() => setGlossaryOpen(true)} title="Glossary" aria-label="Open glossary">📚</button>
          <button
            type="button"
            className="settings-toggle"
            title={state.settings?.particles !== false ? 'Disable background' : 'Enable background'}
            onClick={() => setSettings({ particles: state.settings?.particles === false })}
            aria-label="Toggle animated background"
          >
            {state.settings?.particles !== false ? '✦' : '○'}
          </button>
          <button
            type="button"
            className="settings-toggle"
            title={state.settings?.sound ? 'Sound on' : 'Sound off'}
            onClick={() => setSettings({ sound: !state.settings?.sound })}
            aria-label="Toggle sound"
          >
            {state.settings?.sound ? '🔊' : '🔇'}
          </button>
          <div className="streak">🔥 {state.streak}</div>
          <div className="xp-pill">⚡ {state.xp} XP</div>
        </div>

        {view === 'curriculum' && (
          <>
            <div className="hero">
              <h1>Quantum security,<br /><span className="grad">zero to hero</span></h1>
              <p>{totals.total} topics · 14 games · coding exercises · Review · Resources. Learn → Do → Play → Exercise → Recall. (↑/↓ between topics)</p>
            </div>

            <JourneyMap unlockedFlags={unlockedFlags} levelProgress={levelProgress} currentLevel={currentLevel} />

            <div className="master-bar">
              <div className="mb-track"><div className="mb-fill" style={{ width: (totals.done / totals.total * 100) + '%' }} /></div>
              <div className="mb-label">{totals.done}/{totals.total}</div>
            </div>

            <div id="levels">
              {LORDER.map((lv, idx) => {
                const unlocked = unlockedFlags[idx]
                const prog = levelProgress(lv)
                const autoOpen = idx === 0 || (unlocked && prog.done === 0 && idx > 0 && unlockedFlags[idx - 1])
                return (
                  <div key={lv} ref={(el) => { if (el) levelRefs.current[lv] = el }}>
                    <Level
                      lv={lv}
                      data={CURRICULUM[lv]}
                      unlocked={unlocked}
                      progress={prog}
                      doneMap={state.done}
                      onToggle={handleToggle}
                      onXP={addXP}
                      onGameWin={recordGame}
                      onExercisePass={passExercise}
                      onFeedback={showFeedback}
                      autoOpen={autoOpen}
                      registerTopicRef={registerTopicRef}
                    />
                  </div>
                )
              })}
            </div>

            {totals.done === totals.total && (
              <div className="finale show">
                <h2>🏆 Hero status unlocked.</h2>
                <p>You completed the full zero-to-hero path. Ship your capstone projects, pick your branch, and go change the field.</p>
              </div>
            )}

            <button type="button" className="reset-link" onClick={() => reset()}>Reset all progress</button>
          </>
        )}

        {view === 'review' && (
          <Review
            reviewState={state.review}
            onRate={(cardId, rating) => rateReview(cardId, rating)}
            onXP={(n) => { addXP(n); showFeedback('+' + n + ' XP', 'xp') }}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard
            state={state}
            totals={totals}
            levelProgress={levelProgress}
            onImportState={(obj) => {
              if (importState(obj)) return
              alert('Invalid progress file.')
            }}
          />
        )}

        {view === 'resources' && <ResourceLibrary onJump={jumpToTopic} />}
        {view === 'about' && <About />}

        <Glossary open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
        {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
        {unlockLevel && <LevelUnlock levelId={unlockLevel} onDismiss={dismissUnlock} />}
      </div>
    </>
  )
}
