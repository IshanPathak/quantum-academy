import React, { useState, useMemo } from 'react'
import { GLOSSARY } from '../data/glossary.js'

export default function Glossary({ open, onClose }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return GLOSSARY
    return GLOSSARY.filter(g => g.term.toLowerCase().includes(s) || g.def.toLowerCase().includes(s))
  }, [q])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal glossary-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>📚 Glossary</h2>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>
        <input
          className="search-input glossary-search"
          placeholder="Filter terms…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <div className="glossary-list">
          {filtered.map(g => (
            <div key={g.term} className="glossary-item">
              <div className="glossary-term">{g.term}</div>
              <div className="glossary-def">{g.def}</div>
            </div>
          ))}
          {filtered.length === 0 && <p className="glossary-empty">No matches.</p>}
        </div>
      </div>
    </div>
  )
}
