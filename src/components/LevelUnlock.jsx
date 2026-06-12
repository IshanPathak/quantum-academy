import React, { useEffect } from 'react'
import { CURRICULUM } from '../data/curriculum.js'

export default function LevelUnlock({ levelId, onDismiss }) {
  const data = CURRICULUM[levelId]
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onDismiss() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDismiss])

  if (!data) return null
  return (
    <div className="modal-backdrop level-unlock-backdrop" role="dialog" aria-modal="true" aria-labelledby="unlock-title">
      <div className="level-unlock-card">
        <div className="level-unlock-badge mono">{data.tag}</div>
        <h2 id="unlock-title" className="level-unlock-title">Level unlocked</h2>
        <p className="level-unlock-name">{data.name}</p>
        <p className="level-unlock-desc">{data.desc}</p>
        <button type="button" className="btn-primary" onClick={onDismiss}>Continue learning</button>
      </div>
    </div>
  )
}
