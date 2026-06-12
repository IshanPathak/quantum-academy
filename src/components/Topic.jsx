import React, { useEffect, useMemo, useState, useCallback } from 'react'
import Game from '../games/Games.jsx'
import ResourceCards from './ResourceCards.jsx'
import DoActivity from './DoActivity.jsx'
import RecallPanel from './RecallPanel.jsx'
import ExercisePanel from './ExercisePanel.jsx'

function normalizeOut(x) {
  if (x === null || x === undefined) return ''
  if (typeof x === 'string') return x
  try { return JSON.stringify(x) } catch { return String(x) }
}

function createWorker() {
  const src = `
    self.onmessage = async (e) => {
      const { code, input } = e.data || {};
      try {
        const fn = new Function(\`
          "use strict";
          const console = { log: () => {}, error: () => {}, warn: () => {} };
          const window = undefined, document = undefined;
          const require = undefined, process = undefined;
          \${code}
          if (typeof solve !== "function") throw new Error("Define a function solve(input) that returns the output.");
          return solve;
        \`);
        const solve = fn();
        const out = await solve(String(input ?? ''));
        self.postMessage({ ok: true, output: out });
      } catch (err) {
        self.postMessage({ ok: false, error: String(err && err.message ? err.message : err) });
      }
    };
  `
  const blob = new Blob([src], { type: 'text/javascript' })
  const url = URL.createObjectURL(blob)
  const w = new Worker(url)
  URL.revokeObjectURL(url)
  return w
}

export default function Topic({
  topic,
  done,
  onToggle,
  onXP,
  onGameWin,
  onExercisePass,
  registerRef,
  onFeedback,
  embedded = false,
  loopProgress,
  onMarkDo,
  onMarkPlay,
  onRecallPass,
  exercisePassed,
  exerciseAttempts,
  onBumpExerciseAttempt,
  onTryAutoComplete,
  nextTopicLabel,
  onGoNextTopic,
  onMarkLearn
}) {
  const [open, setOpen] = useState(embedded)
  const [tab, setTab] = useState('learn')
  const [showManualComplete, setShowManualComplete] = useState(false)

  const hasGame = !!topic.game
  const hasExercise = !!topic.exercise
  const loop = loopProgress || {}
  const learnDone = !!loop.learn
  const doDone = !!loop.do
  const playDone = !!loop.play || !hasGame
  const exDone = !!exercisePassed || !hasExercise
  const recallDone = !!loop.recall
  const autoReady = learnDone && doDone && playDone && exDone && recallDone

  const [code, setCode] = useState(topic.exercise?.starter || '')
  const [running, setRunning] = useState(false)
  const [cases, setCases] = useState([])
  const [passed, setPassed] = useState(!!exercisePassed)
  const [failCount, setFailCount] = useState(0)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  const switchTab = (next) => {
    setTab(next)
    if (next === 'learn') onMarkLearn && onMarkLearn()
  }

  useEffect(() => {
    if (tab === 'learn') onMarkLearn && onMarkLearn()
  }, [tab, onMarkLearn])

  const tryAuto = useCallback(() => {
    if (done) return
    if (autoReady) onTryAutoComplete && onTryAutoComplete()
  }, [done, autoReady, onTryAutoComplete])

  useEffect(() => {
    tryAuto()
  }, [tryAuto])

  useEffect(() => {
    if (!embedded && !open) return
    if (!hasExercise) return
    setCode(topic.exercise?.starter || '')
    setCases([])
    setPassed(!!exercisePassed)
    setFailCount(0)
    setHintsRevealed(0)
    setShowSolution(false)
  }, [embedded, open, hasExercise, topic.exercise?.starter, exercisePassed])

  const testCases = useMemo(() => topic.exercise?.tests || [], [topic.exercise])

  const runExercise = async () => {
    if (!hasExercise) return
    onBumpExerciseAttempt && onBumpExerciseAttempt()
    setRunning(true)
    setCases([])

    const results = []
    for (const tc of testCases) {
      const worker = createWorker()
      const timeoutMs = 1000
      const res = await new Promise((resolve) => {
        const to = setTimeout(() => {
          try { worker.terminate() } catch {}
          resolve({ ok: false, error: 'Timeout after ' + timeoutMs + 'ms' })
        }, timeoutMs)
        worker.onmessage = (e) => {
          clearTimeout(to)
          try { worker.terminate() } catch {}
          resolve(e.data)
        }
        worker.postMessage({ code, input: tc.input })
      })
      const out = res.ok ? normalizeOut(res.output) : ''
      const expected = normalizeOut(tc.expected)
      const ok = !!res.ok && out.trim() === expected.trim()
      results.push({
        input: tc.input,
        expected,
        output: res.ok ? out : null,
        error: res.ok ? null : res.error,
        ok
      })
    }

    setCases(results)
    const allOk = results.length > 0 && results.every((r) => r.ok)
    if (allOk) {
      setPassed(true)
      onXP(25)
      onExercisePass && onExercisePass(topic.id)
      onFeedback && onFeedback('+25 XP · Exercise passed', 'xp')
      tryAuto()
    } else {
      setFailCount((c) => c + 1)
    }
    setRunning(false)
  }

  const handleGameWin = (result) => {
    const total = result?.total || 5
    const score = result?.score ?? total
    onGameWin && onGameWin(topic.game, { score, total })
    const bonus = Math.floor((score / total) * 10)
    onXP(10 + bonus)
    onMarkPlay && onMarkPlay()
    onFeedback && onFeedback('+' + (10 + bonus) + ' XP · Play complete', 'xp')
    tryAuto()
  }

  const handleDoComplete = () => {
    onMarkDo && onMarkDo()
    onXP(5)
    onFeedback && onFeedback('+5 XP · Do complete', 'xp')
    tryAuto()
  }

  const handleRecallPass = ({ passed, correct, total }) => {
    if (passed) {
      onRecallPass && onRecallPass(correct, total)
      onFeedback && onFeedback('Recall passed · ' + correct + '/' + total, 'xp')
      tryAuto()
    }
  }

  const handleToggle = () => {
    const wasDone = done
    onToggle(topic.id)
    if (!wasDone) onFeedback && onFeedback('+10 XP · Topic complete', 'xp')
  }

  const showBody = embedded || open
  const firstExerciseExpanded = (exerciseAttempts || 0) === 0

  const continuity = (label, targetTab) => (
    <div className="tab-continuity">
      <button type="button" className="btn-ghost btn-sm" onClick={() => switchTab(targetTab)}>{label}</button>
    </div>
  )

  return (
    <div ref={(el) => registerRef && registerRef(topic.id, el)} className={'topic' + (embedded ? ' topic-embedded' : '') + (done ? ' done' : '') + (showBody ? ' open' : '')}>
      {!embedded && (
        <div className="topic-head" onClick={() => setOpen((o) => !o)}>
          <div className="topic-check">
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="topic-title">{topic.title}</div>
          <div className="topic-chev" aria-hidden>›</div>
        </div>
      )}
      {showBody && (
        <div className="topic-body">
          <div className="tabs tabs-underline" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'learn'} className={'tab' + (tab === 'learn' ? ' active' : '')} onClick={() => switchTab('learn')}>Learn</button>
            <button type="button" role="tab" aria-selected={tab === 'practice'} className={'tab' + (tab === 'practice' ? ' active' : '') + (doDone ? ' tab-done' : '')} onClick={() => switchTab('practice')}>Do</button>
            {hasGame && <button type="button" role="tab" aria-selected={tab === 'play'} className={'tab' + (tab === 'play' ? ' active' : '') + (playDone ? ' tab-done' : '')} onClick={() => switchTab('play')}>Play</button>}
            {hasExercise && <button type="button" role="tab" aria-selected={tab === 'exercise'} className={'tab' + (tab === 'exercise' ? ' active' : '') + (exDone ? ' tab-done' : '')} onClick={() => switchTab('exercise')}>Exercise</button>}
            <button type="button" role="tab" aria-selected={tab === 'reinforce'} className={'tab' + (tab === 'reinforce' ? ' active' : '') + (recallDone ? ' tab-done' : '')} onClick={() => switchTab('reinforce')}>Recall</button>
          </div>

          <div className={'panel-wrap' + (tab === 'learn' ? ' active' : '')}>
            {tab === 'learn' && (
              <div className="panel active">
                {topic.whyMatters && (
                  <div className="why-matters">
                    <span className="why-matters-label">Why this matters</span>
                    <p>{topic.whyMatters}</p>
                  </div>
                )}
                <p className="lead" dangerouslySetInnerHTML={{ __html: topic.learn }} />
                {topic.deep && <div className="deep-dive" dangerouslySetInnerHTML={{ __html: topic.deep }} />}
                {(topic.keyPoints || []).length > 0 && (
                  <ul className="key-points">
                    {topic.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                )}
                <div className="callout"><span className="callout-label">Analogy</span>{topic.analogy}</div>
                <ResourceCards resources={topic.res} title="Resources for this topic" />
                <ResourceCards resources={topic.extraResources} title="Go deeper" />
              </div>
            )}
          </div>

          <div className={'panel-wrap' + (tab === 'practice' ? ' active' : '')}>
            {tab === 'practice' && (
              <div className="panel active">
                <DoActivity topic={topic} completed={doDone} onComplete={handleDoComplete} />
                {doDone && hasGame && continuity('Now try the game →', 'play')}
                {doDone && !hasGame && continuity('Lock it in with Recall →', 'reinforce')}
              </div>
            )}
          </div>

          <div className={'panel-wrap' + (tab === 'play' ? ' active' : '')}>
            {tab === 'play' && hasGame && (
              <div className="panel active">
                <Game type={topic.game} onWin={handleGameWin} />
                {playDone && continuity('Lock it in →', 'reinforce')}
              </div>
            )}
          </div>

          <div className={'panel-wrap' + (tab === 'exercise' ? ' active' : '')}>
            {tab === 'exercise' && hasExercise && (
              <div className="panel active">
                <ExercisePanel
                  topic={topic}
                  code={code}
                  setCode={setCode}
                  running={running}
                  cases={cases}
                  passed={passed}
                  failCount={failCount}
                  hintsRevealed={hintsRevealed}
                  setHintsRevealed={setHintsRevealed}
                  showSolution={showSolution}
                  setShowSolution={setShowSolution}
                  onRun={runExercise}
                  firstExerciseExpanded={firstExerciseExpanded}
                />
                {exDone && !recallDone && continuity('Lock it in →', 'reinforce')}
              </div>
            )}
          </div>

          <div className={'panel-wrap' + (tab === 'reinforce' ? ' active' : '')}>
            {tab === 'reinforce' && (
              <div className="panel active">
                <RecallPanel
                  topic={topic}
                  completed={recallDone}
                  onPass={handleRecallPass}
                  onXP={onXP}
                />
                {recallDone && nextTopicLabel && (
                  <div className="tab-continuity topic-mastered">
                    <p>Topic mastered.</p>
                    <button type="button" className="btn-primary btn-sm" onClick={onGoNextTopic}>Next: {nextTopicLabel}</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {done ? (
            <button type="button" className="btn-primary finish-btn done-state" onClick={handleToggle}>
              Completed (tap to undo)
            </button>
          ) : autoReady ? (
            <p className="topic-auto-complete mono">All tabs complete. Topic marked done.</p>
          ) : (
            <div className="manual-complete-wrap">
              {!showManualComplete ? (
                <button type="button" className="btn-text manual-complete-link" onClick={() => setShowManualComplete(true)}>
                  Having trouble? Mark complete anyway
                </button>
              ) : (
                <button type="button" className="btn-primary finish-btn" onClick={handleToggle}>
                  Mark complete anyway · +10 XP
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
