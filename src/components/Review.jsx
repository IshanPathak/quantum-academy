import React, { useMemo, useState } from 'react'
import { CURRICULUM, LORDER } from '../data/curriculum.js'

function buildCards() {
  const out = []
  LORDER.forEach((lv) => {
    const level = CURRICULUM[lv]
    level.topics.forEach((t) => {
      if (t.quiz?.q && Array.isArray(t.quiz?.opts)) {
        out.push({
          id: `quiz:${t.id}`,
          topicId: t.id,
          levelId: lv,
          levelName: level.name,
          q: t.quiz.q,
          a: t.quiz.opts[t.quiz.correct] ?? ''
        })
      }
      ;(t.flashcards || []).forEach((fc, i) => {
        out.push({
          id: `fc:${t.id}:${i}`,
          topicId: t.id,
          levelId: lv,
          levelName: level.name,
          q: fc.q,
          a: fc.a
        })
      })
    })
  })
  return out
}

const ALL_CARDS = buildCards()

export default function Review({ reviewState, onRate, onXP }) {
  const [show, setShow] = useState(false)

  const dueCards = useMemo(() => {
    const now = Date.now()
    const map = reviewState?.cards || {}
    return ALL_CARDS
      .map(c => {
        const s = map[c.id]
        const due = s?.due ?? 0
        return { ...c, due }
      })
      .filter(c => c.due <= now)
      .sort((a, b) => a.due - b.due)
  }, [reviewState])

  const card = dueCards[0] || null

  const rate = (r) => {
    if (!card) return
    onRate(card.id, r)
    if (r === 'good' || r === 'easy') onXP(2)
    setShow(false)
  }

  return (
    <div className="review">
      <div className="review-head">
        <div className="review-title">🔁 Review</div>
        <div className="review-sub">{dueCards.length} due</div>
      </div>

      {!card && (
        <div className="review-empty">
          <div className="review-big">All caught up.</div>
          <div className="review-small">Come back later for spaced repetition.</div>
        </div>
      )}

      {card && (
        <div className="review-card">
          <div className="review-meta">{card.levelName}</div>
          <div className="review-q">{card.q}</div>

          {!show ? (
            <button className="btn-action" onClick={() => setShow(true)}>Show answer</button>
          ) : (
            <>
              <div className="review-a">{card.a}</div>
              <div className="review-rate">
                <button className="btn-action" onClick={() => rate('again')}>Again</button>
                <button className="btn-action" onClick={() => rate('hard')}>Hard</button>
                <button className="btn-action" onClick={() => rate('good')}>Good</button>
                <button className="btn-action" onClick={() => rate('easy')}>Easy</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

