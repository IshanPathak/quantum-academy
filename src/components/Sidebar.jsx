import React, { useState } from 'react'
import { CURRICULUM, LORDER } from '../data/curriculum.js'
import { IconCheck, IconLock } from './Icons.jsx'

function levelLabel(tag) {
  const m = tag.match(/Level\s*(\d+)/i)
  return m ? 'L' + m[1] : tag
}

export default function Sidebar({
  unlockedFlags,
  doneMap,
  selected,
  onSelectTopic,
  onClose,
  isOpen = false
}) {
  const [expanded, setExpanded] = useState(() => {
    const init = {}
    LORDER.forEach((lv, i) => {
      init[lv] = i === 0 || (selected?.levelId === lv)
    })
    return init
  })

  const toggleLevel = (lv) => {
    setExpanded((e) => ({ ...e, [lv]: !e[lv] }))
  }

  return (
    <aside className={'sidebar' + (isOpen ? ' open' : '')} aria-label="Curriculum">
      <div className="sidebar-head">
        <div className="sidebar-brand">Quantum Academy</div>
        {onClose && (
          <button type="button" className="btn-text sidebar-close" onClick={onClose} aria-label="Close menu">
            Close
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        {LORDER.map((lv, idx) => {
          const data = CURRICULUM[lv]
          const unlocked = unlockedFlags[idx]
          const open = expanded[lv]
          const isActiveLevel = selected?.levelId === lv
          return (
            <div key={lv} className={'sidebar-level-block' + (isActiveLevel ? ' active-level' : '')}>
              <button
                type="button"
                className={'sidebar-level-btn' + (unlocked ? '' : ' locked')}
                onClick={() => unlocked && toggleLevel(lv)}
                aria-expanded={open}
                disabled={!unlocked}
              >
                <span className="sidebar-lv-num">{levelLabel(data.tag)}</span>
                <span className="sidebar-lv-name">{data.name}</span>
                {!unlocked && <IconLock />}
                <span className="sidebar-lv-chev" aria-hidden>{open ? '−' : '+'}</span>
              </button>
              {unlocked && open && (
                <ul className="sidebar-topics">
                  {data.topics.map((t) => {
                    const active = selected?.topicId === t.id
                    const done = !!doneMap[t.id]
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          className={'sidebar-topic-btn' + (active ? ' active' : '') + (done ? ' done' : '')}
                          onClick={() => {
                            onSelectTopic(lv, t.id)
                            onClose && onClose()
                          }}
                        >
                          <span className="sidebar-topic-title">{t.title}</span>
                          {done && <span className="sidebar-topic-check"><IconCheck /></span>}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
