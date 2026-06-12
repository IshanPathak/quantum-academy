import { useState, useEffect, useCallback } from 'react'
import { CURRICULUM, LORDER } from '../data/curriculum.js'

const KEY = 'qacad_react_v1'

function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        done: parsed.done || {},
        xp: parsed.xp || 0,
        streak: parsed.streak || 0,
        games: parsed.games || {},
        exercises: parsed.exercises || {},
        review: parsed.review || {},
        settings: {
          particles: parsed.settings?.particles === true,
          sound: parsed.settings?.sound === true
        },
        onboardingDone: !!parsed.onboardingDone,
        celebratedLevels: parsed.celebratedLevels || {},
        loops: parsed.loops || {},
        exerciseAttempts: parsed.exerciseAttempts || 0
      }
    }
  } catch (e) { /* ignore */ }
  return {
    done: {}, xp: 0, streak: 0, games: {}, exercises: {}, review: {},
    settings: { particles: false, sound: false },
    onboardingDone: false,
    celebratedLevels: {},
    loops: {},
    exerciseAttempts: 0
  }
}

export function useProgress() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) { /* ignore */ }
  }, [state])

  const toggleTopic = useCallback((id) => {
    setState(prev => {
      const was = prev.done[id]
      const done = { ...prev.done, [id]: !was }
      return {
        ...prev,
        done,
        xp: prev.xp + (was ? 0 : 10),
        streak: was ? Math.max(0, prev.streak - 1) : prev.streak + 1
      }
    })
    return !state.done[id]
  }, [state.done])

  const addXP = useCallback((n) => {
    setState(prev => ({ ...prev, xp: prev.xp + n }))
  }, [])

  const reset = useCallback(() => {
    if (!confirm('Reset ALL progress (topics, XP, review, exercises)? This cannot be undone.')) return
    setState((prev) => ({
      done: {}, xp: 0, streak: 0, games: {}, exercises: {}, review: {},
      settings: prev.settings || { particles: false, sound: false },
      onboardingDone: prev.onboardingDone,
      celebratedLevels: {},
      loops: {},
      exerciseAttempts: 0
    }))
  }, [])

  const importState = useCallback((obj) => {
    if (!obj || typeof obj !== 'object') return false
    setState({
      done: obj.done || {},
      xp: obj.xp || 0,
      streak: obj.streak || 0,
      games: obj.games || {},
      exercises: obj.exercises || {},
      review: obj.review || {},
      settings: {
        particles: obj.settings?.particles === true,
        sound: obj.settings?.sound === true
      },
      onboardingDone: !!obj.onboardingDone,
      celebratedLevels: obj.celebratedLevels || {},
      loops: obj.loops || {},
      exerciseAttempts: obj.exerciseAttempts || 0
    })
    return true
  }, [])

  const markLoop = useCallback((topicId, part) => {
    setState((prev) => ({
      ...prev,
      loops: {
        ...prev.loops,
        [topicId]: { ...prev.loops?.[topicId], [part]: true }
      }
    }))
  }, [])

  const markRecallPass = useCallback((topicId, correct, total) => {
    const ratio = total ? correct / total : 0
    setState((prev) => {
      const cards = { ...(prev.review?.cards || {}) }
      const now = Date.now()
      const baseDays = ratio >= 0.8 ? 3 : ratio >= 0.6 ? 1 : 0
      const due = now + baseDays * 24 * 60 * 60 * 1000
      const qid = 'quiz:' + topicId
      cards[qid] = {
        reps: 1,
        intervalDays: baseDays || 1,
        ease: ratio >= 0.8 ? 2.6 : 2.3,
        due,
        lastRatedAt: now,
        lastRating: ratio >= 0.8 ? 'good' : 'hard'
      }
      return {
        ...prev,
        loops: {
          ...prev.loops,
          [topicId]: {
            ...prev.loops?.[topicId],
            recall: true,
            recallScore: correct,
            recallTotal: total
          }
        },
        review: { ...prev.review, cards }
      }
    })
  }, [])

  const bumpExerciseAttempts = useCallback(() => {
    setState((prev) => ({ ...prev, exerciseAttempts: (prev.exerciseAttempts || 0) + 1 }))
  }, [])

  const setSettings = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch }
    }))
  }, [])

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, onboardingDone: true }))
  }, [])

  const celebrateLevel = useCallback((lv) => {
    setState((prev) => ({
      ...prev,
      celebratedLevels: { ...prev.celebratedLevels, [lv]: true }
    }))
  }, [])

  const recordGame = useCallback((gameId) => {
    setState(prev => ({
      ...prev,
      games: { ...prev.games, [gameId]: (prev.games?.[gameId] || 0) + 1 }
    }))
  }, [])

  const passExercise = useCallback((topicId) => {
    setState(prev => ({
      ...prev,
      exercises: { ...prev.exercises, [topicId]: { passed: true, passedAt: Date.now() } }
    }))
  }, [])

  const rateReview = useCallback((cardId, rating) => {
    const now = Date.now()
    setState(prev => {
      const cards = prev.review?.cards || {}
      const cur = cards[cardId] || { reps: 0, intervalDays: 0, ease: 2.5, due: 0 }
      let ease = cur.ease
      let reps = cur.reps
      let intervalDays = cur.intervalDays

      if (rating === 'again') {
        reps = 0
        intervalDays = 1
        ease = Math.max(1.3, ease - 0.2)
      } else if (rating === 'hard') {
        reps = reps + 1
        intervalDays = Math.max(1, Math.round((intervalDays || 1) * 1.2))
        ease = Math.max(1.3, ease - 0.05)
      } else if (rating === 'good') {
        reps = reps + 1
        if (reps === 1) intervalDays = 1
        else if (reps === 2) intervalDays = 6
        else intervalDays = Math.max(1, Math.round((intervalDays || 6) * ease))
      } else if (rating === 'easy') {
        reps = reps + 1
        if (reps === 1) intervalDays = 2
        else if (reps === 2) intervalDays = 8
        else intervalDays = Math.max(2, Math.round((intervalDays || 8) * ease * 1.3))
        ease = ease + 0.15
      }

      const due = now + intervalDays * 24 * 60 * 60 * 1000
      return {
        ...prev,
        review: {
          ...prev.review,
          cards: { ...cards, [cardId]: { reps, intervalDays, ease, due, lastRatedAt: now, lastRating: rating } }
        }
      }
    })
  }, [])

  // derived: which levels are unlocked
  const isUnlocked = useCallback((lv) => {
    const idx = LORDER.indexOf(lv)
    if (idx === 0) return true
    const prev = LORDER[idx - 1]
    const prevTopics = CURRICULUM[prev].topics
    return prevTopics.every(t => state.done[t.id])
  }, [state.done])

  const levelProgress = useCallback((lv) => {
    const topics = CURRICULUM[lv].topics
    const done = topics.filter(t => state.done[t.id]).length
    return { done, total: topics.length }
  }, [state.done])

  const totals = (() => {
    let done = 0, total = 0
    LORDER.forEach(lv => {
      CURRICULUM[lv].topics.forEach(t => {
        total++
        if (state.done[t.id]) done++
      })
    })
    return { done, total }
  })()

  return {
    state, toggleTopic, addXP, reset, importState, recordGame, passExercise, rateReview,
    isUnlocked, levelProgress, totals, setSettings, completeOnboarding, celebrateLevel,
    markLoop, markRecallPass, bumpExerciseAttempts
  }
}
