import React from 'react'
import { CURRICULUM, LORDER } from '../data/curriculum.js'

export default function JourneyMap({ unlockedFlags, levelProgress, currentLevel }) {
  return (
    <nav className="journey-map" aria-label="Learning journey">
      <div className="journey-track">
        {LORDER.map((lv, i) => {
          const data = CURRICULUM[lv]
          const unlocked = unlockedFlags[i]
          const prog = levelProgress(lv)
          const pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0
          const active = currentLevel === lv
          return (
            <div
              key={lv}
              className={
                'journey-node' +
                (unlocked ? ' unlocked' : ' locked') +
                (active ? ' active' : '') +
                (pct === 100 ? ' complete' : '')
              }
              title={data.name + (unlocked ? ` (${prog.done}/${prog.total})` : ' (locked)')}
            >
              <span className="journey-icon">{data.icon}</span>
              <span className="journey-lv">{data.tag.replace('Level ', 'L')}</span>
              {unlocked && <span className="journey-pct">{pct}%</span>}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
