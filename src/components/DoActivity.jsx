import React, { useState, useRef, useEffect, useCallback } from 'react'
import { getDoActivity } from '../data/learningLoop.js'
import { drawPlotGrid, pixelToGrid, GRID_SIZE } from '../utils/plotGrid.js'

function VectorCanvas({ vector, onClick, className }) {
  const canvasRef = useRef(null)
  const draw = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    drawPlotGrid(c.getContext('2d'), vector)
  }, [vector])

  useEffect(() => {
    draw()
  }, [draw])

  const handleClick = (e) => {
    if (!onClick) return
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    const px = (e.clientX - r.left) * (GRID_SIZE / r.width)
    const py = (e.clientY - r.top) * (GRID_SIZE / r.height)
    const { vx, vy } = pixelToGrid(px, py)
    onClick(vx, vy)
  }

  return (
    <canvas
      ref={canvasRef}
      className={className || 'vec-grid'}
      width={GRID_SIZE}
      height={GRID_SIZE}
      onClick={handleClick}
    />
  )
}

function VectorGuidedDo({ activity, onComplete }) {
  const steps = activity.steps || []
  const practice = activity.practice || {}
  const [phase, setPhase] = useState('steps')
  const [step, setStep] = useState(0)
  const [hintOpen, setHintOpen] = useState(false)
  const [vector, setVector] = useState(undefined)
  const [feedback, setFeedback] = useState(null)
  const target = practice.target || [0, 0]

  if (phase === 'steps') {
    const last = step >= steps.length - 1
    return (
      <div className="do-activity">
        <div className="guided-step">
          <span className="guided-step-label mono">Step {step + 1}/{steps.length}</span>
          <h3 className="guided-step-title">{steps[step].title}</h3>
          <p className="guided-step-body">{steps[step].body}</p>
        </div>
        {step === 0 && <VectorCanvas />}
        <div className="do-actions">
          {step > 0 && (
            <button type="button" className="btn-ghost btn-sm" onClick={() => setStep((s) => s - 1)}>Back</button>
          )}
          {!last ? (
            <button type="button" className="btn-primary btn-sm" onClick={() => setStep((s) => s + 1)}>Next</button>
          ) : (
            <button type="button" className="btn-primary btn-sm" onClick={() => setPhase('practice')}>Try it yourself</button>
          )}
        </div>
      </div>
    )
  }

  const checkPlot = (vx, vy) => {
    setVector({ vx, vy })
    const ok = vx === target[0] && vy === target[1]
    if (ok) {
      setFeedback({ ok: true, text: 'Correct. [' + target[0] + ', ' + target[1] + '] matches the grid.' })
      setTimeout(() => onComplete && onComplete({ score: 1, total: 1 }), 700)
    } else {
      setFeedback({
        ok: false,
        text: 'Not quite. You plotted [' + vx + ', ' + vy + ']. Target was [' + target[0] + ', ' + target[1] + '].'
      })
    }
  }

  return (
    <div className="do-activity">
      <p className="do-prompt">Place the vector <span className="mono">[{target[0]}, {target[1]}]</span> on the grid.</p>
      {hintOpen && practice.hint && <p className="do-hint">{practice.hint}</p>}
      {feedback && <div className={'do-feedback ' + (feedback.ok ? 'ok' : 'no')}>{feedback.text}</div>}
      <VectorCanvas vector={vector} onClick={checkPlot} />
      <div className="do-actions">
        <button type="button" className="btn-ghost btn-sm" onClick={() => setHintOpen((o) => !o)}>
          {hintOpen ? 'Hide hint' : 'Show hint'}
        </button>
      </div>
    </div>
  )
}

function GuidedDo({ activity, onComplete }) {
  const [step, setStep] = useState(0)
  const steps = activity.steps || []
  const last = step >= steps.length - 1

  return (
    <div className="do-activity">
      <div className="guided-step">
        <span className="guided-step-label mono">Step {step + 1}/{steps.length}</span>
        <h3 className="guided-step-title">{steps[step].title}</h3>
        <p className="guided-step-body">{steps[step].body}</p>
      </div>
      <div className="do-actions">
        {step > 0 && (
          <button type="button" className="btn-ghost btn-sm" onClick={() => setStep((s) => s - 1)}>Back</button>
        )}
        {!last ? (
          <button type="button" className="btn-primary btn-sm" onClick={() => setStep((s) => s + 1)}>Next</button>
        ) : (
          <button type="button" className="btn-primary btn-sm" onClick={() => onComplete && onComplete({ score: 1, total: 1 })}>Finish</button>
        )}
      </div>
    </div>
  )
}

function FillBlankDo({ activity, onComplete }) {
  const rounds = activity.rounds || []
  const [round, setRound] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const cur = rounds[round]

  const norm = (s) => s.replace(/\s/g, '').toLowerCase()

  const check = () => {
    const ok = cur.accept.some((a) => norm(a) === norm(input))
    if (ok) {
      const ns = score + 1
      setScore(ns)
      setFeedback({ ok: true, text: cur.explain })
      setTimeout(() => {
        if (round + 1 >= rounds.length) {
          onComplete && onComplete({ score: ns, total: rounds.length })
        } else {
          setRound((r) => r + 1)
          setInput('')
          setFeedback(null)
        }
      }, 900)
    } else {
      setFeedback({ ok: false, text: 'Try again. ' + (cur.explain || '') })
    }
  }

  if (!cur) return null

  return (
    <div className="do-activity">
      <p className="do-prompt">{cur.prompt}</p>
      <div className="fill-row">
        <input className="fill-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} />
        <button type="button" className="btn-primary btn-sm" onClick={check}>Check</button>
      </div>
      {feedback && <div className={'do-feedback ' + (feedback.ok ? 'ok' : 'no')}>{feedback.text}</div>}
      <p className="do-round mono">Round {round + 1}/{rounds.length}</p>
    </div>
  )
}

function TrueFalseDo({ activity, onComplete }) {
  const statements = activity.statements || []
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const cur = statements[idx]

  const answer = (choice) => {
    const ok = choice === cur.answer
    const ns = score + (ok ? 1 : 0)
    setFeedback({ ok, text: cur.explain })
    setTimeout(() => {
      if (idx + 1 >= statements.length) {
        onComplete && onComplete({ score: ns, total: statements.length })
      } else {
        setIdx((i) => i + 1)
        setFeedback(null)
        setScore(ns)
      }
    }, 900)
  }

  if (!cur) return <div className="do-complete"><p>Do complete.</p></div>

  return (
    <div className="do-activity">
      <p className="do-prompt">{cur.text}</p>
      <div className="tf-row">
        <button type="button" className="btn-action" onClick={() => answer(true)}>True</button>
        <button type="button" className="btn-action" onClick={() => answer(false)}>False</button>
      </div>
      {feedback && <div className={'do-feedback ' + (feedback.ok ? 'ok' : 'no')}>{feedback.text}</div>}
      <p className="do-round mono">{idx + 1}/{statements.length}</p>
    </div>
  )
}

function McqDo({ activity, onComplete }) {
  const rounds = activity.rounds || []
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [picked, setPicked] = useState(null)
  const cur = rounds[round]

  const pick = (i) => {
    if (picked !== null) return
    setPicked(i)
    const ok = i === cur.correct
    const ns = score + (ok ? 1 : 0)
    setFeedback({ ok, text: cur.explain })
    setTimeout(() => {
      if (round + 1 >= rounds.length) {
        onComplete && onComplete({ score: ns, total: rounds.length })
      } else {
        setRound((r) => r + 1)
        setPicked(null)
        setFeedback(null)
        setScore(ns)
      }
    }, 900)
  }

  if (!cur) return <div className="do-complete"><p>Do complete.</p></div>

  return (
    <div className="do-activity">
      <p className="do-prompt">{cur.q}</p>
      <div className="opts">
        {cur.opts.map((o, i) => {
          let cls = 'opt'
          if (picked !== null) {
            if (i === cur.correct) cls += ' correct'
            else if (i === picked) cls += ' wrong'
          }
          return (
            <button key={i} type="button" className={cls} disabled={picked !== null} onClick={() => pick(i)}>{o}</button>
          )
        })}
      </div>
      {feedback && <div className={'do-feedback ' + (feedback.ok ? 'ok' : 'no')}>{feedback.text}</div>}
      <p className="do-round mono">Round {round + 1}/{rounds.length}</p>
    </div>
  )
}

function DoCompletionPanel({ score, total, onContinue }) {
  return (
    <div className="do-complete">
      <p className="do-complete-title">Do complete</p>
      {total > 1 && (
        <p className="do-complete-score mono">Score {score}/{total}</p>
      )}
      <button type="button" className="btn-primary btn-sm" onClick={onContinue}>Continue</button>
    </div>
  )
}

export default function DoActivity({ topic, completed, onComplete }) {
  const activity = getDoActivity(topic)
  const [pending, setPending] = useState(null)

  const handleChildComplete = (result) => {
    const total = result?.total ?? 1
    const score = result?.score ?? total
    setPending({ score, total })
  }

  const finish = () => {
    setPending(null)
    onComplete && onComplete()
  }

  if (completed) {
    return (
      <div className="do-complete">
        <p className="do-complete-title">Do complete for this topic.</p>
      </div>
    )
  }

  if (pending) {
    return <DoCompletionPanel score={pending.score} total={pending.total} onContinue={finish} />
  }

  return (
    <div className="do-wrap">
      <p className="do-intro">{activity.intro}</p>
      {activity.type === 'vectorGuided' && <VectorGuidedDo activity={activity} onComplete={handleChildComplete} />}
      {activity.type === 'guided' && <GuidedDo activity={activity} onComplete={handleChildComplete} />}
      {activity.type === 'fillBlank' && <FillBlankDo activity={activity} onComplete={handleChildComplete} />}
      {activity.type === 'trueFalse' && <TrueFalseDo activity={activity} onComplete={handleChildComplete} />}
      {activity.type === 'mcq' && <McqDo activity={activity} onComplete={handleChildComplete} />}
    </div>
  )
}
