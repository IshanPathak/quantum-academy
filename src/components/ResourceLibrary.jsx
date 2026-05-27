import React, { useMemo, useState } from 'react'
import { collectAllResources, RESOURCE_TYPE_LABELS } from '../utils/resources.js'

export default function ResourceLibrary({ onJump }) {
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const items = useMemo(() => collectAllResources(), [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return items.filter((it) => {
      if (typeFilter !== 'all' && it.type !== typeFilter) return false
      if (!qq) return true
      return (
        it.name.toLowerCase().includes(qq) ||
        it.topicTitle.toLowerCase().includes(qq) ||
        it.levelName.toLowerCase().includes(qq) ||
        it.url.toLowerCase().includes(qq)
      )
    })
  }, [items, q, typeFilter])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach((it) => {
      const k = it.levelName
      if (!map[k]) map[k] = []
      map[k].push(it)
    })
    return map
  }, [filtered])

  return (
    <div className="resource-library">
      <div className="page-head">
        <h1 className="page-title">Resource Library</h1>
        <p className="page-lead">Every curated link in the curriculum, grouped by level.</p>
      </div>
      <div className="resource-lib-filters">
        <input
          className="search-input resource-lib-search"
          type="search"
          placeholder="Search resources…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search resources"
        />
        <select className="resource-lib-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by type">
          <option value="all">All types</option>
          {Object.entries(RESOURCE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      {Object.keys(grouped).length === 0 && (
        <p className="empty-state">No resources match your search.</p>
      )}
      {Object.entries(grouped).map(([levelName, list]) => (
        <section key={levelName} className="resource-lib-group">
          <h2 className="resource-lib-group-title">{levelName}</h2>
          <div className="resource-grid">
            {list.map((it) => (
              <article key={it.id} className={'resource-card type-' + it.type}>
                <span className="resource-type-badge">{RESOURCE_TYPE_LABELS[it.type]}</span>
                {it.section === 'deeper' && <span className="resource-deeper-badge">Go deeper</span>}
                <h3 className="resource-card-title">{it.name}</h3>
                <p className="resource-card-meta">{it.topicTitle}</p>
                <div className="resource-card-actions">
                  <a className="btn-primary btn-sm" href={it.url} target="_blank" rel="noopener noreferrer">Open</a>
                  {onJump && (
                    <button type="button" className="btn-ghost btn-sm" onClick={() => onJump(it.levelId, it.topicId)}>
                      Go to topic
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
