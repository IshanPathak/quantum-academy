import React, { useEffect, useMemo, useState } from 'react'
import Game from '../games/Games.jsx'
import ResourceCards from './ResourceCards.jsx'

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
  onFeedback
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('learn')
  const [answered, setAnswered] = useState(null)

  const hasGame = !!topic.game
  const hasExercise = !!topic.exercise

  const [code, setCode] = useState(topic.exercise?.starter || '')
  const [running, setRunning] = useState(false)
  const [cases, setCases] = useState([])
  const [passed, setPassed] = useState(false)
  const [failCount, setFailCount] = useState(0)
  const [hintsOpen, setHintsOpen] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  useEffect(() => {
    if (!open) return
    if (!hasExercise) return
    setCode(topic.exercise?.starter || '')
    setCases([])
    setPassed(false)
    setFailCount(0)
    setHintsOpen(false)
    setShowSolution(false)
  }, [open, hasExercise, topic.exercise?.starter])

  const testCases = useMemo(() => topic.exercise?.tests || [], [topic.exercise])
  const hints = topic.exercise?.hints || []

  const switchTab = (next) => {
    setTab(next)
  }

  const answer = (i) => {
    if (answered !== null) return
    setAnswered(i)
    if (i === topic.quiz.correct) {
      onXP(5)
      onFeedback && onFeedback('+5 XP', 'xp')
    }
  }

  const runExercise = async () => {
    if (!hasExercise) return
    setRunning(true)
    setCases([])

    const results = []
    for (const tc of testCases) {
      const worker = createWorker()
      const timeoutMs = 1000
      const res = await new Promise((resolve) => {
        const to = setTimeout(() => {
          try { worker.terminate() } catch {}
          resolve({ ok: false, error: `Timeout after ${timeoutMs}ms` })
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
    } else {
      setFailCount((c) => c + 1)
    }
    setRunning(false)
  }

  const handleToggle = () => {
    const wasDone = done
    onToggle(topic.id)
    if (!wasDone) onFeedback && onFeedback('+10 XP · Topic complete', 'xp')
  }

  return (
    <div ref={(el) => registerRef && registerRef(topic.id, el)} className={'topic' + (done ? ' done' : '') + (open ? ' open' : '')}>
      <div className="topic-head" onClick={() => setOpen((o) => !o)}>
        <div className="topic-check">
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5L5 9L13 1" stroke="#070711" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className="topic-title">{topic.title}</div>
        <div className="topic-chev">▶</div>
      </div>
      {open && (
        <div className="topic-body">
          <div className="tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'learn'} className={'tab tab-learn' + (tab === 'learn' ? ' active' : '')} onClick={() => switchTab('learn')}><span className="tab-ico">📖</span>Learn</button>
            <button type="button" role="tab" aria-selected={tab === 'practice'} className={'tab tab-practice' + (tab === 'practice' ? ' active' : '')} onClick={() => switchTab('practice')}><span className="tab-ico">🛠</span>Do</button>
            {hasGame && <button type="button" role="tab" aria-selected={tab === 'play'} className={'tab tab-play' + (tab === 'play' ? ' active' : '')} onClick={() => switchTab('play')}><span className="tab-ico">🎮</span>Play</button>}
            {hasExercise && <button type="button" role="tab" aria-selected={tab === 'exercise'} className={'tab tab-ex' + (tab === 'exercise' ? ' active' : '')} onClick={() => switchTab('exercise')}><span className="tab-ico">🧪</span>Exercise</button>}
            <button type="button" role="tab" aria-selected={tab === 'reinforce'} className={'tab tab-reinforce' + (tab === 'reinforce' ? ' active' : '')} onClick={() => switchTab('reinforce')}><span className="tab-ico">🎯</span>Recall</button>
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
                {topic.deep && (
                  <div className="deep-dive" dangerouslySetInnerHTML={{ __html: topic.deep }} />
                )}
                {(topic.keyPoints || []).length > 0 && (
                  <ul className="key-points">
                    {topic.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                )}
                <div className="callout"><span className="callout-label">💡 ANALOGY</span>{topic.analogy}</div>
                <ResourceCards resources={topic.res} title="Core resources" />
                <ResourceCards resources={topic.extraResources} title="Go deeper" />
              </div>
            )}
          </div>

          <div className={'panel-wrap' + (tab === 'practice' ? ' active' : '')}>
            {tab === 'practice' && (
              <div className="panel active">
                <ul className="steps">{topic.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>
                {topic.code && <div className="code" dangerouslySetInnerHTML={{ __html: topic.code }} />}
                {!topic.code && !topic.steps?.length && (
                  <p className="empty-state">No practice steps for this topic yet. Review the Learn tab.</p>
                )}
              </div>
            )}
          </div>

          <div className={'panel-wrap' + (tab === 'play' ? ' active' : '')}>
            {tab === 'play' && hasGame && (
              <div className="panel active">
                <Game type={topic.game} onWin={() => { onGameWin && onGameWin(topic.game); onXP(10); onFeedback && onFeedback('+10 XP · Game', 'xp') }} />
              </div>
            )}
          </div>

          <div className={'panel-wrap' + (tab === 'exercise' ? ' active' : '')}>
            {tab === 'exercise' && hasExercise && (
              <div className="panel active">
                <div className="ex-prompt" dangerouslySetInnerHTML={{ __html: topic.exercise.prompt }} />
                {topic.exercise.formatExample && (
                  <p className="ex-format"><b>Output format:</b> {topic.exercise.formatExample}</p>
                )}
                <textarea className="ex-editor" value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} aria-label="Exercise code editor" />
                <div className="ex-actions">
                  <button type="button" className="btn-action" disabled={running} onClick={runExercise}>{running ? 'Running…' : 'Run tests'}</button>
                  {hints.length > 0 && (
                    <button type="button" className="btn-ghost btn-sm" onClick={() => setHintsOpen((o) => !o)}>
                      {hintsOpen ? 'Hide hints' : 'Show hints'}
                    </button>
                  )}
                  {passed && <div className="ex-pass">✓ All tests passed · +25 XP</div>}
                </div>
                {hintsOpen && hints.length > 0 && (
                  <ul className="ex-hints">
                    {hints.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
                {failCount >= 2 && topic.exercise.solution && (
                  <div className="ex-solution-block">
                    {!showSolution ? (
                      <button type="button" className="btn-ghost btn-sm" onClick={() => setShowSolution(true)}>Show solution</button>
                    ) : (
                      <>
                        <p className="ex-solution-label">Reference solution (study, then try again from scratch):</p>
                        <pre className="ex-solution-code">{topic.exercise.solution}</pre>
                      </>
                    )}
                  </div>
                )}
                {cases.length > 0 && (
                  <div className="ex-cases">
                    {cases.map((c, i) => (
                      <div key={i} className={'ex-case ' + (c.ok ? 'ok' : 'no')}>
                        <div className="ex-case-head">{c.ok ? '✓' : '✗'} Case {i + 1}</div>
                        <div className="ex-case-body">
                          <div><b>Input</b><pre>{String(c.input)}</pre></div>
                          <div><b>Expected</b><pre>{String(c.expected)}</pre></div>
                          {c.error ? <div><b>Error</b><pre>{String(c.error)}</pre></div> : <div><b>Output</b><pre>{String(c.output ?? '')}</pre></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="ex-note">Contract: define <b>solve(input)</b> and return a string (unless noted). No imports.</div>
              </div>
            )}
          </div>

          <div className={'panel-wrap' + (tab === 'reinforce' ? ' active' : '')}>
            {tab === 'reinforce' && (
              <div className="panel active">
                <div className="recall-q">{topic.quiz.q}</div>
                <div className="opts">
                  {topic.quiz.opts.map((o, i) => {
                    let cls = 'opt'
                    if (answered !== null) {
                      if (i === topic.quiz.correct) cls += ' correct'
                      else if (i === answered) cls += ' wrong'
                    }
                    return <button key={i} type="button" className={cls} disabled={answered !== null} onClick={() => answer(i)}>{o}</button>
                  })}
                </div>
                {answered !== null && (
                  <div className={'fb show ' + (answered === topic.quiz.correct ? 'ok' : 'no')}>
                    {answered === topic.quiz.correct ? '✓ ' + topic.quiz.ok : '✗ ' + topic.quiz.no}
                  </div>
                )}
              </div>
            )}
          </div>

          <button type="button" className="finish-btn" onClick={handleToggle}>
            {done ? '✓ Completed (tap to undo)' : 'Complete · +10 XP'}
          </button>
        </div>
      )}
    </div>
  )
}
