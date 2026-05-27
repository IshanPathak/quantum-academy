import React, { useMemo } from 'react'
import { CURRICULUM, LORDER } from '../data/curriculum.js'

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function Dashboard({ state, totals, levelProgress, onImportState }) {
  const perLevel = useMemo(() => {
    return LORDER.map(lv => {
      const p = levelProgress(lv)
      return { lv, name: CURRICULUM[lv].name, done: p.done, total: p.total, pct: p.total ? p.done / p.total : 0 }
    })
  }, [levelProgress])

  const gamesPlayed = Object.values(state.games || {}).reduce((a, b) => a + (b || 0), 0)
  const exercisesPassed = Object.values(state.exercises || {}).filter(e => e?.passed).length
  const reviewCards = Object.keys(state.review?.cards || {}).length

  return (
    <div className="dash">
      <div className="dash-head">
        <div className="dash-title">📊 Dashboard</div>
        <div className="dash-sub">Your progress snapshot</div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-k">Total XP</div>
          <div className="dash-v">{state.xp}</div>
        </div>
        <div className="dash-card">
          <div className="dash-k">Streak</div>
          <div className="dash-v">{state.streak}</div>
        </div>
        <div className="dash-card">
          <div className="dash-k">Topics complete</div>
          <div className="dash-v">{totals.done}/{totals.total}</div>
        </div>
        <div className="dash-card">
          <div className="dash-k">Games played</div>
          <div className="dash-v">{gamesPlayed}</div>
        </div>
        <div className="dash-card">
          <div className="dash-k">Exercises passed</div>
          <div className="dash-v">{exercisesPassed}</div>
        </div>
        <div className="dash-card">
          <div className="dash-k">Review cards rated</div>
          <div className="dash-v">{reviewCards}</div>
        </div>
      </div>

      <div className="dash-section">
        <div className="dash-section-title">Level completion</div>
        <div className="dash-bars">
          {perLevel.map(l => (
            <div key={l.lv} className="dash-bar">
              <div className="dash-bar-meta">
                <span className="dash-bar-name">{l.lv}</span>
                <span className="dash-bar-small">{l.done}/{l.total}</span>
              </div>
              <div className="dash-bar-track">
                <div className="dash-bar-fill" style={{ width: `${Math.round(l.pct * 100)}%` }} />
              </div>
              <div className="dash-bar-label">{l.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-section">
        <div className="dash-section-title">Backup</div>
        <div className="dash-actions">
          <button className="btn-action" onClick={() => downloadJson('quantum-academy-progress.json', state)}>Export progress</button>
          <label className="btn-action" style={{ cursor: 'pointer' }}>
            Import progress
            <input
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const reader = new FileReader()
                reader.onload = () => {
                  try {
                    const obj = JSON.parse(String(reader.result || '{}'))
                    onImportState(obj)
                  } catch {}
                }
                reader.readAsText(f)
              }}
            />
          </label>
        </div>
        <div className="dash-note">Export/import saves topics, XP, streak, games, exercises, review schedule, settings, and onboarding state (key: qacad_react_v1).</div>
      </div>
    </div>
  )
}

