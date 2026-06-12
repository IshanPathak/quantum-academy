import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { CURRICULUM, LORDER } from './data/curriculum.js'
import Topic from './components/Topic.jsx'
import Sidebar from './components/Sidebar.jsx'
import MapView from './components/MapView.jsx'
import SearchBar from './components/SearchBar.jsx'
import Glossary from './components/Glossary.jsx'
import Review from './components/Review.jsx'
import Dashboard from './components/Dashboard.jsx'
import Onboarding from './components/Onboarding.jsx'
import About from './components/About.jsx'
import ResourceLibrary from './components/ResourceLibrary.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import MicroFeedback, { useMicroFeedback } from './components/MicroFeedback.jsx'
import LevelUnlock from './components/LevelUnlock.jsx'
import { useProgress } from './hooks/useProgress.js'
import fireConfetti from './components/Confetti.jsx'
import {
  IconBook, IconMap, IconRepeat, IconChart, IconLink, IconInfo, IconMenu
} from './components/Icons.jsx'

function findTopic(levelId, topicId) {
  const level = CURRICULUM[levelId]
  if (!level) return null
  return level.topics.find((t) => t.id === topicId) || null
}

function firstTopicInLevel(levelId) {
  const level = CURRICULUM[levelId]
  return level?.topics[0] || null
}

export default function App() {
  const {
    state, toggleTopic, addXP, reset, importState, recordGame, passExercise, rateReview,
    isUnlocked, levelProgress, totals, setSettings, completeOnboarding, celebrateLevel,
    markLoop, markRecallPass, bumpExerciseAttempts
  } = useProgress()
  const { toast, show: showFeedback } = useMicroFeedback()
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [view, setView] = useState('learn')
  const [selected, setSelected] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unlockLevel, setUnlockLevel] = useState(null)
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
      LORDER.forEach((lv) => { prevUnlocked.current[lv] = unlockedFlags[LORDER.indexOf(lv)] })
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

  const selectTopic = useCallback((levelId, topicId) => {
    const idx = topicOrder.findIndex((t) => t.id === topicId)
    if (idx >= 0) navIndex.current = idx
    setSelected({ levelId, topicId })
    setView('learn')
  }, [topicOrder])

  const selectLevelFirstTopic = useCallback((levelId) => {
    const t = firstTopicInLevel(levelId)
    if (t) selectTopic(levelId, t.id)
  }, [selectTopic])

  const handleToggle = (id) => {
    const nowDone = !state.done[id]
    toggleTopic(id)
    if (nowDone) fireConfetti()
  }

  const handleExercisePass = (id) => {
    passExercise(id)
    fireConfetti()
  }

  const jumpToTopic = useCallback((levelId, topicId) => {
    selectTopic(levelId, topicId)
  }, [selectTopic])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setGlossaryOpen(false)
        setSidebarOpen(false)
        if (unlockLevel) setUnlockLevel(null)
        return
      }
      if (view !== 'learn' || !selected) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      const delta = e.key === 'ArrowDown' ? 1 : -1
      navIndex.current = (navIndex.current + delta + topicOrder.length) % topicOrder.length
      const t = topicOrder[navIndex.current]
      selectTopic(t.lv, t.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, topicOrder, selectTopic, unlockLevel, selected])

  const registerTopicRef = useCallback((id, el) => {
    if (el) topicRefs.current[id] = el
  }, [])

  const dueCount = (() => {
    const now = Date.now()
    const cards = state.review?.cards || {}
    let total = 0
    LORDER.forEach((lv) => {
      CURRICULUM[lv].topics.forEach((t) => {
        const qid = 'quiz:' + t.id
        if ((cards[qid]?.due ?? 0) <= now) total++
        ;(t.flashcards || []).forEach((_, i) => {
          const id = 'fc:' + t.id + ':' + i
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
  const activeTopic = selected ? findTopic(selected.levelId, selected.topicId) : null
  const activeLevel = selected ? CURRICULUM[selected.levelId] : null
  const particlesOn = state.settings?.particles === true

  const nextTopicInfo = useMemo(() => {
    if (!selected) return null
    const idx = topicOrder.findIndex((t) => t.id === selected.topicId)
    if (idx < 0 || idx >= topicOrder.length - 1) return null
    const next = topicOrder[idx + 1]
    const t = findTopic(next.lv, next.id)
    return { levelId: next.lv, topicId: next.id, title: t?.title || next.id }
  }, [selected, topicOrder])

  const navItems = [
    { id: 'learn', label: 'Learn', Icon: IconBook },
    { id: 'map', label: 'Map', Icon: IconMap },
    { id: 'review', label: 'Review', Icon: IconRepeat, badge: dueCount },
    { id: 'dashboard', label: 'Dashboard', Icon: IconChart },
    { id: 'resources', label: 'Resources', Icon: IconLink },
    { id: 'about', label: 'About', Icon: IconInfo }
  ]

  return (
    <>
      <ParticleBackground enabled={particlesOn} />
      <MicroFeedback toast={toast} soundEnabled={state.settings?.sound === true} />

      <div className="app-shell">
        <div className={'sidebar-overlay' + (sidebarOpen ? ' open' : '')} onClick={() => setSidebarOpen(false)} aria-hidden />

        <Sidebar
          unlockedFlags={unlockedFlags}
          doneMap={state.done}
          selected={selected}
          onSelectTopic={selectTopic}
          onClose={() => setSidebarOpen(false)}
          isOpen={sidebarOpen}
        />

        <div className="app-main">
          <header className="topbar">
            <button
              type="button"
              className="btn-ghost topbar-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open curriculum menu"
            >
              <IconMenu />
            </button>
            <div className="brand">Quantum Academy</div>
            <nav className="topbar-nav" aria-label="Main">
              {navItems.map(({ id, label, Icon, badge }) => (
                <button
                  key={id}
                  type="button"
                  className={'nav-btn' + (view === id ? ' active' : '')}
                  onClick={() => setView(id)}
                >
                  <Icon />
                  <span>{label}</span>
                  {badge > 0 && id === 'review' && (
                    <span className="nav-badge mono">{badge}</span>
                  )}
                </button>
              ))}
            </nav>
            <SearchBar onJump={jumpToTopic} />
            <button type="button" className="btn-ghost btn-sm" onClick={() => setGlossaryOpen(true)} aria-label="Open glossary">
              Glossary
            </button>
            <button
              type="button"
              className="btn-text btn-sm"
              title={particlesOn ? 'Disable background' : 'Enable background'}
              onClick={() => setSettings({ particles: !particlesOn })}
              aria-label="Toggle animated background"
            >
              {particlesOn ? 'Fx on' : 'Fx off'}
            </button>
            <button
              type="button"
              className="btn-text btn-sm"
              title={state.settings?.sound ? 'Sound on' : 'Sound off'}
              onClick={() => setSettings({ sound: !state.settings?.sound })}
              aria-label="Toggle sound"
            >
              {state.settings?.sound ? 'Sound on' : 'Sound off'}
            </button>
            <div className="streak mono" title="Day streak">{state.streak}d</div>
            <div className="xp-pill mono">{state.xp} XP</div>
          </header>

          <div className="main-content">
            {view === 'learn' && (
              <>
                {!selected || !activeTopic ? (
                  <div className="learn-home">
                    <div className="hero">
                      <h1>Learn quantum security</h1>
                      <p className="hero-sub">Build the math, threat models, and post-quantum skills to protect real systems.</p>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          const lv = currentLevel
                          const t = firstTopicInLevel(lv)
                          if (t) selectTopic(lv, t.id)
                          else setSidebarOpen(true)
                        }}
                      >
                        Continue learning
                      </button>
                      <p className="hero-caption mono">
                        {totals.done}/{totals.total} topics complete · 10 levels · 14 games
                      </p>
                    </div>
                    <div className="master-bar">
                      <div className="mb-track"><div className="mb-fill" style={{ width: (totals.done / totals.total * 100) + '%' }} /></div>
                      <div className="mb-label mono">{totals.done}/{totals.total}</div>
                    </div>
                    <p className="learn-hint">Pick a topic from the sidebar, or open the Map to see the full path.</p>
                  </div>
                ) : (
                  <article className="topic-panel">
                    <nav className="breadcrumb" aria-label="Breadcrumb">
                      <button type="button" className="breadcrumb-link" onClick={() => setSelected(null)}>Learn</button>
                      <span className="breadcrumb-sep" aria-hidden>/</span>
                      <span className="breadcrumb-level">{activeLevel?.name}</span>
                      <span className="breadcrumb-sep" aria-hidden>/</span>
                      <span className="breadcrumb-topic">{activeTopic.title}</span>
                    </nav>
                    <h1 className="topic-panel-title">{activeTopic.title}</h1>
                    <Topic
                      key={activeTopic.id}
                      topic={activeTopic}
                      done={!!state.done[activeTopic.id]}
                      onToggle={handleToggle}
                      onXP={addXP}
                      onGameWin={(gameId) => recordGame(gameId)}
                      onExercisePass={handleExercisePass}
                      onFeedback={showFeedback}
                      registerRef={registerTopicRef}
                      embedded
                      loopProgress={state.loops?.[activeTopic.id]}
                      onMarkLearn={() => markLoop(activeTopic.id, 'learn')}
                      onMarkDo={() => markLoop(activeTopic.id, 'do')}
                      onMarkPlay={() => markLoop(activeTopic.id, 'play')}
                      onRecallPass={(correct, total) => markRecallPass(activeTopic.id, correct, total)}
                      exercisePassed={!!state.exercises?.[activeTopic.id]?.passed}
                      exerciseAttempts={state.exerciseAttempts || 0}
                      onBumpExerciseAttempt={bumpExerciseAttempts}
                      onTryAutoComplete={() => {
                        if (!state.done[activeTopic.id]) {
                          toggleTopic(activeTopic.id)
                          fireConfetti()
                          showFeedback('Topic mastered', 'xp')
                        }
                      }}
                      nextTopicLabel={nextTopicInfo?.title}
                      onGoNextTopic={() => nextTopicInfo && selectTopic(nextTopicInfo.levelId, nextTopicInfo.topicId)}
                    />
                  </article>
                )}
              </>
            )}

            {view === 'map' && (
              <MapView
                unlockedFlags={unlockedFlags}
                levelProgress={levelProgress}
                currentLevel={currentLevel}
                onSelectLevel={selectLevelFirstTopic}
              />
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
                onReset={reset}
              />
            )}

            {view === 'resources' && <ResourceLibrary onJump={jumpToTopic} />}
            {view === 'about' && <About />}

            {view === 'learn' && totals.done === totals.total && (
              <div className="finale show">
                <h2>Path complete</h2>
                <p>You finished all topics. Use Dashboard to export progress and pick your next branch in Level 8.</p>
              </div>
            )}
          </div>
        </div>

        <Glossary open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
        {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
        {unlockLevel && <LevelUnlock levelId={unlockLevel} onDismiss={dismissUnlock} />}
      </div>
    </>
  )
}
