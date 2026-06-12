import React, { useState } from 'react'
import { getExerciseScaffold } from '../data/learningLoop.js'

export default function ExercisePanel({
  topic,
  code,
  setCode,
  running,
  cases,
  passed,
  failCount,
  hintsRevealed,
  setHintsRevealed,
  showSolution,
  setShowSolution,
  onRun,
  firstExerciseExpanded,
  exerciseAttempts
}) {
  const ex = topic.exercise
  const scaffold = getExerciseScaffold(topic)
  const [pseudoOpen, setPseudoOpen] = useState(firstExerciseExpanded)
  const [syntaxOpen, setSyntaxOpen] = useState(false)

  const hints = scaffold.hints.length ? scaffold.hints : (ex.hints || [])
  const revealHint = () => setHintsRevealed((n) => Math.min(n + 1, hints.length))

  return (
    <>
      <div className="ex-prompt" dangerouslySetInnerHTML={{ __html: ex.prompt }} />
      {ex.formatExample && (
        <p className="ex-format"><b>Output format:</b> {ex.formatExample}</p>
      )}

      <div className="ex-scaffold">
        <button type="button" className="scaffold-toggle" onClick={() => setPseudoOpen((o) => !o)}>
          Pseudocode {pseudoOpen ? '−' : '+'}
        </button>
        {pseudoOpen && (
          <ol className="pseudo-list">
            {scaffold.pseudocode.map((line, i) => <li key={i}>{line}</li>)}
          </ol>
        )}
        <button type="button" className="scaffold-toggle" onClick={() => setSyntaxOpen((o) => !o)}>
          JS syntax help {syntaxOpen ? '−' : '+'}
        </button>
        {syntaxOpen && (
          <ul className="syntax-list">
            {scaffold.syntaxHelp.map((line, i) => <li key={i}><code>{line}</code></li>)}
          </ul>
        )}
      </div>

      <textarea className="ex-editor" value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} aria-label="Exercise code editor" />

      <div className="ex-actions">
        <button type="button" className="btn-action" disabled={running} onClick={onRun}>{running ? 'Running…' : 'Run tests'}</button>
        {hints.length > 0 && hintsRevealed < hints.length && (
          <button type="button" className="btn-ghost btn-sm" onClick={revealHint}>
            Hint {hintsRevealed + 1} of {hints.length}
          </button>
        )}
        {passed && <div className="ex-pass">All tests passed · +25 XP</div>}
      </div>

      {hintsRevealed > 0 && (
        <ul className="ex-hints">
          {hints.slice(0, hintsRevealed).map((h, i) => (
            <li key={i}><span className="hint-label mono">Hint {i + 1}</span> {h}</li>
          ))}
        </ul>
      )}

      {failCount >= 2 && ex.solution && (
        <div className="ex-solution-block">
          {!showSolution ? (
            <button type="button" className="btn-ghost btn-sm" onClick={() => setShowSolution(true)}>Show solution</button>
          ) : (
            <>
              <p className="ex-solution-label">Reference solution (study, then try again from scratch):</p>
              <pre className="ex-solution-code">{ex.solution}</pre>
            </>
          )}
        </div>
      )}

      {cases.length > 0 && (
        <div className="ex-cases">
          {cases.map((c, i) => (
            <div key={i} className={'ex-case ' + (c.ok ? 'ok' : 'no')}>
              <div className="ex-case-head">{c.ok ? 'Pass' : 'Fail'} · Case {i + 1}</div>
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
    </>
  )
}
