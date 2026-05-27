import React, { useState, useMemo, useRef, useEffect } from 'react'
import { CURRICULUM, LORDER } from '../data/curriculum.js'

function allTopics() {
  const out = []
  LORDER.forEach(lv => {
    const level = CURRICULUM[lv]
    level.topics.forEach(t => {
      out.push({ ...t, levelId: lv, levelName: level.name, levelTag: level.tag })
    })
  })
  return out
}

const TOPICS = allTopics()

export default function SearchBar({ onJump }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return TOPICS.filter(t =>
      t.title.toLowerCase().includes(s) ||
      t.learn.toLowerCase().includes(s) ||
      t.levelName.toLowerCase().includes(s)
    ).slice(0, 8)
  }, [q])

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const pick = (t) => {
    setQ('')
    setOpen(false)
    onJump(t.levelId, t.id)
  }

  return (
    <div className="search-wrap" ref={ref}>
      <input
        className="search-input"
        placeholder="Search topics…"
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="search-drop">
          {results.map(t => (
            <button key={t.id} type="button" className="search-item" onClick={() => pick(t)}>
              <span className="search-item-title">{t.title}</span>
              <span className="search-item-meta">{t.levelTag} · {t.levelName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
