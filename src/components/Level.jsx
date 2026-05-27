import React, { useMemo, useState, useEffect } from 'react'
import Topic from './Topic.jsx'

function groupByTrack(topics) {
  const groups = []
  let cur = { track: null, label: null, topics: [] }

  topics.forEach((t) => {
    const tr = t.track || null
    if (tr !== cur.track) {
      if (cur.topics.length) groups.push(cur)
      cur = {
        track: tr,
        label: t.trackLabel || null,
        topics: []
      }
    }
    cur.topics.push(t)
  })
  if (cur.topics.length) groups.push(cur)
  return groups
}

function TrackSection({ label, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={'track-section' + (open ? ' open' : '')}>
      <button type="button" className="track-head" onClick={() => setOpen(o => !o)}>
        <span className="track-title">{label}</span>
        <span className="track-chev">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="track-body">{children}</div>}
    </div>
  )
}

export default function Level({ lv, data, unlocked, progress, doneMap, onToggle, onXP, onGameWin, onExercisePass, onFeedback, autoOpen, registerTopicRef }) {
  const [open, setOpen] = useState(autoOpen)
  useEffect(() => { if (autoOpen) setOpen(true) }, [autoOpen])

  const groups = useMemo(() => groupByTrack(data.topics), [data.topics])

  const stars = (() => {
    const cap = Math.min(progress.total, 5)
    const n = Math.min(progress.done, cap)
    return '★'.repeat(n) + '☆'.repeat(cap - n)
  })()

  const renderTopic = (t) => (
    <Topic
      key={t.id}
      topic={t}
      done={!!doneMap[t.id]}
      onToggle={onToggle}
      onXP={onXP}
      onGameWin={onGameWin}
      onExercisePass={onExercisePass}
      onFeedback={onFeedback}
      registerRef={registerTopicRef}
    />
  )

  return (
    <div className={'level lv-' + data.color + (open && unlocked ? ' open' : '') + (!unlocked ? ' locked' : '')}>
      <div className="level-card">
        <div className="level-head" onClick={() => unlocked && setOpen(o => !o)}>
          <div className="level-icon">{data.icon}</div>
          <div className="level-meta">
            <div className="level-tag">{data.tag}</div>
            <div className="level-name">{data.name}</div>
            <div className="level-desc">{data.desc}</div>
          </div>
          <div className="level-right">
            <div className="level-stars">{stars}</div>
            <div className="lv-mini"><div className="lv-mini-fill" style={{ width: (progress.done / progress.total * 100) + '%' }} /></div>
          </div>
          <div className="level-chev">▾</div>
        </div>
        {open && (
          <div className="level-body">
            {unlocked
              ? groups.map((g, i) => {
                  if (g.track && g.label) {
                    return (
                      <TrackSection key={g.track} label={g.label} defaultOpen={i < 2}>
                        {g.topics.map(renderTopic)}
                      </TrackSection>
                    )
                  }
                  return g.topics.map(renderTopic)
                })
              : (
                <div className="lock-msg">
                  <span className="lock-icon" aria-hidden="true">🔒</span>
                  <p>Finish every topic in the previous level to unlock <b>{data.name}</b>.</p>
                  <p className="lock-hint">Complete topics in order. Each level builds on the last.</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}
