import React, { useMemo, useState } from 'react'
import { getRecallSet } from '../data/learningLoop.js'
import { isNumericInput, numericMatches, textMatches } from '../utils/answerCheck.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function RecallPanel({ topic, completed, onPass, onXP }) {
  const setDef = useMemo(() => getRecallSet(topic), [topic])
  const [questions, setQuestions] = useState(() => shuffle(setDef.questions))
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(completed)
  const [attempt, setAttempt] = useState(0)
  const [picked, setPicked] = useState(null)
  const [fill, setFill] = useState('')

  const passAt = setDef.passAt ?? Math.ceil(questions.length * 0.8)
  const q = questions[idx]

  const finish = (finalCorrect) => {
    const passed = finalCorrect >= passAt
    setDone(true)
    if (passed) {
      onPass && onPass({ passed: true, correct: finalCorrect, total: questions.length })
      onXP && onXP(5 + finalCorrect)
    }
  }

  const advance = (wasRight) => {
    const c = correct + (wasRight ? 1 : 0)
    if (idx + 1 >= questions.length) {
      finish(c)
      setCorrect(c)
    } else {
      setCorrect(c)
      setIdx((i) => i + 1)
      setPicked(null)
      setFill('')
      setFeedback(null)
    }
  }

  const submitMcq = (i) => {
    if (picked !== null || !q) return
    setPicked(i)
    const ok = i === q.correct
    setFeedback({ ok, text: q.explain })
    setTimeout(() => advance(ok), 800)
  }

  const submitTf = (choice) => {
    if (picked !== null) return
    setPicked(choice)
    const ok = choice === q.answer
    setFeedback({ ok, text: q.explain })
    setTimeout(() => advance(ok), 800)
  }

  const submitFill = () => {
    if (feedback && !feedback.ok && feedback.noAdvance) return
    const accepts = q.accept || []
    const trimmed = fill.trim()

    if (q.numeric) {
      if (!isNumericInput(trimmed)) {
        setFeedback({ ok: false, text: 'Please enter a number.', noAdvance: true })
        return
      }
      const ok = numericMatches(trimmed, accepts)
      if (ok) {
        setFeedback({ ok: true, text: q.explain || 'Correct.' })
        setTimeout(() => advance(true), 800)
      } else {
        const wrongMsg = (q.wrongExplain || q.explain || 'Incorrect.') +
          (trimmed ? " You answered '" + trimmed + "'." : '')
        setFeedback({ ok: false, text: wrongMsg })
        setTimeout(() => advance(false), 1200)
      }
      return
    }

    const ok = textMatches(trimmed, accepts)
    if (ok) {
      setFeedback({ ok: true, text: q.explain || 'Correct.' })
      setTimeout(() => advance(true), 800)
    } else {
      setFeedback({
        ok: false,
        text: (q.wrongExplain || q.explain || 'Incorrect.') + (trimmed ? " You answered '" + trimmed + "'." : '')
      })
      setTimeout(() => advance(false), 1200)
    }
  }

  if (done && (completed || correct >= passAt)) {
    const passed = correct >= passAt || completed
    return (
      <div className="recall-summary">
        <p className="mono">Score {correct}/{questions.length} · Need {passAt} to pass</p>
        {passed ? (
          <p className="recall-pass-msg">Recall passed. Cards scheduled for Review.</p>
        ) : (
          <>
            <p className="recall-fail-msg">Below threshold. Retry with a new shuffle.</p>
            <button type="button" className="btn-primary btn-sm" onClick={() => {
              setDone(false)
              setIdx(0)
              setCorrect(0)
              setFeedback(null)
              setPicked(null)
              setFill('')
              setAttempt((a) => a + 1)
              setQuestions(shuffle(setDef.questions))
            }}>Retry recall</button>
          </>
        )}
        {setDef.todo && <p className="recall-todo">Full 3 to 5 question set coming in a later level pass.</p>}
      </div>
    )
  }

  if (!q) {
    return <p className="empty-state">Recall questions for this topic are not ready yet.</p>
  }

  return (
    <div className="recall-panel">
      <div className="recall-score-bar mono">
        Question {idx + 1}/{questions.length} · Score {correct}/{idx + (picked !== null || feedback ? 1 : 0)}
      </div>
      <div className="recall-q">{q.q}</div>

      {q.type === 'mcq' || q.type === 'apply' ? (
        <div className="opts">
          {q.opts.map((o, i) => {
            let cls = 'opt'
            if (picked !== null) {
              if (i === q.correct) cls += ' correct'
              else if (i === picked) cls += ' wrong'
            }
            return (
              <button key={i} type="button" className={cls} disabled={picked !== null} onClick={() => submitMcq(i)}>{o}</button>
            )
          })}
        </div>
      ) : null}

      {q.type === 'tf' ? (
        <div className="tf-row">
          <button type="button" className="btn-action" disabled={picked !== null} onClick={() => submitTf(true)}>True</button>
          <button type="button" className="btn-action" disabled={picked !== null} onClick={() => submitTf(false)}>False</button>
        </div>
      ) : null}

      {q.type === 'fill' ? (
        <div className="fill-row">
          <input className="fill-input" value={fill} onChange={(e) => setFill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitFill()} />
          <button type="button" className="btn-primary btn-sm" onClick={submitFill}>Check</button>
        </div>
      ) : null}

      {feedback && <div className={'do-feedback ' + (feedback.ok ? 'ok' : 'no')}>{feedback.text}</div>}
    </div>
  )
}
