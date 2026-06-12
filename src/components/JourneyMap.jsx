import React from 'react'
import { CURRICULUM, LORDER } from '../data/curriculum.js'

function levelShort(tag) {
  const m = tag.match(/Level\s*(\d+)/i)
  return m ? 'L' + m[1] : tag
}

export default function JourneyMap({ unlockedFlags, levelProgress, currentLevel, onSelectLevel }) {
  return (
    <nav className="journey-map" aria-label="Learning journey">
      <div className="journey-track">
        {LORDER.map((lv, i) => {
          const data = CURRICULUM[lv]
          const unlocked = unlockedFlags[i]
          const prog = levelProgress(lv)
          const pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0
          const active = currentLevel === lv
          const Node = onSelectLevel && unlocked ? 'button' : 'div'
          return (
            <Node
              key={lv}
              type={Node === 'button' ? 'button' : undefined}
              className={
                'journey-node' +
                (unlocked ? ' unlocked' : ' locked') +
                (active ? ' active' : '') +
                (pct === 100 ? ' complete' : '')
              }
              title={data.name + (unlocked ? ' (' + prog.done + '/' + prog.total + ' topics)' : ' (locked)')}
              onClick={onSelectLevel && unlocked ? () => onSelectLevel(lv) : undefined}
            >
              <span className="journey-lv-num">{levelShort(data.tag)}</span>
              {unlocked && <span className="journey-pct mono">{pct}%</span>}
            </Node>
          )
        })}
      </div>
    </nav>
  )
}
